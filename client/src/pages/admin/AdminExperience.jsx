import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Building2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { experienceAPI } from '../../api';

const initialForm = {
  position: '',
  company: '',
  location: 'Egypt',
  startDate: '',
  endDate: 'Present',
  isCurrent: false,
  type: 'Full-time',
  description: '',
  achievements: '',
  technologies: '',
  order: 0,
};

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await experienceAPI.getAll();
      if (res.data?.data) {
        setExperiences(res.data.data);
      }
    } catch (err) {
      console.error('Error loading experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      position: item.position || '',
      company: item.company || '',
      location: item.location || '',
      startDate: item.startDate || '',
      endDate: item.endDate || 'Present',
      isCurrent: !!item.isCurrent,
      type: item.type || 'Full-time',
      description: item.description || '',
      achievements: (item.achievements || []).join('\n'),
      technologies: (item.technologies || []).join(', '),
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      achievements: formData.achievements
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(formData.order) || 0,
    };

    try {
      if (editingItem) {
        await experienceAPI.update(editingItem._id, payload);
      } else {
        await experienceAPI.create(payload);
      }
      setModalOpen(false);
      loadExperiences();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving experience');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      await experienceAPI.delete(itemToDelete._id);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadExperiences();
    } catch (err) {
      alert('Failed to delete experience');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="Experience & Internships CMS">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Career Timeline
            </h2>
            <p className="text-xs text-slate-400">
              Manage professional roles, internships, and company engagements
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Experience
          </Button>
        </div>

        {/* List of Experiences */}
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-display font-semibold text-white">
                    {exp.position}
                  </h3>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-cyan-400 font-medium">
                    {exp.company}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {exp.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {exp.startDate} – {exp.endDate}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {exp.achievements?.length > 0 && (
                  <div className="text-xs text-slate-400 pl-4 border-l border-slate-800 space-y-1">
                    {exp.achievements.map((ach, i) => (
                      <div key={i}>• {ach}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete(exp);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Experience */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Experience' : 'Add Experience'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Position / Job Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="e.g. InstaTech"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Date <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="MM/YYYY (e.g. 08/2023)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="Present or MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Role Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 bg-dark-900"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Training">Training</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              placeholder="High level overview of responsibilities..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Key Achievements & Deliverables (one per line)
            </label>
            <textarea
              rows="3"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              placeholder="Achievement 1&#10;Achievement 2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Technologies Used (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                placeholder="React JS, Next JS, TypeScript"
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={actionLoading}>
              {editingItem ? 'Save Changes' : 'Add Experience'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Experience"
        message={`Are you sure you want to delete ${itemToDelete?.position} at ${itemToDelete?.company}?`}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminExperience;
