import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, RefreshCw } from 'lucide-react';

export default function Footer() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const response = await fetch('/api/admin/sync-square', { method: 'POST' });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response from server:", text);
        throw new Error(`Server returned a ${response.status} ${response.statusText} response. This usually means the server is starting up or there is a configuration error.`);
      }

      const data = await response.json();
      if (data.success) {
        setSyncStatus('Successfully synced to Square!');
        setTimeout(() => setSyncStatus(null), 5000);
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error: any) {
      setSyncStatus(`Error: ${error.message}`);
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-100">Bryan's Showroom Quality Detailing</h3>
          <p className="text-sm leading-relaxed">
            Premium auto detailing services based in Bellevue. 10+ years of showroom quality detailing and professional paint correction.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="hover:text-zinc-100 transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-zinc-100 transition-colors"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="block py-1 hover:text-zinc-100 transition-colors">Interior Detailing</Link></li>
            <li><Link to="/services" className="block py-1 hover:text-zinc-100 transition-colors">Exterior Detailing</Link></li>
            <li><Link to="/services" className="block py-1 hover:text-zinc-100 transition-colors">Paint Correction</Link></li>
            <li><Link to="/services" className="block py-1 hover:text-zinc-100 transition-colors">Ceramic Coating</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/membership" className="block py-1 hover:text-zinc-100 transition-colors">Membership Plans</Link></li>
            <li><Link to="/blog" className="block py-1 hover:text-zinc-100 transition-colors">Blog & Tips</Link></li>
            <li><Link to="/gift-cards" className="block py-1 hover:text-zinc-100 transition-colors">Gift Cards</Link></li>
            <li><Link to="/faq" className="block py-1 hover:text-zinc-100 transition-colors">FAQ</Link></li>
            <li><Link to="/admin" className="block py-1 hover:text-zinc-100 transition-colors font-bold text-zinc-300">Admin Dashboard</Link></li>
            <li><Link to="/terms" className="block py-1 hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="block py-1 hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/sitemap" className="block py-1 hover:text-zinc-100 transition-colors">Sitemap</Link></li>
            <li className="pt-2 border-t border-zinc-800 mt-2">
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 hover:text-zinc-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync to Square'}
              </button>
              {syncStatus && (
                <p className={`text-[10px] mt-1 ${syncStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {syncStatus}
                </p>
              )}
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Based in Bellevue / Serving Omaha Metro Area</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:712-305-6313" className="hover:text-zinc-100 transition-colors">(712) 305-6313</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:bryansmobiledetailing@gmail.com" className="hover:text-zinc-100 transition-colors">bryansmobiledetailing@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Bryan's Showroom Quality Detailing. All rights reserved.</p>
      </div>
    </footer>
  );
}
