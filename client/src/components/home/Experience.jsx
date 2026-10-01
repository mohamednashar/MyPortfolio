import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const Experience = ({ experiences = [] }) => {
  return (
    <section id="experience" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Career Journey"
          title={
            <>
              Professional Experience & <span className="text-gradient">Internships</span>
            </>
          }
          subtitle="Real-world engineering roles delivering client applications, collaborating with backend teams, and mastering software development."
        />

        {/* Timeline Container */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 md:ml-32 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative pl-6 sm:pl-10 group"
            >
              {/* Timeline Glowing Node */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-md shadow-cyan-500/50" />

              {/* Date Tag on Left (Visible on desktop) */}
              <div className="md:absolute md:-left-36 md:top-1 text-xs font-mono font-semibold text-cyan-400 md:text-right md:w-28 mb-2 md:mb-0">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 inline md:hidden" />
                  {exp.startDate} – {exp.endDate}
                </span>
                {exp.isCurrent && (
                  <span className="block text-[10px] text-emerald-400 font-sans uppercase tracking-wider font-bold">
                    Current
                  </span>
                )}
              </div>

              {/* Experience Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-7 border border-slate-800/80 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {exp.position}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-300">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      exp.type === 'Full-time'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : exp.type === 'Internship'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {exp.type}
                  </span>
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Achievements List */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-300">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/70 flex flex-wrap gap-1.5">
                    {exp.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
