import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Github } from '../common/Icons';
import Button from '../common/Button';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const allImages = [
    project.image,
    ...(project.screenshots || []),
  ].filter(Boolean);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl glass-card bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl z-10 my-6 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-dark-950/60 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                {project.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">
            {/* Image Preview Carousel */}
            {allImages.length > 0 && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === activeImageIndex ? 'bg-cyan-400 w-5' : 'bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Overview / Description */}
            <div className="space-y-3">
              <h4 className="text-base font-display font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Project Overview
              </h4>
              <p className="text-slate-300 leading-relaxed font-light text-sm sm:text-base">
                {project.description || project.summary}
              </p>
            </div>

            {/* Problem & Solution (Case Study) */}
            {(project.problem || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.problem && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <h5 className="text-xs uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      The Problem
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <h5 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      The Solution
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Key Features from CV */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-display font-semibold text-white">
                  Key Features & Capabilities
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800/70"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/90 text-cyan-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-dark-950/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <Button
                  variant="primary"
                  size="md"
                  icon={ExternalLink}
                  iconPosition="right"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  Live Demo
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="secondary"
                  size="md"
                  icon={Github}
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  Source Code
                </Button>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
