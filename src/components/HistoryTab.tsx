import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { History as HistoryIcon, Clock, HardDrive, ShieldCheck } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

interface UsageLog {
  id: string;
  actionType: string;
  details: string;
  createdAt: number;
}

export default function HistoryTab() {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      if (!user) setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, 'usageLogs'),
          where('userId', '==', userId)
        );
        // Note: Missing composite index might cause orderBy to fail, we sort client side if needed,
        // or just rely on the query if we don't orderBy. Let's just fetch and sort client-side.
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<UsageLog, 'id'>)
        }));
        data.sort((a, b) => b.createdAt - a.createdAt);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [userId]);

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[500px] border border-slate-800 rounded-2xl bg-slate-900">
        <ShieldCheck className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sign in to view history</h3>
        <p className="text-slate-400">Please sign in with your Google account to access your personal usage history.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
        <HistoryIcon className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Your Activity History</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {loading ? (
          <div className="animate-pulse flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <HardDrive className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No activity recorded yet.</p>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-white capitalize">{log.actionType.replace('-', ' ')}</h4>
                <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px] sm:max-w-md">{log.details}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
