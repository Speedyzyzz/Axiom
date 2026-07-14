import { Shield } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Architecture from '@/components/landing/Architecture';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#050816] min-h-screen text-body font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050816]/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-[16px] font-bold text-heading tracking-tight">AttackChain AI</span>
          </div>
          <Link 
            href="/dashboard"
            className="px-5 py-2 bg-heading text-background font-semibold text-[13px] rounded-lg hover:bg-white transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      <main>
        <Hero />
        <Problem />
        <Architecture />
      </main>

      <Footer />
    </div>
  );
}
