'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Shield, FolderOpen, Info, Search, Bell, ChevronDown } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Investigations', href: '/dashboard/investigations', icon: FileText },
    { name: 'Evidence', href: '/dashboard/evidence', icon: FolderOpen },
    { name: 'MITRE ATT&CK', href: '/dashboard/mitre', icon: Shield },
    { name: 'About', href: '/dashboard/about', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-[15px] text-heading tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            AttackChain
          </Link>
          
          <div className="hidden md:flex items-center text-[13px] font-medium text-muted gap-2">
            <span className="hover:text-heading cursor-pointer transition-colors px-2 py-1 rounded hover:bg-border/50">Production Env</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-background border border-border rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search incidents, IPs, hashes..." 
              className="bg-transparent border-none text-[13px] focus:outline-none w-64 placeholder-muted text-body"
            />
            <div className="px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] font-mono text-muted ml-2">⌘K</div>
          </div>
          
          <button className="text-muted hover:text-heading transition-colors p-2 hover:bg-border/50 rounded-full relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
          </button>
          
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white cursor-pointer shadow-sm">
            RS
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] border-r border-border bg-surface/50 hidden md:flex flex-col py-6">
          <div className="px-4">
            <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 px-3">Workspace</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/dashboard');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-[13px] font-medium rounded-lg relative transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]' 
                        : 'text-body hover:text-heading hover:bg-border/30'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary' : 'text-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
