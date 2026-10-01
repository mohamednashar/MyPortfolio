import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, ShieldCheck, ExternalLink, Code2 } from 'lucide-react';
import Button from './Button';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = ({ profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e, href) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-display font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-display font-bold text-white tracking-tight flex items-center gap-1.5">
              Mohamed Alaa
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" title="Available for opportunities" />
            </span>
            <span className="text-[11px] text-slate-400 block -mt-0.5 tracking-wider uppercase font-medium">
              Frontend & Full-Stack
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 border border-slate-800/60 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/40"
            title="Admin CMS"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <Button
            size="sm"
            variant="primary"
            icon={Download}
            onClick={() => {
              window.open(profile?.resumeUrl || '/Mohamed-Alaa-CV.pdf', '_blank');
            }}
          >
            Resume
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin/login"
            className="text-xs text-slate-400 hover:text-cyan-400 p-2 rounded-lg"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 py-2.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <Button
                  size="md"
                  variant="primary"
                  icon={Download}
                  className="w-full"
                  onClick={() => {
                    window.open(profile?.resumeUrl || '/Mohamed-Alaa-CV.pdf', '_blank');
                  }}
                >
                  Download CV
                </Button>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs text-slate-400 py-2 hover:text-cyan-400 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin CMS Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
