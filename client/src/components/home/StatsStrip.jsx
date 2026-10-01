import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Award, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    icon: Brain,
    value: '600+',
    label: 'Algorithmic Problems',
    sublabel: 'Solved in ICPC Community',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Award,
    value: 'ECPC 2022',
    label: 'Official Contestant',
    sublabel: 'National Collegiate Contest',
    accent: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Code,
    value: '2+ Years',
    label: 'Professional Experience',
    sublabel: 'InstaTech & Production Apps',
    accent: 'from-teal-500 to-emerald-500',
  },
  {
    icon: CheckCircle2,
    value: '100%',
    label: 'Industry Standard',
    sublabel: 'API Integration & Code Quality',
    accent: 'from-amber-500 to-rose-500',
  },
];

const StatsStrip = () => {
  return (
    <div className="relative z-10 -mt-6 sm:-mt-10 mb-16 sm:mb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 border border-slate-800/80 relative overflow-hidden group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.accent} p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                      {item.value}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-300 -mt-0.5">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      {item.sublabel}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsStrip;
