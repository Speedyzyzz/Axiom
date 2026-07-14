import { Link } from 'react-router-dom';

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#16130b] text-[#eae1d4] font-body-main antialiased selection:bg-primary/30 selection:text-primary flex flex-col">
      {/* Global Nav Shell */}
      <nav className="flex justify-between items-center px-6 md:px-16 h-16 w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0px_0px_12px_rgba(201,162,39,0.15)]">
        <Link to="/" className="font-display-lg text-display-lg font-extrabold text-primary tracking-tighter" style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>
          AttackChain AI
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Intelligence</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Assets</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Nodes</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Threats</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-data-mono text-data-mono font-bold hover:bg-primary-container transition-colors active:scale-95">
            Upgrade
          </button>
          <div className="w-8 h-8 rounded-full border border-primary/50 overflow-hidden ml-2 hidden md:block">
            <img 
              alt="Premium user profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO24OBQdZV5WlkvUZlGK3L11izEEscM5-OGwKDzLMK41pMl92BvFUtNdMGcZsY0FuAkfZHqwQfwZID5DxRxO7e8PAucoKc-ONikdIBCfxIARfuymXYgkp0OM3m9DyObS6P9dMYlhk_aiEzyRkFXF594CSkdXpI4GBYb_oWvU1ZjXs8IZONwZcXX5qRQA-Xa6xLHW75XIC5VZ1avmIvdlzTHnoXFDQ3sIM8o2AgXWhFoUgh0sOq3A"
            />
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="relative flex-grow flex flex-col pt-16">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-surface border-t border-outline-variant/10 py-12 relative z-10 w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-label-caps text-label-caps text-primary">
            © 2024 AttackChain AI. Secure Financial Intelligence.
          </div>
          <div className="flex gap-6">
            <a className="font-data-sm text-data-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="font-data-sm text-data-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="font-data-sm text-data-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
