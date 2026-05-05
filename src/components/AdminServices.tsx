import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { SyncLog, Service } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[]);
      setLoading(false);
    });

    const logsQ = query(collection(db, 'sync_logs'), orderBy('timestamp', 'desc'));
    const unsubscribeLogs = onSnapshot(logsQ, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
    });

    return () => {
      unsubscribe();
      unsubscribeLogs();
    };
  }, []);

  const handleSync = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updatedAt: new Date().toISOString() }) // Triggers a sync
      });
      if (!response.ok) throw new Error('Sync failed');
      alert('Sync triggered successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to trigger sync');
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-400">Loading master services...</div>;

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white">Master Service Truth</h2>
          <p className="text-zinc-400 text-sm font-medium">Your app controls Square. Drift is automatically corrected.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck className="h-3 w-3" />
             Two-Way Sync Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{service.categoryId}</span>
                <h3 className="text-xl font-black italic tracking-tight text-white">{service.name}</h3>
              </div>
              <div className={`h-2 w-2 rounded-full ${(service as any).syncStatus === 'synced' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
            </div>

            <p className="text-xs text-zinc-400 font-medium line-clamp-2 italic leading-relaxed">{service.description}</p>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-black text-white">
                Price Data Mapped
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSync(service.id!)}
                className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Sync
              </Button>
            </div>
            
            {service.squareId && (
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                <span>Square ID: {service.squareId.substring(0, 8)}...</span>
                <span>v{(service as any).squareVersion}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black italic tracking-tighter text-white">Sync Engine Logs</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-500">Service</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-500">Action</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white italic">{services.find(s => s.id === log.serviceId)?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 uppercase font-black tracking-widest">{log.action}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'success' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={log.status === 'success' ? 'text-emerald-500' : 'text-red-500'}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 font-medium">
                    {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
