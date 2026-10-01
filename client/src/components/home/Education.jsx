import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Trophy, Award, Bot, CheckCircle } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const iconMap = {
  Degree: GraduationCap,
  Competition: Trophy,
  Activity: Bot,
  Certification: Award,
};

const Education = ({ educations = [] }) => {
  return (
    <section id="education" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Academics & Contests"
          title={
            <>
              Education & <span className="text-gradient">Algorithmic Competitions</span>
            </>
          }
          subtitle="Formal engineering degree, prestigious ICPC/ECPC contest participations, and technical activities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {educations.map((item, index) => {
            const IconComponent = iconMap[item.type] || GraduationCap;
            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-7 border border-slate-800/80 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-semibold text-cyan-400">
                          {item.period}
                        </span>
                        <h3 className="text-lg font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-200">{item.institution}</span>
                    {item.location && <span>• {item.location}</span>}
                  </p>

                  {item.description && (
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2 text-xs text-slate-300">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span className="font-light">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
