import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Trophy, Award, Bot } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { educationAPI } from '../../api';

const initialForm = {
  title: '',
  institution: '',
  location: 'Egypt',
  period: '',
  type: 'Degree',
  description: '',
  highlights: '',
  order: 0,
};

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadEducations = async () => {
    try {
      setLoading(true);
      const res = await educationAPI.getAll();
      if (res.data?.data) {
        setEducations(res.data.data);
      }
    } catch (err) {
      console.error('Error loading educations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducations();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      institution: item.institution || '',
      location: item.location || '',
      period: item.period || '',
      type: item.type || 'Degree',
      description: item.description || '',
      highlights: (item.highlights || []).join('\n'),
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      highlights: formData.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      order: Number(formData.order) || 0,
    };

    try {
      if (editingItem) {
        await educationAPI.update(editingItem._id, payload);
      } else {
        await educationAPI.create(payload);
      }
      setModalOpen(false);
      loadEducations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving education entry');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      await educationAPI.delete(itemToDelete._id);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadEducations();
    } catch (err) {
      alert('Failed to delete education entry');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="Education & Contests Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Degrees, Contests & Certifications
            </h2>
            <p className="text-xs text-slate-400">
              Manage Minya University engineering degree, ICPC, and ECPC contest entries
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Entry
          </Button>
        </div>

        {/* Education List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educations.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      {item.period}
                    </span>
                    <h3 className="text-sm sm:text-base font-display font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {item.institution} {item.location && `• ${item.location}`}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                    {item.type}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete(item);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Entry' : 'Add Education / Contest'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Title / Degree / Contest <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              placeholder="e.g. Bachelor's degree - Computer and system engineering"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Institution / Organization <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="e.g. Minya University"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Time Period <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="e.g. 2019 – 2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Entry Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 bg-dark-900"
              >
                <option value="Degree">Degree</option>
                <option value="Competition">Competition</option>
                <option value="Activity">Activity</option>
                <option value="Certification">Certification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="Egypt"
              />
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
              placeholder="Overview..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Key Highlights (one per line)
            </label>
            <textarea
              rows="3"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              placeholder="Highlight 1&#10;Highlight 2"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={actionLoading}>
              {editingItem ? 'Save Changes' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        message={`Are you sure you want to delete "${itemToDelete?.title}"?`}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminEducation;
