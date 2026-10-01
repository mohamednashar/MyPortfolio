import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedData = async (silent = false) => {
  try {
    if (!silent) console.log('[Seeder] Starting data synchronization...');

    // 1. Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'mohamedalaaelnasharedu@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      await User.create({
        name: 'Mohamed Alaa',
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
      });
      if (!silent) console.log('[Seeder] Admin user created.');
    }

    // 2. Profile Info
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        name: 'Mohamed Alaa',
        title: 'Full-Stack / Frontend Developer & Programming Instructor',
        subtitle: 'Crafting responsive, high-performance web applications and mentoring the next generation of engineers.',
        email: 'mohamedalaaelnasharedu@gmail.com',
        phone: '01063977292',
        location: 'Egypt',
        avatar: '/mohamed-alaa.jpg',
        resumeUrl: '/Mohamed-Alaa-CV.pdf',
        statusText: 'Available for New Opportunities & Freelance',
        heroIntro: 'Computer & System Engineering graduate (Minya University) with production expertise in building responsive, high-scale web applications with React, Next.js, and modern JavaScript. Competitive programmer with 600+ solved algorithmic problems in the ICPC community.',
        aboutBio: 'I am a passionate Full-Stack / Frontend Developer and Computer & System Engineering graduate from Minya University (Faculty of Engineering). With extensive production experience at InstaTech and intensive hands-on frontend internships, I specialize in crafting elegant, responsive user interfaces and integrating robust APIs. My strong background in competitive programming (600+ problems solved in the ICPC community and ECPC 2022 contestant) equips me with algorithmic rigor and problem-solving excellence.',
        socialLinks: {
          github: 'https://github.com/',
          linkedin: 'https://linkedin.com/',
          portfolio: 'https://mohamedalaa.dev',
          twitter: '',
          telegram: '',
        },
        stats: {
          problemsSolved: 600,
          yearsExperience: 2,
          completedProjects: 12,
        },
      });
      if (!silent) console.log('[Seeder] Profile data seeded.');
    }

    // 3. Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'Education Platform Website',
          slug: 'education-platform-website',
          category: 'Full Stack',
          summary: 'An all-in-one educational management system featuring automated online quizzes, assignment tracking, and real-time class announcements.',
          description: 'A comprehensive web-based educational portal engineered to digitize classroom workflows. It provides an automated evaluation system for quizzes and exams with instant grading, an intuitive workflow for submitting and reviewing assignments, and a dynamic communication feed for course updates.',
          technologies: ['React JS', 'Tailwind CSS', 'Node.js', 'Express', 'REST APIs', 'JWT'],
          image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
          ],
          features: [
            'Online quizzes and exams with automatic grading and instant feedback.',
            'System for submitting, tracking, and grading student assignments with deadline alerts.',
            'Interactive announcements board to post live updates and broadcast messages.',
            'Role-based permissions for instructors and students.',
          ],
          problem: 'Educational institutions struggled with fragmented communication, manual grading burdens, and delays in student assessment feedback.',
          solution: 'Architected a modular web platform with automatic scoring algorithms, clean submission queues, and real-time announcement broadcasting.',
          githubUrl: 'https://github.com/',
          liveUrl: 'https://demo-education-platform.vercel.app',
          featured: true,
          published: true,
          order: 1,
        },
        {
          title: 'Restaurant Website',
          slug: 'restaurant-website',
          category: 'Frontend',
          summary: 'Modern interactive restaurant storefront with categorized digital menu, real-time quantity modifiers, and seamless cart management.',
          description: 'A dynamic, high-performance restaurant web experience tailored for fast food and fine dining. Features intuitive categorized menus, live order customization, and a reactive shopping cart with fluid animation and quantity calculations.',
          technologies: ['React JS', 'TypeScript', 'Tailwind CSS', 'Context API', 'Framer Motion'],
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
          ],
          features: [
            'Organized menu items into intuitive categories for easy and fast browsing.',
            'Instant meal selection with effortless quantity customization and allergen notes.',
            'Fully functional shopping cart allowing customers to add, remove, and update items seamlessly.',
            'Responsive order checkout layout optimized for mobile diners.',
          ],
          problem: 'Customers needed a smooth, frictionless mobile experience to inspect dishes, adjust quantities, and calculate checkout totals without page reloads.',
          solution: 'Created an animated single-page food catalog with stateful cart synchronization and category filter pills.',
          githubUrl: 'https://github.com/',
          liveUrl: 'https://demo-restaurant-order.vercel.app',
          featured: true,
          published: true,
          order: 2,
        },
        {
          title: 'ERP System Website',
          slug: 'erp-system-website',
          category: 'Enterprise / ERP',
          summary: 'Robust Enterprise Resource Planning platform enhancing operational efficiency and supporting multi-tier user roles.',
          description: 'A centralized enterprise management portal built to orchestrate operational processes across departments. Features granular user role management, data tables, analytics reporting, and secure API integrations.',
          technologies: ['React JS', 'Next JS', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Charts'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          ],
          features: [
            'Developed an ERP system website enhancing operational efficiency and supporting various user roles.',
            'Granular role-based permissions and access guards across organizational departments.',
            'Real-time data visualization and operational activity tracking.',
            'Seamless integration with back-end database schemas and REST APIs.',
          ],
          problem: 'Internal teams were bogged down by decentralized spreadsheets, inconsistent data entry, and lack of role-based audit trails.',
          solution: 'Built an enterprise web portal with standardized forms, multi-level authentication, and unified operational dashboard views.',
          githubUrl: 'https://github.com/',
          liveUrl: 'https://demo-erp-system.vercel.app',
          featured: true,
          published: true,
          order: 3,
        },
        {
          title: 'Al-Zahraa Website',
          slug: 'al-zahraa-website',
          category: 'eCommerce',
          summary: 'Clean, responsive eCommerce web application built to showcase and organize product catalogs with category hierarchy.',
          description: 'A focused eCommerce storefront created to help manage small to mid-sized product catalogs. Enables catalog browsing, category filtering, detail previews, and seamless customer interactions.',
          technologies: ['React JS', 'Bootstrap', 'JavaScript', 'REST APIs', 'CSS3'],
          image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
          ],
          features: [
            'Developed a small eCommerce website to manage some products with its categories.',
            'Intuitive product filtering by category and fast search.',
            'Clean product showcase cards with high-resolution image views.',
            'Mobile-first responsive layout adhering to UI/UX standards.',
          ],
          problem: 'Retail store owners needed a lightweight, easy-to-navigate digital storefront to present goods by category without heavyweight CMS overhead.',
          solution: 'Crafted a fast React catalog interface with instant category filtering and clear call-to-actions.',
          githubUrl: 'https://github.com/',
          liveUrl: 'https://demo-alzahraa-store.vercel.app',
          featured: true,
          published: true,
          order: 4,
        },
      ]);
      if (!silent) console.log('[Seeder] Projects seeded.');
    }

    // 4. Experience & Internships
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      await Experience.insertMany([
        {
          position: 'Frontend Developer',
          company: 'InstaTech',
          location: 'Egypt',
          startDate: '08/2023',
          endDate: 'Present',
          isCurrent: true,
          type: 'Full-time',
          description: 'Spearheading the design and implementation of responsive, accessible, and high-performance web applications that exceed client expectations.',
          achievements: [
            'Developed responsive and interactive web applications that met client requirements and adhered to industry standards.',
            'Worked closely with back-end developers to integrate APIs and data sources into front-end applications.',
            'Engineered reusable component libraries in React to accelerate sprint velocity across client deliverables.',
          ],
          technologies: ['React JS', 'Next JS', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
          order: 1,
        },
        {
          position: 'Frontend Developer Intern',
          company: 'Elmawkaa Internship',
          location: 'Egypt',
          startDate: '01/2023',
          endDate: '04/2024',
          isCurrent: false,
          type: 'Internship',
          description: 'The internship provided me with hands-on experience in designing, developing, and implementing web applications using various front-end technologies and React framework.',
          achievements: [
            'Designed and developed modern, interactive user interfaces using React framework.',
            'Collaborated on real-world frontend architectures and state management flows.',
            'Ensured cross-browser compatibility and mobile responsiveness across multiple client screens.',
          ],
          technologies: ['React JS', 'JavaScript', 'Bootstrap', 'Tailwind CSS', 'HTML5', 'CSS3'],
          order: 2,
        },
        {
          position: 'Robotics & Embedded Trainee',
          company: 'ITI Summer Training',
          location: 'Egypt',
          startDate: '07/2021',
          endDate: '08/2021',
          isCurrent: false,
          type: 'Training',
          description: 'The training provided me with hands-on experience in programming robots using Arduino.',
          achievements: [
            'Gained hands-on experience in programming autonomous robots and embedded controllers using Arduino and C++.',
            'Interfaced sensory components, microcontrollers, and motor drivers in hardware projects.',
          ],
          technologies: ['Arduino', 'C++', 'Hardware Control', 'Embedded Logic'],
          order: 3,
        },
      ]);
      if (!silent) console.log('[Seeder] Experience items seeded.');
    }

    // 5. Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        // Frontend
        { name: 'React JS', category: 'Frontend', proficiency: 95, level: 'Expert', icon: 'Atom', featured: true, order: 1 },
        { name: 'Next JS', category: 'Frontend', proficiency: 90, level: 'Advanced', icon: 'Cpu', featured: true, order: 2 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 92, level: 'Advanced', icon: 'Code', featured: true, order: 3 },
        { name: 'JavaScript', category: 'Frontend', proficiency: 95, level: 'Expert', icon: 'FileCode', featured: true, order: 4 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, level: 'Expert', icon: 'Palette', featured: true, order: 5 },
        { name: 'Bootstrap', category: 'Frontend', proficiency: 90, level: 'Advanced', icon: 'Layout', featured: false, order: 6 },
        { name: 'Material UI', category: 'Frontend', proficiency: 88, level: 'Advanced', icon: 'Layers', featured: false, order: 7 },
        { name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 95, level: 'Expert', icon: 'Globe', featured: false, order: 8 },

        // Programming & Algorithms
        { name: 'Problem Solving', category: 'Programming & Algorithms', proficiency: 98, level: 'Expert', icon: 'Brain', featured: true, order: 9 },
        { name: 'Data Structure & Algorithms', category: 'Programming & Algorithms', proficiency: 95, level: 'Expert', icon: 'Binary', featured: true, order: 10 },
        { name: 'C++', category: 'Programming & Algorithms', proficiency: 90, level: 'Advanced', icon: 'Terminal', featured: true, order: 11 },
        { name: 'OOP', category: 'Programming & Algorithms', proficiency: 95, level: 'Expert', icon: 'Blocks', featured: true, order: 12 },

        // Backend & APIs
        { name: 'REST APIs & Integration', category: 'Backend & APIs', proficiency: 94, level: 'Expert', icon: 'Network', featured: true, order: 13 },
        { name: 'Node.js', category: 'Backend & APIs', proficiency: 85, level: 'Advanced', icon: 'Server', featured: true, order: 14 },
        { name: 'Express.js', category: 'Backend & APIs', proficiency: 84, level: 'Advanced', icon: 'Workflow', featured: false, order: 15 },

        // Methodologies & Tools
        { name: 'Git', category: 'Tools & Methodologies', proficiency: 92, level: 'Advanced', icon: 'GitBranch', featured: true, order: 16 },
        { name: 'GitHub', category: 'Tools & Methodologies', proficiency: 92, level: 'Advanced', icon: 'Github', featured: true, order: 17 },
        { name: 'Agile', category: 'Tools & Methodologies', proficiency: 90, level: 'Advanced', icon: 'CheckCircle', featured: false, order: 18 },
      ]);
      if (!silent) console.log('[Seeder] Skills seeded.');
    }

    // 6. Education & Activities
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.insertMany([
        {
          title: "Bachelor's degree - Computer and system engineering",
          institution: 'Faculty of engineering, Minya University',
          location: 'Minya, Egypt',
          period: '2019 – 2024',
          type: 'Degree',
          description: 'Comprehensive 5-year engineering curriculum focused on computing architecture, algorithms, software engineering, databases, and control systems.',
          highlights: [
            'Deep grounding in Data Structures, Algorithms, Operating Systems, and Object-Oriented Design.',
            'Collaborated on multifaceted software engineering capstones and team projects.',
          ],
          order: 1,
        },
        {
          title: 'ICPC Community (600+ Problems Solved)',
          institution: 'International Collegiate Programming Contest Community',
          location: 'Egypt',
          period: '2020 – Present',
          type: 'Competition',
          description: 'Active participant in the competitive programming community, consistently practicing and solving algorithmic challenges.',
          highlights: [
            'Solved up to 600 algorithmic problems spanning dynamic programming, graph theory, number theory, and data structures.',
            'Honed high-speed problem decomposition, complexity optimization, and debugging techniques.',
          ],
          order: 2,
        },
        {
          title: 'ECPC Contest 2022',
          institution: 'Egyptian Collegiate Programming Contest',
          location: 'Egypt',
          period: '2022',
          type: 'Competition',
          description: 'Official participant in the Egyptian Collegiate Programming Contest (ECPC 2022), competing against elite engineering university teams across the country.',
          highlights: [
            'Qualified and competed at the national collegiate competitive programming tier.',
            'Collaborated under strict timed constraints to solve complex algorithmic problems.',
          ],
          order: 3,
        },
        {
          title: 'IEEE Community & Robotics Project',
          institution: 'IEEE Student Branch',
          location: 'Minya University',
          period: '2021 – 2022',
          type: 'Activity',
          description: 'Participant in the community and successfully engineered an autonomous line follower robot.',
          highlights: [
            'Built and programmed a line follower robot utilizing sensory feedback and PID motor control.',
            'Engaged in technical workshops, community peer mentoring, and hackathons.',
          ],
          order: 4,
        },
      ]);
      if (!silent) console.log('[Seeder] Education & Activities seeded.');
    }

    if (!silent) console.log('[Seeder] All portfolio data verified and ready.');
    return true;
  } catch (err) {
    console.error(`[Seeder] Seeding error: ${err.message}`);
    return false;
  }
};

// If run directly via node seeder.js
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  (async () => {
    try {
      await connectDB();
      await seedData();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
