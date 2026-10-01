import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Layers,
  Cpu,
  Terminal,
  Brain,
  GitBranch,
  Globe,
  Binary,
  Blocks,
  Network,
  Layout,
  Server,
  Workflow,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

// Helper icon mapper
const iconMap = {
  Code: Code,
  Atom: Code,
  Cpu: Cpu,
  FileCode: Code,
  Palette: Layout,
  Layout: Layout,
  Layers: Layers,
  Globe: Globe,
  Brain: Brain,
  Binary: Binary,
  Terminal: Terminal,
  Blocks: Blocks,
  Network: Network,
  Server: Server,
  Workflow: Workflow,
  GitBranch: GitBranch,
  Github: GitBranch,
  CheckCircle: CheckCircle2,
};

const categories = [
  'All',
  'Frontend',
  'Programming & Algorithms',
  'Backend & APIs',
  'Tools & Methodologies',
];

const Skills = ({ skills = [] }) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredSkills =
    activeTab === 'All'
      ? skills
      : skills.filter((s) => s.category === activeTab);

  return (
    <section id="skills" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Technical Skills"
          title={
            <>
              Modern Stack & <span className="text-gradient">Algorithmic Disciplines</span>
            </>
          }
          subtitle="Directly sourced from real production engineering, competitive programming contests, and academic specialization."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-dark-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon] || Code;
              return (
                <motion.div
                  layout
                  key={skill._id || skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        skill.level === 'Expert'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      {skill.level || 'Advanced'}
                    </span>
                  </div>

                  {/* Proficiency Meter */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Proficiency</span>
                      <span className="text-cyan-400 font-semibold">{skill.proficiency || 90}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 90}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
