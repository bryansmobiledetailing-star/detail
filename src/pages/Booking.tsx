import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Car, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  User,
  Info,
  CreditCard as CardIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS, SERVICES } from '../data/services';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, parseISO } from 'date-fns';
import { getSquareHeaders, getSquareAppId, getSquareLocationId } from '../lib/config';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

type Step = 'service' | 'size' | 'addons' | 'datetime' | 'details' | 'payment' | 'success';

interface SquareService {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  variations: {
    id: string;
    name: string;
    duration: string;
    price: number;
  }[];
}

const formatDuration = (ms: number | string) => {
  const mins = Math.floor(Number(ms) / (60 * 1000));
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours > 0 && remainingMins > 0) return `${hours}h ${remainingMins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');

  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<SquareService[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedService, setSelectedService] = useState<SquareService | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0 && preSelectedServiceId && !selectedService) {
      const localService = SERVICES.find(s => s.id === preSelectedServiceId);
      if (localService) {
        const baseName = localService.name.split(' (')[0].toLowerCase();
        const matched = services.find(s => s.name.toLowerCase().includes(baseName));
        if (matched) {
          setSelectedService(matched);
          setStep('size');
        }
      }
    }
  }, [services, preSelectedServiceId, selectedService]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const [svcRes, catRes] = await Promise.all([
        fetch('/api/catalog/services', { headers: getSquareHeaders() }),
        fetch('/src/data/services.ts').then(() => {
          // Categories are static in our data file, but we can also infer from services
          return null;
        })
      ]);
      
      const data = await svcRes.json();
      setServices(data);
    } catch (err) {
      setError('Failed to load services. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const mainServices = services.filter(s => {
    // Exclude add-ons by looking at categoryId or name
    const category = s.categoryId ? s.categoryId.toLowerCase() : '';
    const name = s.name.toLowerCase();
    return !category.includes('add-on') && !name.includes('add-on');
  });

  const availableAddons = services.filter(s => {
    const category = s.categoryId ? s.categoryId.toLowerCase() : '';
    const name = s.name.toLowerCase();
    return category.includes('add-on') || name.includes('add-on');
  });

  const fetchAvailability = async (date: Date) => {
    if (!selectedService || !selectedSize) return;
    
    setSlotsLoading(true);
    setError(null);
    try {
      // Find variation that matches the selected size exactly
      const variation = selectedService.variations.find(v => v.name === selectedSize);
      const vId = variation?.id || selectedService.variations[0].id;
      
      const start = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
      const end = format(date, "yyyy-MM-dd'T'23:59:59'Z'");
      
      const res = await fetch(`/api/availability?start=${start}&end=${end}&serviceVariationId=${vId}`, {
        headers: getSquareHeaders()
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch availability');
      }
      const data = await res.json();
      setSlots(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error checking availability. Please try another date.');
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && step === 'datetime') {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, step]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    setBookingLoading(true);
    setError(null);
    try {
      const variation = selectedService?.variations.find(v => v.name === selectedSize);
      const vId = variation?.id || selectedService?.variations[0].id;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getSquareHeaders()
        },
        body: JSON.stringify({
          startAt: selectedSlot.startAt,
          serviceVariationIds: [vId],
          customer: customerInfo
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Booking failed');
      }
      
      const booking = await res.json();
      setPendingBooking(booking);

      // Save to Firestore for user history and admin dashboard
      try {
        const bookingData = {
          userId: auth.currentUser?.uid || 'guest',
          squareBookingId: booking.id,
          startAt: selectedSlot.startAt,
          locationId: booking.locationId,
          serviceVariationIds: [vId],
          customer: customerInfo,
          totalPrice: totalPrice(),
          status: 'pending_payment',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);

        // If user is logged in, link the booking to their profile
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            bookings: arrayUnion(bookingRef.id),
            updatedAt: serverTimestamp()
          });
        }
      } catch (fsErr) {
        console.error("Firestore Booking Sync Error:", fsErr);
      }
      
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Booking failed. Our schedule might have just filled up. Please refresh or call us.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async (token: any) => {
    if (!pendingBooking) return;
    setPaymentLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getSquareHeaders()
        },
        body: JSON.stringify({
          sourceId: token.token,
          amount: 5000, // $50.00 in cents
          customerId: pendingBooking.customerId,
          bookingId: pendingBooking.id
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Payment failed');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try another card or contact us.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 'service') setStep('size');
    else if (step === 'size') setStep('addons');
    else if (step === 'addons') setStep('datetime');
    else if (step === 'datetime') setStep('details');
    else if (step === 'payment') setStep('success');
  };

  const prevStep = () => {
    if (step === 'size') setStep('service');
    else if (step === 'addons') setStep('size');
    else if (step === 'datetime') setStep('addons');
    else if (step === 'details') setStep('datetime');
    else if (step === 'payment') setStep('details');
  };

  const totalPrice = () => {
    if (!selectedService || !selectedSize) return 0;
    const base = selectedService.variations.find(v => v.name === selectedSize)?.price || 0;
    const addons = selectedAddons.reduce((sum, id) => {
      const addon = availableAddons.find(a => a.id === id);
      const price = addon?.variations?.[0]?.price || 0;
      return sum + price;
    }, 0);
    return base + addons;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-zinc-900 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 font-medium">Initializing Booking System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Book Your Detailing</h1>
          <p className="text-zinc-600">Professional auto detailing at your convenience.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto px-4">
          {['Service', 'Details', 'Payment', 'Success'].map((label, i) => {
            const steps: Step[] = ['service', 'details', 'payment', 'success'];
            const isActive = steps.indexOf(step as any) >= i;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`h-2 w-12 rounded-full ${isActive ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'service' && (
                <motion.div
                  key="service"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-zinc-900 mb-4">Select a Service</h2>
                  <div className="grid gap-3">
                    {mainServices.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedService(s);
                          nextStep();
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${
                          selectedService?.id === s.id 
                            ? 'border-zinc-900 bg-white shadow-md' 
                            : 'border-white bg-white hover:border-zinc-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-zinc-900 text-lg">{s.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">
                              <Clock className="h-3 w-3" />
                              <span>Est. {s.variations?.[0] ? formatDuration(s.variations[0].duration) : 'N/A'}</span>
                            </div>
                          </div>
                          {s.variations?.[0] && (
                            <span className="text-zinc-900 font-bold bg-zinc-50 px-3 py-1 rounded-full text-sm">
                              From ${Math.min(...s.variations.map(v => v.price))}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{s.description}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'size' && (
                <motion.div
                  key="size"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Vehicle Size</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(selectedService?.variations?.some(v => v.name.includes('RV')) ? SPECIALTY_SIZES : VEHICLE_SIZES).map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedSize(v.name);
                          nextStep();
                        }}
                        className={`p-6 rounded-2xl border-2 text-center transition-all ${
                          selectedSize === v.name 
                            ? 'border-zinc-900 bg-white shadow-md' 
                            : 'border-white bg-white hover:border-zinc-200'
                        }`}
                      >
                        <span className="text-3xl mb-3 block">{v.icon}</span>
                        <h3 className="font-bold text-zinc-900 text-sm">{v.name}</h3>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'addons' && (
                <motion.div
                  key="addons"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Add-ons (Optional)</h2>
                  </div>
                  <p className="text-xs text-zinc-500 mb-4 px-1">Enhance your detail with these specialized services.</p>
                  
                  <div className="grid gap-2">
                    {availableAddons.map(a => {
                      const isSelected = selectedAddons.includes(a.id);
                      const price = a.variations?.[0]?.price || 0;
                      const duration = a.variations?.[0]?.duration ? formatDuration(a.variations[0].duration) : '';
                      
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddons(selectedAddons.filter(id => id !== a.id));
                            } else {
                              setSelectedAddons([...selectedAddons, a.id]);
                            }
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'border-zinc-900 bg-white shadow-sm' 
                              : 'border-white bg-white hover:border-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded border ${isSelected ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'} flex items-center justify-center transition-colors`}>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">{a.name}</h3>
                              {duration && (
                                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase mt-0.5">
                                  <Clock className="h-2.5 w-2.5" />
                                  <span>+{duration}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-zinc-900">+${price}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Button className="w-full h-14 mt-6 text-base font-bold shadow-lg" onClick={nextStep}>
                    Continue to Schedule
                  </Button>
                </motion.div>
              )}

              {(step === 'datetime' || step === 'details') && (
                <motion.div
                  key="final-steps"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Final Details</h2>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Date & Time
                      </h3>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setViewDate(addMonths(viewDate, -1))}
                          disabled={isBefore(startOfMonth(addMonths(viewDate, -1)), startOfMonth(new Date()))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold min-w-[100px] text-center">
                          {format(viewDate, 'MMMM yyyy')}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setViewDate(addMonths(viewDate, 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-zinc-400 py-2">{d}</div>
                      ))}
                      
                      {/* Blank days for start of month */}
                      {Array.from({ length: startOfMonth(viewDate).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 w-full" />
                      ))}

                      {/* Actual days */}
                      {eachDayOfInterval({
                        start: startOfMonth(viewDate),
                        end: endOfMonth(viewDate)
                      }).map((date) => {
                        const isPast = isBefore(date, startOfToday());
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());
                        
                        return (
                          <button
                            key={date.toString()}
                            disabled={isPast}
                            onClick={() => setSelectedDate(date)}
                            className={`h-10 w-full rounded-lg text-xs font-bold transition-all relative ${
                              isSelected ? 'bg-zinc-900 text-white z-10' : 
                              isPast ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {format(date, 'd')}
                            {isToday && !isSelected && (
                              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-900" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <h4 className="text-sm font-bold text-zinc-900">Available Slots for {format(selectedDate, 'MMM do')}</h4>
                        {slotsLoading ? (
                          <div className="flex items-center gap-2 text-zinc-500 py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">Checking availability...</span>
                          </div>
                        ) : slots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot, idx) => {
                              const time = format(parseISO(slot.startAt), 'h:mm a');
                              const isSelected = selectedSlot?.startAt === slot.startAt;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                                    isSelected 
                                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-900'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-zinc-50 rounded-xl text-center">
                            <p className="text-xs text-zinc-500">No availability for this date. Please try another.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                    <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">First Name</label>
                        <input 
                          type="text"
                          value={customerInfo.firstName}
                          onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Last Name</label>
                        <input 
                          type="text"
                          value={customerInfo.lastName}
                          onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Email</label>
                        <input 
                          type="email"
                          value={customerInfo.email}
                          onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Phone</label>
                        <input 
                          type="tel"
                          value={customerInfo.phone}
                          onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold shadow-xl shadow-zinc-200"
                    disabled={!selectedSlot || !customerInfo.firstName || !customerInfo.email || bookingLoading}
                    onClick={handleBooking}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Secure Deposit</h2>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <CardIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Required Deposit: $50.00</h4>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        To finalize your booking on our schedule, we require a $50 non-refundable deposit. 
                        This ensures we can dedicate the necessary time to restore your vehicle.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100">
                    <PaymentForm
                      applicationId={getSquareAppId()}
                      locationId={getSquareLocationId()}
                      cardTokenizeResponseReceived={handlePayment}
                    >
                      <CreditCard 
                        buttonProps={{
                          isLoading: paymentLoading,
                          css: {
                            backgroundColor: '#111',
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            height: '56px',
                            fontSize: '16px',
                            marginTop: '20px',
                            '&:hover': {
                              backgroundColor: '#333'
                            }
                          }
                        }}
                      />
                    </PaymentForm>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                       <CheckCircle2 className="h-3 w-3 text-green-500" />
                       Secure SSL encrypted payment via Square
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-10 text-center shadow-xl border border-zinc-100"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                    We've received your booking. You'll receive a confirmation email shortly with the details.
                  </p>
                  <Button asChild variant="outline" className="w-full max-w-xs h-12">
                    <a href="/">Return Home</a>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Summary */}
          {step !== 'success' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm sticky top-24">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 px-1">
                  <Info className="h-4 w-4 text-zinc-400" />
                  Booking Summary
                </h3>
                
                <div className="space-y-4">
                  {selectedService && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Service</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedService.name}</p>
                    </div>
                  )}
                  {selectedSize && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Vehicle Size</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedSize}</p>
                    </div>
                  )}
                  {selectedAddons.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Add-ons</p>
                      <ul className="space-y-1">
                        {selectedAddons.map(id => (
                          <li key={id} className="text-xs text-zinc-600">• {availableAddons.find(a => a.id === id)?.name || 'Add-on'}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedDate && selectedSlot && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Date & Time</p>
                      <p className="text-sm font-bold text-zinc-900">
                        {format(selectedDate, 'PPP')} @ {format(parseISO(selectedSlot.startAt), 'h:mm a')}
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-100 mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-500">Subtotal</span>
                        <span className="font-bold text-zinc-900">${totalPrice()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Deposit Due Now</span>
                        <span className="font-bold text-zinc-900">$50.00</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed">
                        A non-refundable $50 deposit is required to secure your spot. 
                        Balance will be due upon service completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

