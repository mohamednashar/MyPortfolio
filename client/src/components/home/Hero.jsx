import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Sparkles, TerminalSquare, ShieldCheck } from 'lucide-react';
import { Github, Linkedin } from '../common/Icons';
import Button from '../common/Button';
import Terminal from './Terminal';

const Hero = ({ profile }) => {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 lg:py-36 flex items-center overflow-hidden">
      {/* Background radial gradients / glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-indigo/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-slate-700/60 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                {profile?.statusText || 'Available for Full-time Roles & Contracts'}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
                Hi, I'm <span className="text-gradient">Mohamed Alaa</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 font-display font-medium">
                {profile?.title || 'Full-Stack / Frontend Developer & Programming Instructor'}
              </p>
            </div>

            {/* Hero Subtitle / Summary from CV */}
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-light mx-auto lg:mx-0">
              {profile?.heroIntro ||
                'Computer & System Engineering graduate from Minya University. Specializing in high-performance frontend applications with React & Next.js, and solid algorithmic foundation with 600+ solved ICPC challenges.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => scrollTo('#projects')}
              >
                View My Work
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={Mail}
                onClick={() => scrollTo('#contact')}
              >
                Contact Me
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon={Download}
                onClick={() => {
                  window.open(profile?.resumeUrl || '/Mohamed-Alaa-CV.pdf', '_blank');
                }}
              >
                Download CV
              </Button>
            </div>

            {/* Social Links & Trust Indicators */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                Connect:
              </span>
              <a
                href={profile?.socialLinks?.github || 'https://github.com/'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={profile?.socialLinks?.linkedin || 'https://linkedin.com/'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400">
                Minya University Engineering Alum
              </span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Developer Element / Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 w-full flex justify-center"
          >
            <div className="w-full relative">
              {/* Outer decorative glowing rings */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 -z-10" />
              <Terminal onNavigate={scrollTo} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
