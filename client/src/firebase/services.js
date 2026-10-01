import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword as fbUpdatePassword,
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, auth, storage, isFirebaseConfigured } from './config';
import {
  defaultProfile,
  defaultProjects,
  defaultSkills,
  defaultExperiences,
  defaultEducations,
} from '../data/defaultData';

// Local storage fallback helpers for when Firebase keys are not yet provided
const getLocal = (key, fallback) => {
  const item = localStorage.getItem(`portfolio_${key}`);
  return item ? JSON.parse(item) : fallback;
};

const setLocal = (key, val) => {
  localStorage.setItem(`portfolio_${key}`, JSON.stringify(val));
};

// -------------------------------------------------------------
// SEED INITIAL DATA TO FIRESTORE
// -------------------------------------------------------------
export const seedFirestoreIfEmpty = async () => {
  if (!isFirebaseConfigured || !db) return;

  try {
    // 1. Profile
    const profileRef = doc(db, 'settings', 'profile');
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await setDoc(profileRef, defaultProfile);
      console.log('[Firestore] Seeded initial profile data.');
    }

    // 2. Projects
    const projectsCol = collection(db, 'projects');
    const projectsSnap = await getDocs(projectsCol);
    if (projectsSnap.empty) {
      for (const p of defaultProjects) {
        await addDoc(projectsCol, { ...p, createdAt: serverTimestamp() });
      }
      console.log('[Firestore] Seeded initial projects.');
    }

    // 3. Skills
    const skillsCol = collection(db, 'skills');
    const skillsSnap = await getDocs(skillsCol);
    if (skillsSnap.empty) {
      for (const s of defaultSkills) {
        await addDoc(skillsCol, s);
      }
      console.log('[Firestore] Seeded initial skills.');
    }

    // 4. Experience
    const expCol = collection(db, 'experience');
    const expSnap = await getDocs(expCol);
    if (expSnap.empty) {
      for (const e of defaultExperiences) {
        await addDoc(expCol, e);
      }
      console.log('[Firestore] Seeded initial experience.');
    }

    // 5. Education
    const eduCol = collection(db, 'education');
    const eduSnap = await getDocs(eduCol);
    if (eduSnap.empty) {
      for (const ed of defaultEducations) {
        await addDoc(eduCol, ed);
      }
      console.log('[Firestore] Seeded initial education & contests.');
    }
  } catch (err) {
    console.warn('[Firestore] Error verifying/seeding initial data:', err.message);
  }
};

// -------------------------------------------------------------
// PROFILE SERVICE
// -------------------------------------------------------------
export const profileService = {
  getProfile: async () => {
    if (!isFirebaseConfigured || !db) {
      return getLocal('profile', defaultProfile);
    }
    try {
      const docRef = doc(db, 'settings', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      await setDoc(docRef, defaultProfile);
      return defaultProfile;
    } catch (e) {
      console.warn('Firestore profile fetch fallback:', e);
      return getLocal('profile', defaultProfile);
    }
  },

  updateProfile: async (data) => {
    if (!isFirebaseConfigured || !db) {
      setLocal('profile', data);
      return data;
    }
    const docRef = doc(db, 'settings', 'profile');
    await setDoc(docRef, data, { merge: true });
    return data;
  },
};

// -------------------------------------------------------------
// PROJECTS SERVICE
// -------------------------------------------------------------
export const projectsService = {
  getAll: async (params = {}) => {
    if (!isFirebaseConfigured || !db) {
      let projs = getLocal('projects', defaultProjects);
      if (params.category && params.category !== 'All') {
        projs = projs.filter((p) => p.category === params.category);
      }
      if (params.all !== 'true') {
        projs = projs.filter((p) => p.published !== false);
      }
      return projs;
    }

    try {
      const colRef = collection(db, 'projects');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        await seedFirestoreIfEmpty();
        return defaultProjects;
      }
      let list = snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
      if (params.category && params.category !== 'All') {
        list = list.filter((p) => p.category === params.category);
      }
      if (params.all !== 'true') {
        list = list.filter((p) => p.published !== false);
      }
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (e) {
      console.warn('Firestore projects fetch fallback:', e);
      return getLocal('projects', defaultProjects);
    }
  },

  getOne: async (idOrSlug) => {
    if (!isFirebaseConfigured || !db) {
      const list = getLocal('projects', defaultProjects);
      return list.find((p) => p._id === idOrSlug || p.slug === idOrSlug || p.id === idOrSlug) || null;
    }
    try {
      const docRef = doc(db, 'projects', idOrSlug);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { _id: snap.id, id: snap.id, ...snap.data() };
      }
      // Query by slug
      const q = query(collection(db, 'projects'), where('slug', '==', idOrSlug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const first = qSnap.docs[0];
        return { _id: first.id, id: first.id, ...first.data() };
      }
      return null;
    } catch (e) {
      const list = getLocal('projects', defaultProjects);
      return list.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },

  create: async (data) => {
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    const item = { ...data, slug, createdAt: new Date().toISOString() };

    if (!isFirebaseConfigured || !db) {
      const current = getLocal('projects', defaultProjects);
      const newItem = { ...item, _id: 'proj_' + Date.now(), id: 'proj_' + Date.now() };
      setLocal('projects', [newItem, ...current]);
      return newItem;
    }

    const docRef = await addDoc(collection(db, 'projects'), item);
    return { _id: docRef.id, id: docRef.id, ...item };
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('projects', defaultProjects);
      const updated = current.map((p) => (p._id === id || p.id === id ? { ...p, ...data } : p));
      setLocal('projects', updated);
      return { id, ...data };
    }
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  delete: async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('projects', defaultProjects);
      setLocal('projects', current.filter((p) => p._id !== id && p.id !== id));
      return true;
    }
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
    return true;
  },
};

