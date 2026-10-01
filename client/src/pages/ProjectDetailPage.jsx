import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Github } from '../components/common/Icons';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { projectsAPI, profileAPI } from '../api';

const ProjectDetailPage = () => {
  const { idOrSlug } = useParams();
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projRes, profRes] = await Promise.all([
          projectsAPI.getOne(idOrSlug),
          profileAPI.getProfile().catch(() => ({ data: { data: null } })),
        ]);
        if (projRes.data?.data) setProject(projRes.data.data);
        if (profRes.data?.data) setProfile(profRes.data.data);
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-2xl font-display font-bold text-white">Project Not Found</h2>
        <p className="text-sm text-slate-400">The project you are looking for does not exist or has been removed.</p>
        <Link to="/">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  const allImages = [project.image, ...(project.screenshots || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">
      <Navbar profile={profile} />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back button */}
          <div>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all projects</span>
            </Link>
          </div>

          {/* Title Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {project.category}
              </span>
              {project.featured && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured Case Study
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light max-w-3xl leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && (
              <Button
                variant="primary"
                size="lg"
                icon={ExternalLink}
                iconPosition="right"
                onClick={() => window.open(project.liveUrl, '_blank')}
              >
                Live Preview
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="secondary"
                size="lg"
                icon={Github}
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                View on GitHub
              </Button>
            )}
          </div>

          {/* Screenshot Showcase */}
          {allImages.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-2xl">
              <img
                src={allImages[activeImageIndex]}
                alt={`${project.title} preview`}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === activeImageIndex ? 'bg-cyan-400 w-6' : 'bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Problem & Solution */}
          {(project.problem || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.problem && (
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                  <h3 className="text-sm uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    The Problem
                  </h3>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                  <h3 className="text-sm uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    The Solution
                  </h3>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Detailed Description */}
          {project.description && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Comprehensive Overview
              </h3>
              <p className="text-slate-300 leading-relaxed font-light text-sm sm:text-base whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-lg font-display font-semibold text-white">
                Core Capabilities & Architecture
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Tech Stack & Libraries
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default ProjectDetailPage;
