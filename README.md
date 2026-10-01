# Mohamed Alaa — Personal Developer Portfolio & CMS

A **modern 2026 full-stack developer portfolio and content management system (CMS)** built specifically for **Mohamed Alaa** — Full-Stack / Frontend Developer and Programming Instructor.

The website delivers a SaaS-level aesthetic, dark-first design, glassmorphic accents, fluid Framer Motion animations, an interactive developer terminal, and a **complete private Admin Dashboard** allowing zero-code updates to projects, experience, skills, website copy, and contact inquiries.

All initial content is directly sourced from Mohamed Alaa's genuine CV (Computer & System Engineering, Minya University; Frontend Developer at InstaTech; 600+ problems solved in the ICPC Community).

---

## 🌟 Key Features

### 1. Modern 2026 Developer Aesthetic
- **Dark-First Design**: Obsidian slate palette with glowing cyan and indigo accents.
- **Micro-Interactions & Animations**: Powered by Framer Motion and Tailwind CSS.
- **Glassmorphic Cards**: Depth, subtle borders, and blur filters.
- **Fully Responsive**: Mobile-first design for smartphones, tablets, laptops, and ultra-wide screens.

### 2. Interactive Developer Terminal
- Embedded terminal in the hero section.
- Supports commands: `help`, `whoami`, `skills`, `projects`, `icpc`, `contact`, `hire`, and `clear`.
- Includes clickable quick-command chips for touch and mouse interactions.

### 3. Comprehensive Sections (CV-Driven)
- **Hero Section**: Engaging headline, verified intro, primary & secondary CTAs, social links, and real CV PDF download.
- **Key Metrics Strip**: 600+ ICPC problems solved, ECPC 2022 contestant, 2+ years experience at InstaTech.
- **About Section**: Minya University Engineering background, frontend specialization, and algorithmic problem-solving rigor.
- **Categorized Skills**: Filterable tabs (Frontend, Programming & Algorithms, Backend & APIs, Tools & Methodologies) with proficiency meters.
- **Featured Projects**: Filterable project showcase cards with live demo links, GitHub repositories, and full **Case Study Modals** (problem, solution, features, tech stack, and screenshot slider).
- **Career Timeline**: Interactive timeline showcasing InstaTech, Elmawkaa Internship, and ITI Robotics Training.
- **Academics & Contests**: Minya University degree, ICPC community highlights, ECPC 2022, and IEEE Robotics project.
- **Contact Form**: Interactive message submission with real-time validation, server-side persistence, and confetti animations.

### 4. Full Admin Dashboard / CMS
- **Overview Metrics**: Total projects, featured projects, total skills, experience items, and message counters.
- **Project Management**: Create, edit, delete, toggle featured/published status, reorder, manage screenshots, and write case studies.
- **Experience Management**: Add, update, and reorder career roles, dates, and achievement bullet points.
- **Skills Management**: Add new skills, adjust proficiency percentages, and categorize.
- **Education & Activities Management**: Update degree details and contest honors.
- **Inquiries Inbox**: Review messages submitted through the contact form, toggle read/unread status, and reply via mailto shortcut.
- **Website Settings CMS**: Edit full name, title, bio, email, phone, location, status, social links, resume link, and change admin password.
- **Image Upload Support**: Upload images locally or directly to Cloudinary.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router v6, Canvas Confetti |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, Multer, Cloudinary SDK |
| **Database** | MongoDB (supports MongoDB Atlas and local `mongod`) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js password hashing |
| **Dev Tooling** | `dev-runner.js` for single-command full-stack development |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

### 2. Installation

Clone or open the project folder in your terminal:

```bash
cd "c:\Users\Mohamed Alaa\Desktop\My Portfolio"
```

Install root, client, and server dependencies:

```bash
npm run install:all
```

*(Alternatively, run `npm install` inside both `./server` and `./client` folders)*

---

### 3. Environment Configuration

Check the server `.env` file located at `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=super_secure_jwt_secret_key_mohamed_alaa_portfolio_2026
JWT_EXPIRE=30d
ADMIN_EMAIL=mohamedalaaelnasharedu@gmail.com
ADMIN_PASSWORD=admin123456
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary Configuration (for cloud image storage in production)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4. Running Development Servers

Start both backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend Website**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Admin Dashboard**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 🔐 Default Admin Account

Log into the Admin CMS at `/admin/login`:

- **Email**: `mohamedalaaelnasharedu@gmail.com`
- **Password**: `admin123456`

*(You can change your password anytime under **Settings & Profile** in the Admin Dashboard)*

---

## 💾 Database Seeding

The application automatically seeds Mohamed Alaa's complete CV data on initial server boot. If you ever want to re-seed or reset data manually, run:

```bash
npm run seed
```

---

## 🌐 Deployment Instructions

### 1. Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist network access (`0.0.0.0/0`).
3. Copy your connection string into `server/.env` under `MONGODB_URI`.

### 2. Backend Deployment (Render / Railway)
1. Connect your repository to Render or Railway.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.).

### 3. Frontend Deployment (Vercel)
1. Connect repository to [Vercel](https://vercel.com).
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.

---

## 📄 License
Created with ❤️ for **Mohamed Alaa**. All rights reserved.
