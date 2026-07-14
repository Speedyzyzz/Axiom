'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Search, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Investigations', href: '/dashboard/investigations', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl text-heading tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary shadow-[0_0_10px_#00E5FF]"></div>
            AttackChain AI
          </Link>
          <div className="hidden md:flex items-center bg-background border border-border rounded-md px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search telemetry..." 
              className="bg-transparent border-none text-sm focus:outline-none w-64 placeholder-muted text-body"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-body hover:text-heading transition-colors p-2 hover:bg-card rounded-md">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
            RS
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-surface hidden md:flex flex-col py-6">
          <div className="px-6 mb-6">
            <h2 className="text-[13px] font-bold text-muted uppercase tracking-wider mb-4 font-mono">Workspace</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/incidents');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-[14px] font-medium rounded-md relative transition-colors ${
                      isActive 
                        ? 'text-primary bg-primary/10 border-l-2 border-primary rounded-l-none' 
                        : 'text-body hover:text-heading hover:bg-card'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary' : 'text-muted'}`} />
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
