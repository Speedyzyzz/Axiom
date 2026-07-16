'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldAlert, Clock, ArrowRight, User, MoreHorizontal, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fetchIncidents = async () => {
  const res = await fetch(`${API_URL}/api/v1/incidents`);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  const json = await res.json();
  return json.data || [];
};

export default function InvestigationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: incidents = [], isLoading } = useQuery({ 
    queryKey: ['incidents_full'], 
    queryFn: fetchIncidents,
    retry: 3
  });

  const filteredIncidents = incidents.filter((inc: any) => 
    inc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inc.id?.toString().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 lg:px-12 py-10 bg-background text-body">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-heading tracking-tight mb-2">Investigations</h1>
          <p className="text-[14px] text-muted font-medium">Manage and triage active security incidents across your environment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-border rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search by ID or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-[13px] focus:outline-none w-48 text-heading"
            />
          </div>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-[13px] font-bold text-heading hover:bg-border/50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="linear-card flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border bg-surface/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Incident Name & ID</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time Detected</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center text-muted">
                        <ShieldAlert className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[14px] font-bold text-heading mb-1">No investigations found</p>
                        <p className="text-[12px]">Adjust your search filters or run the pipeline engine.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((inc: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      key={inc.id}
                      onClick={() => router.push(`/dashboard/incidents/${inc.id}`)}
                      className="hover:bg-surface/50 cursor-pointer group transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-10 rounded-full ${inc.severity === 'Critical' ? 'bg-danger shadow-[0_0_8px_rgba(225,29,72,0.5)]' : 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                          <div>
                            <div className="font-bold text-heading text-[14px] mb-0.5">{inc.title}</div>
                            <div className="text-[11px] text-muted font-mono bg-border/30 inline-block px-1.5 py-0.5 rounded">INC-{inc.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold border ${
                          inc.severity === 'Critical' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {inc.severity?.toUpperCase() || 'CRITICAL'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-muted">
                           <div className={`w-2 h-2 rounded-full ${inc.status === 'open' ? 'bg-primary animate-pulse' : 'bg-success'}`}></div>
                           {inc.status?.toUpperCase() || 'OPEN'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted text-[12px] font-medium">
                          <Clock className="w-3.5 h-3.5" /> {inc.created_at?.split('T')[0] || 'Today'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1.5 bg-heading text-white px-4 py-2 rounded text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200 hover:bg-primary">
                          Investigate <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