// -------------------------------------------------------------
// SKILLS SERVICE
// -------------------------------------------------------------
export const skillsService = {
  getAll: async () => {
    if (!isFirebaseConfigured || !db) {
      return getLocal('skills', defaultSkills);
    }
    try {
      const snap = await getDocs(collection(db, 'skills'));
      if (snap.empty) {
        await seedFirestoreIfEmpty();
        return defaultSkills;
      }
      return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
    } catch (e) {
      return getLocal('skills', defaultSkills);
    }
  },

  create: async (data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('skills', defaultSkills);
      const newItem = { ...data, _id: 'skill_' + Date.now(), id: 'skill_' + Date.now() };
      setLocal('skills', [...current, newItem]);
      return newItem;
    }
    const docRef = await addDoc(collection(db, 'skills'), data);
    return { _id: docRef.id, id: docRef.id, ...data };
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('skills', defaultSkills);
      const updated = current.map((s) => (s._id === id || s.id === id ? { ...s, ...data } : s));
      setLocal('skills', updated);
      return { id, ...data };
    }
    await updateDoc(doc(db, 'skills', id), data);
    return { id, ...data };
  },

  delete: async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('skills', defaultSkills);
      setLocal('skills', current.filter((s) => s._id !== id && s.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'skills', id));
    return true;
  },
};

// -------------------------------------------------------------
// EXPERIENCE SERVICE
// -------------------------------------------------------------
export const experienceService = {
  getAll: async () => {
    if (!isFirebaseConfigured || !db) {
      return getLocal('experience', defaultExperiences);
    }
    try {
      const snap = await getDocs(collection(db, 'experience'));
      if (snap.empty) {
        await seedFirestoreIfEmpty();
        return defaultExperiences;
      }
      return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
    } catch (e) {
      return getLocal('experience', defaultExperiences);
    }
  },

  create: async (data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('experience', defaultExperiences);
      const newItem = { ...data, _id: 'exp_' + Date.now(), id: 'exp_' + Date.now() };
      setLocal('experience', [newItem, ...current]);
      return newItem;
    }
    const docRef = await addDoc(collection(db, 'experience'), data);
    return { _id: docRef.id, id: docRef.id, ...data };
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('experience', defaultExperiences);
      const updated = current.map((e) => (e._id === id || e.id === id ? { ...e, ...data } : e));
      setLocal('experience', updated);
      return { id, ...data };
    }
    await updateDoc(doc(db, 'experience', id), data);
    return { id, ...data };
  },

  delete: async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('experience', defaultExperiences);
      setLocal('experience', current.filter((e) => e._id !== id && e.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'experience', id));
    return true;
  },
};

