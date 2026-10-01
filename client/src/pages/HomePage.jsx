import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import StatsStrip from '../components/home/StatsStrip';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import Projects from '../components/home/Projects';
import Experience from '../components/home/Experience';
import Education from '../components/home/Education';
import Contact from '../components/home/Contact';
import AnimatedBackground from '../components/common/AnimatedBackground';
import CursorSpotlight from '../components/common/CursorSpotlight';
import {
  profileAPI,
  projectsAPI,
  skillsAPI,
  experienceAPI,
  educationAPI,
} from '../api';
import {
  defaultProfile,
  defaultProjects,
  defaultSkills,
  defaultExperiences,
  defaultEducations,
} from '../data/defaultData';

const HomePage = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState(defaultProjects);
  const [skills, setSkills] = useState(defaultSkills);
  const [experiences, setExperiences] = useState(defaultExperiences);
  const [educations, setEducations] = useState(defaultEducations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          profileRes,
          projectsRes,
          skillsRes,
          experienceRes,
          educationRes,
        ] = await Promise.all([
          profileAPI.getProfile().catch(() => ({ data: { data: null } })),
          projectsAPI.getAll().catch(() => ({ data: { data: [] } })),
          skillsAPI.getAll().catch(() => ({ data: { data: [] } })),
          experienceAPI.getAll().catch(() => ({ data: { data: [] } })),
          educationAPI.getAll().catch(() => ({ data: { data: [] } })),
        ]);

        if (profileRes.data?.data) setProfile(profileRes.data.data);
        if (projectsRes.data?.data) setProjects(projectsRes.data.data);
        if (skillsRes.data?.data) setSkills(skillsRes.data.data);
        if (experienceRes.data?.data) setExperiences(experienceRes.data.data);
        if (educationRes.data?.data) setEducations(educationRes.data.data);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        </div>
        <p className="text-xs font-mono text-slate-400 tracking-wider">
          LOADING PORTFOLIO DATA...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan overflow-hidden">
      {/* Living Ambient Animated Background & Cursor Spotlight */}
      <AnimatedBackground />
      <CursorSpotlight />

      <Navbar profile={profile} />
      <main className="relative z-10 flex-1">
        <Hero profile={profile} />
        <StatsStrip />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Education educations={educations} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default HomePage;
