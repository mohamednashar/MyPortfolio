import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { projectsAPI, uploadAPI } from '../../api';

const initialForm = {
  title: '',
  slug: '',
  category: 'Frontend',
  summary: '',
  description: '',
  problem: '',
  solution: '',
  technologies: '',
  features: '',
  image: '',
  screenshots: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  published: true,
  order: 0,
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getAll({ all: 'true' });
      if (res.data?.data) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || 'Frontend',
      summary: project.summary || '',
      description: project.description || '',
      problem: project.problem || '',
      solution: project.solution || '',
      technologies: (project.technologies || []).join(', '),
      features: (project.features || []).join('\n'),
      image: project.image || '',
      screenshots: (project.screenshots || []).join('\n'),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: !!project.featured,
      published: project.published !== undefined ? project.published : true,
      order: project.order || 0,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadImage(data);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      alert('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      features: formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      screenshots: formData.screenshots
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      order: Number(formData.order) || 0,
    };

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject._id, payload);
      } else {
        await projectsAPI.create(payload);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublished = async (project) => {
    try {
      await projectsAPI.update(project._id, { published: !project.published });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, published: !p.published } : p))
      );
    } catch (err) {
      alert('Failed to update published status');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      await projectsAPI.update(project._id, { featured: !project.featured });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, featured: !p.featured } : p))
      );
    } catch (err) {
      alert('Failed to update featured status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setActionLoading(true);
    try {
      await projectsAPI.delete(projectToDelete._id);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="Project Management">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by name, category, or stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add New Project
          </Button>
        </div>

        {/* Projects Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Technologies</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                              IMG
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate max-w-[200px]">
                              {project.title}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                              {project.summary}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-cyan-300 font-mono">
                          {project.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {project.technologies?.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/60 text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-[10px] text-slate-500">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            project.featured
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(project)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            project.published
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{project.published ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectToDelete(project);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="e.g. Education Platform Website"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 bg-dark-900"
              >
                <option value="Frontend">Frontend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="eCommerce">eCommerce</option>
                <option value="Enterprise / ERP">Enterprise / ERP</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Short Summary <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              placeholder="Brief summary for card display"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Detailed Description / Overview
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              placeholder="Full case study explanation..."
            />
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                The Problem
              </label>
              <textarea
                rows="2"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
                placeholder="What challenge did this solve?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                The Solution
              </label>
              <textarea
                rows="2"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
                placeholder="How was it architected/implemented?"
              />
            </div>
          </div>

          {/* Technologies & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                placeholder="React JS, TypeScript, Tailwind CSS"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Key Features (one per line)
              </label>
              <textarea
                rows="3"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>

          {/* Image & Screenshots */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Main Image URL & File Upload
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://... or upload below"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl border border-slate-700 shrink-0">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Additional Screenshots (one URL per line)
            </label>
            <textarea
              rows="2"
              value={formData.screenshots}
              onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              placeholder="https://...&#10;https://..."
            />
          </div>

          {/* Links & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span>Mark as Featured</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span>Publish Live</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={actionLoading}>
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?`}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminProjects;