// -------------------------------------------------------------
// EDUCATION SERVICE
// -------------------------------------------------------------
export const educationService = {
  getAll: async () => {
    if (!isFirebaseConfigured || !db) {
      return getLocal('education', defaultEducations);
    }
    try {
      const snap = await getDocs(collection(db, 'education'));
      if (snap.empty) {
        await seedFirestoreIfEmpty();
        return defaultEducations;
      }
      return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
    } catch (e) {
      return getLocal('education', defaultEducations);
    }
  },

  create: async (data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('education', defaultEducations);
      const newItem = { ...data, _id: 'edu_' + Date.now(), id: 'edu_' + Date.now() };
      setLocal('education', [newItem, ...current]);
      return newItem;
    }
    const docRef = await addDoc(collection(db, 'education'), data);
    return { _id: docRef.id, id: docRef.id, ...data };
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('education', defaultEducations);
      const updated = current.map((ed) => (ed._id === id || ed.id === id ? { ...ed, ...data } : ed));
      setLocal('education', updated);
      return { id, ...data };
    }
    await updateDoc(doc(db, 'education', id), data);
    return { id, ...data };
  },

  delete: async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('education', defaultEducations);
      setLocal('education', current.filter((ed) => ed._id !== id && ed.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'education', id));
    return true;
  },
};

// -------------------------------------------------------------
// MESSAGES SERVICE (CONTACT FORM)
// -------------------------------------------------------------
export const messagesService = {
  sendMessage: async (data) => {
    const newMsg = {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (!isFirebaseConfigured || !db) {
      const current = getLocal('messages', []);
      const item = { ...newMsg, _id: 'msg_' + Date.now(), id: 'msg_' + Date.now() };
      setLocal('messages', [item, ...current]);
      return { success: true, data: item };
    }

    const docRef = await addDoc(collection(db, 'messages'), newMsg);
    return { success: true, data: { _id: docRef.id, id: docRef.id, ...newMsg } };
  },

  getMessages: async () => {
    if (!isFirebaseConfigured || !db) {
      return getLocal('messages', []);
    }
    try {
      const snap = await getDocs(collection(db, 'messages'));
      const list = snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      return getLocal('messages', []);
    }
  },

  markRead: async (id, read = true) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('messages', []);
      const updated = current.map((m) => (m._id === id || m.id === id ? { ...m, read } : m));
      setLocal('messages', updated);
      return { id, read };
    }
    await updateDoc(doc(db, 'messages', id), { read });
    return { id, read };
  },

  delete: async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getLocal('messages', []);
      setLocal('messages', current.filter((m) => m._id !== id && m.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'messages', id));
    return true;
  },
};

// -------------------------------------------------------------
// FIREBASE STORAGE SERVICE (IMAGES & FILES)
// -------------------------------------------------------------
export const storageService = {
  uploadFile: async (file, folder = 'portfolio') => {
    if (!isFirebaseConfigured || !storage) {
      // Return a base64 or object URL fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  },
};

// -------------------------------------------------------------
// AUTH SERVICE (FIREBASE AUTH)
// -------------------------------------------------------------
export const authService = {
  login: async (email, password) => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCred.user.getIdToken();
        const user = {
          id: userCred.user.uid,
          email: userCred.user.email,
          name: userCred.user.displayName || 'Mohamed Alaa',
          role: 'admin',
        };
        return { success: true, token, user };
      } catch (err) {
        throw new Error(err.message || 'Firebase login failed');
      }
    }

    // Default development credentials check
    if (
      email.toLowerCase() === 'mohamedalaaelnasharedu@gmail.com' &&
      password === 'admin123456'
    ) {
      const user = {
        id: 'admin_local',
        email: 'mohamedalaaelnasharedu@gmail.com',
        name: 'Mohamed Alaa',
        role: 'admin',
      };
      return {
        success: true,
        token: 'firebase_dev_mock_token_' + Date.now(),
        user,
      };
    }
    throw new Error('Invalid email or password');
  },

  logout: async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  },

  updatePassword: async (newPassword) => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await fbUpdatePassword(auth.currentUser, newPassword);
      return { success: true };
    }
    return { success: true, message: 'Password updated (dev mode)' };
  },
};
