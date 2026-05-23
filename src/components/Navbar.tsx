import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Terminal, Sparkles, Menu, X, Landmark, Compass, FolderKanban, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  onAdminToggle: () => void;
}

export default function Navbar({ onAdminClick, onAdminToggle }: NavbarProps) {
  const { isAdmin, logoutAdmin, isFirebaseActive } = useApp();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Is scrolled check
      setIsScrolled(window.scrollY > 20);

      // Scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '#home', icon: Compass },
    { label: 'About', href: '#about', icon: Terminal },
    { label: 'Skills', href: '#skills', icon: Sparkles },
    { label: 'Projects', href: '#projects', icon: FolderKanban },
    { label: 'Awards', href: '#awards', icon: Landmark },
    { label: 'Achieve', href: '#achievements', icon: ShieldCheck },
    { label: 'Contact', href: '#contact', icon: Terminal },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'glass border-b border-white/10 shadow-lg shadow-blue-500/5 py-3' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        {/* Scroll indicator line */}
        <div 
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-1 group font-sans"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-sans font-bold text-white tracking-widest text-sm sm:text-base ml-1.5 uppercase">
              NAHOM <span className="text-blue-500 group-hover:text-purple-400 transition-colors">DEBEBE</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-1.5 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            {/* Quick database connection badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400 uppercase">
                Supabase Cloud DB
              </span>
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onAdminToggle}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 text-purple-300 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer"
                >
                  CONSOLE
                </button>
                <button
                  onClick={logoutAdmin}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500/30 hover:text-rose-400 text-xs font-mono text-slate-400 transition-all cursor-pointer"
                >
                  EXIT
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="relative group overflow-hidden px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono tracking-wider border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400 group-hover:animate-pulse" />
                  ADMIN ACCESS
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-950/20 via-purple-950/20 to-transparent transition-transform duration-500" />
              </button>
            )}

            {/* Mobile Menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Overlay) */}
      <div 
        className={`fixed inset-0 z-30 lg:hidden pointer-events-none transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto bg-black/90 backdrop-blur-lg' : 'opacity-0'
        }`}
      >
        <div className="h-full flex flex-col justify-center px-8 space-y-8 font-mono">
          <p className="text-xs uppercase tracking-widest text-blue-500">
            Navigation Index
          </p>
          <div className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="flex items-center gap-3 text-xl font-bold text-slate-300 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Database Connection: Supabase Connected</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onAdminToggle(); }}
                className="w-full text-center py-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 text-sm font-bold"
              >
                OPEN ADMIN PANEL
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
