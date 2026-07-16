'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FolderOpen, Database, Download, Server, Lock, Activity, Users, Shield, MapPin, Globe } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fetchEvidence = async () => {
  const res = await fetch(`${API_URL}/api/v1/evidence`);
  if (!res.ok) throw new Error("Failed to fetch evidence");
  const json = await res.json();
  return json.data || [];
};

export default function EvidencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: evidence = [], isLoading } = useQuery({ 
    queryKey: ['global_evidence'], 
    queryFn: fetchEvidence,
    retry: 3
  });

  const filteredEvidence = evidence.filter((ev: any) => 
    ev.action?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ev.ip?.includes(searchTerm) ||
    ev.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceIcon = (source: string) => {
    const s = source?.toLowerCase() || '';
    if (s.includes('db') || s.includes('database') || s.includes('sql')) return <Database className="w-3.5 h-3.5" />;
    if (s.includes('vpn') || s.includes('network')) return <Globe className="w-3.5 h-3.5" />;
    if (s.includes('endpoint') || s.includes('host') || s.includes('powershell')) return <Server className="w-3.5 h-3.5" />;
    if (s.includes('auth') || s.includes('login') || s.includes('ad')) return <Lock className="w-3.5 h-3.5" />;
    if (s.includes('user') || s.includes('account')) return <Users className="w-3.5 h-3.5" />;
    return <Activity className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 lg:px-12 py-10 bg-background text-body">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-heading tracking-tight mb-2 flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-primary" />
            Evidence Repository
          </h1>
          <p className="text-[14px] text-muted font-medium">Unified timeline of raw telemetry and parsed events across all active incidents.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-border rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search IPs, actions, sources..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-[13px] focus:outline-none w-56 text-heading"
            />
          </div>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-[13px] font-bold text-heading hover:bg-border/50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="linear-card flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border bg-surface/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Action / Event</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">MITRE Mapping</th>
                <th className="px-6 py-4">Incident ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[12px]">
              <AnimatePresence>
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="text-center py-20">
                       <div className="flex flex-col items-center justify-center text-muted">
                         <Activity className="w-10 h-10 mb-4 animate-pulse opacity-50" />
                         <p className="text-[14px] font-bold text-heading mb-1 font-sans">Querying Evidence Repository...</p>
                       </div>
                     </td>
                   </tr>
                ) : filteredEvidence.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center text-muted font-sans">
                        <FolderOpen className="w-10 h-10 mb-4 opacity-50" />
                        <p className="text-[14px] font-bold text-heading mb-1">No evidence found</p>
                        <p className="text-[12px]">No telemetry matches your current filters or no incidents exist.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvidence.map((ev: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      key={ev.id}
                      className="hover:bg-surface/30 transition-colors group"
                    >
                      <td className="px-6 py-3 text-muted">
                        {ev.timestamp?.split('T').join(' ') || 'Unknown'}
                      </td>
                      
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 font-sans text-heading font-medium">
                          <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                            {getSourceIcon(ev.source)}
                          </div>
                          {ev.source || 'Unknown'}
                        </div>
                      </td>

                      <td className="px-6 py-3 font-medium text-heading">
                        {ev.action || 'Unknown Event'}
                      </td>
                      
                      <td className="px-6 py-3">
                        {ev.ip && ev.ip !== 'N/A' ? (
                          <div className="flex items-center gap-1.5 text-danger font-medium bg-danger/10 px-2 py-0.5 rounded inline-flex border border-danger/20">
                            <MapPin className="w-3 h-3" /> {ev.ip}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-3">
                        {ev.mitre && ev.mitre !== 'N/A' ? (
                          <span className="inline-flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            <Shield className="w-3 h-3" /> {ev.mitre}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>

                      <td className="px-6 py-3">
                        <span className="bg-border/30 px-2 py-1 rounded text-muted font-bold">
                          INC-{ev.incident_id}
                        </span>
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
