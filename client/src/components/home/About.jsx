import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Trophy, Code2, CheckCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/Button';

const About = ({ profile }) => {
  const highlights = [
    {
      icon: GraduationCap,
      title: 'Computer & System Engineering',
      desc: "Faculty of Engineering, Minya University (2019 – 2024). Strong foundation in algorithms, systems, OOP, and hardware architecture.",
    },
    {
      icon: Briefcase,
      title: 'Production Frontend Engineering',
      desc: 'Developing responsive client applications at InstaTech adhering to strict industry standards and integrating multi-tier back-end APIs.',
    },
    {
      icon: Trophy,
      title: 'Competitive Algorithmic Mastery',
      desc: 'Solved 600+ problems in the ICPC Community. Official contestant in the prestigious Egyptian Collegiate Programming Contest (ECPC 2022).',
    },
    {
      icon: Code2,
      title: 'Hands-on Technical Breadth',
      desc: 'Extensive React and JavaScript experience from Elmawkaa Internship plus embedded robotic systems training from ITI.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="About Me"
          title={
            <>
              Engineering High-Performance Web Apps with{' '}
              <span className="text-gradient">Algorithmic Precision</span>
            </>
          }
          subtitle="A grounded developer and problem solver with a Bachelor's in Computer & System Engineering and real-world production experience."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Detailed Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">
                Who I Am & What Drives Me
              </h3>
              <p className="text-slate-300 leading-relaxed font-light text-sm sm:text-base">
                {profile?.aboutBio ||
                  'I am a passionate Full-Stack / Frontend Developer and Computer & System Engineering graduate from Minya University (Faculty of Engineering). With extensive production experience at InstaTech and intensive hands-on frontend internships, I specialize in crafting elegant, responsive user interfaces and integrating robust APIs.'}
              </p>
              <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-base">
                My training in the ICPC Community—having solved up to 600 algorithmic problems—gives me a unique advantage: I don't just build visually engaging interfaces; I write efficient, scalable, and bug-resistant code designed for longevity.
              </p>

              {/* Verified Competencies */}
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Key Principles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Responsive & Accessible UI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Seamless REST API Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Data Structures & Algorithmic Rigor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Agile & Team Collaboration</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => {
                    const el = document.querySelector('#experience');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Experience Timeline
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right: Key Pillar Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-display font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
