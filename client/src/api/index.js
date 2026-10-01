import {
  profileService,
  projectsService,
  skillsService,
  experienceService,
  educationService,
  messagesService,
  storageService,
  authService,
} from '../firebase/services';

// Firebase-driven API abstraction maintaining 100% component compatibility
export const authAPI = {
  login: async (credentials) => {
    const res = await authService.login(credentials.email, credentials.password);
    return { data: res };
  },
  getMe: async () => {
    const user = JSON.parse(localStorage.getItem('portfolio_user') || 'null');
    return { data: { success: true, user } };
  },
  updatePassword: async (passwords) => {
    const res = await authService.updatePassword(passwords.newPassword);
    return { data: { success: true, ...res } };
  },
};

export const profileAPI = {
  getProfile: async () => {
    const data = await profileService.getProfile();
    return { data: { success: true, data } };
  },
  updateProfile: async (data) => {
    const updated = await profileService.updateProfile(data);
    return { data: { success: true, data: updated } };
  },
};

export const projectsAPI = {
  getAll: async (params) => {
    const data = await projectsService.getAll(params);
    return { data: { success: true, data, count: data.length } };
  },
  getOne: async (idOrSlug) => {
    const data = await projectsService.getOne(idOrSlug);
    return { data: { success: true, data } };
  },
  create: async (data) => {
    const created = await projectsService.create(data);
    return { data: { success: true, data: created } };
  },
  update: async (id, data) => {
    const updated = await projectsService.update(id, data);
    return { data: { success: true, data: updated } };
  },
  delete: async (id) => {
    await projectsService.delete(id);
    return { data: { success: true } };
  },
};

export const experienceAPI = {
  getAll: async () => {
    const data = await experienceService.getAll();
    return { data: { success: true, data, count: data.length } };
  },
  create: async (data) => {
    const created = await experienceService.create(data);
    return { data: { success: true, data: created } };
  },
  update: async (id, data) => {
    const updated = await experienceService.update(id, data);
    return { data: { success: true, data: updated } };
  },
  delete: async (id) => {
    await experienceService.delete(id);
    return { data: { success: true } };
  },
};

export const skillsAPI = {
  getAll: async (params) => {
    const data = await skillsService.getAll();
    return { data: { success: true, data, count: data.length } };
  },
  create: async (data) => {
    const created = await skillsService.create(data);
    return { data: { success: true, data: created } };
  },
  update: async (id, data) => {
    const updated = await skillsService.update(id, data);
    return { data: { success: true, data: updated } };
  },
  delete: async (id) => {
    await skillsService.delete(id);
    return { data: { success: true } };
  },
};

export const educationAPI = {
  getAll: async () => {
    const data = await educationService.getAll();
    return { data: { success: true, data, count: data.length } };
  },
  create: async (data) => {
    const created = await educationService.create(data);
    return { data: { success: true, data: created } };
  },
  update: async (id, data) => {
    const updated = await educationService.update(id, data);
    return { data: { success: true, data: updated } };
  },
  delete: async (id) => {
    await educationService.delete(id);
    return { data: { success: true } };
  },
};

export const contactAPI = {
  sendMessage: async (data) => {
    const res = await messagesService.sendMessage(data);
    return { data: res };
  },
  getMessages: async () => {
    const data = await messagesService.getMessages();
    return { data: { success: true, data, count: data.length } };
  },
  markRead: async (id, read) => {
    const res = await messagesService.markRead(id, read);
    return { data: { success: true, data: res } };
  },
  delete: async (id) => {
    await messagesService.delete(id);
    return { data: { success: true } };
  },
};

export const statsAPI = {
  getStats: async () => {
    const [projects, skills, experience, education, messages] = await Promise.all([
      projectsService.getAll({ all: 'true' }),
      skillsService.getAll(),
      experienceService.getAll(),
      educationService.getAll(),
      messagesService.getMessages(),
    ]);

    return {
      data: {
        success: true,
        data: {
          projects: {
            total: projects.length,
            featured: projects.filter((p) => p.featured).length,
            published: projects.filter((p) => p.published !== false).length,
          },
          skills: {
            total: skills.length,
          },
          experience: {
            total: experience.length,
          },
          education: {
            total: education.length,
          },
          messages: {
            total: messages.length,
            unread: messages.filter((m) => !m.read).length,
          },
          overview: {
            lastProjectUpdated: projects[0]?.title || 'None',
            lastActiveAt: new Date().toISOString(),
            profileName: 'Mohamed Alaa',
          },
        },
      },
    };
  },
};

export const uploadAPI = {
  uploadImage: async (formData) => {
    const file = formData.get('image');
    if (!file) throw new Error('No file provided');
    const url = await storageService.uploadFile(file);
    return { data: { success: true, url } };
  },
};

export default {
  authAPI,
  profileAPI,
  projectsAPI,
  skillsAPI,
  experienceAPI,
  educationAPI,
  contactAPI,
  statsAPI,
  uploadAPI,
};
