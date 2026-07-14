import { Search, Bell, LayoutDashboard, Search as Troubleshoot, FileText } from "lucide-react"

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F5F3EE] font-body-md antialiased flex">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 bg-surface-container border-b border-outline-variant h-[64px]">
        <div className="flex items-center gap-4">
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface">AttackChain AI</div>
          <div className="hidden md:flex items-center ml-8 bg-[#0B0F14] border border-system rounded px-3 py-1.5 focus-within:border-primary">
            <Search className="text-system-muted w-4 h-4 mr-2" />
            <input 
              className="bg-transparent border-none text-body-md focus:ring-0 p-0 text-system-light w-64 placeholder-[#8A8F98] outline-none" 
              placeholder="Search resources, logs, or IPs..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface hover:bg-surface-variant p-2 rounded transition-colors duration-150 ease-in-out flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-caps text-label-caps text-on-surface">
            RS
          </div>
        </div>
      </nav>

      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full pt-[64px] z-40 flex-col bg-surface-container-low border-r border-outline-variant w-[240px] hidden md:flex">
        <div className="p-6 border-b border-outline-variant mb-4">
          <div className="font-label-caps text-label-caps text-primary mb-1">Analyst RS</div>
          <div className="text-[12px] text-system-muted">Active Session</div>
        </div>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-label-caps text-label-caps">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 border-l-2 border-primary bg-surface-container-high text-primary transition-all duration-200" href="#">
          <Troubleshoot className="w-5 h-5" />
          <span className="font-label-caps text-label-caps">Investigations</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
          <FileText className="w-5 h-5" />
          <span className="font-label-caps text-label-caps">Reports</span>
        </a>
      </nav>

      {/* Main Content */}
      <main className="md:pl-[240px] pt-[64px] h-screen flex flex-col flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  )
}
