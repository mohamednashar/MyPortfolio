import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Mohamed Alaa',
    },
    title: {
      type: String,
      required: true,
      default: 'Full-Stack / Frontend Developer & Programming Instructor',
    },
    subtitle: {
      type: String,
      default: 'Crafting responsive, high-performance web applications and mentoring the next generation of engineers.',
    },
    email: {
      type: String,
      required: true,
      default: 'mohamedalaaelnasharedu@gmail.com',
    },
    phone: {
      type: String,
      default: '01063977292',
    },
    location: {
      type: String,
      default: 'Minya, Egypt',
    },
    avatar: {
      type: String,
      default: '/mohamed-alaa.jpg',
    },
    resumeUrl: {
      type: String,
      default: '/Mohamed-Alaa-CV.pdf',
    },
    statusText: {
      type: String,
      default: 'Available for Opportunities',
    },
    heroIntro: {
      type: String,
      default: 'Computer & System Engineering graduate with expertise in building scalable, responsive web applications with React, Next.js, and modern JavaScript ecosystem. Competitive programmer with 600+ solved algorithmic problems.',
    },
    aboutBio: {
      type: String,
      default: 'I am a passionate Full-Stack / Frontend Developer and Computer & System Engineering graduate from Minya University (Faculty of Engineering). With extensive production experience at InstaTech and intensive hands-on frontend internships, I specialize in crafting elegant, responsive user interfaces and integrating robust APIs. My strong background in competitive programming (600+ problems solved in the ICPC community and ECPC 2022 contestant) equips me with algorithmic rigor and problem-solving excellence.',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/' },
      linkedin: { type: String, default: 'https://linkedin.com/' },
      portfolio: { type: String, default: 'https://mohamedalaa.dev' },
      twitter: { type: String, default: '' },
      telegram: { type: String, default: '' },
    },
    stats: {
      problemsSolved: { type: Number, default: 600 },
      yearsExperience: { type: Number, default: 2 },
      completedProjects: { type: Number, default: 12 },
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
