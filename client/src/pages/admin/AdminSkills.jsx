import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Wrench, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { skillsAPI } from '../../api';

const categories = [
  'Frontend',
  'Programming & Algorithms',
  'Backend & APIs',
  'Tools & Methodologies',
];

const initialForm = {
  name: '',
  category: 'Frontend',
  proficiency: 90,
  level: 'Advanced',
  icon: 'Code',
  featured: false,
  order: 0,
};

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await skillsAPI.getAll();
      if (res.data?.data) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      proficiency: skill.proficiency || 85,
      level: skill.level || 'Advanced',
      icon: skill.icon || 'Code',
      featured: !!skill.featured,
      order: skill.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      proficiency: Number(formData.proficiency) || 85,
      order: Number(formData.order) || 0,
    };

    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill._id, payload);
      } else {
        await skillsAPI.create(payload);
      }
      setModalOpen(false);
      loadSkills();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    setActionLoading(true);
    try {
      await skillsAPI.delete(skillToDelete._id);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
      loadSkills();
    } catch (err) {
      alert('Failed to delete skill');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <AdminLayout title="Skills Catalog Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Technical Proficiencies
            </h2>
            <p className="text-xs text-slate-400">
              Manage your core technologies, algorithms, and frameworks
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Skill
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {skill.name}
                  </h4>
                  {skill.featured && (
                    <Star className="w-3 h-3 text-amber-400 fill-current shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span>{skill.category}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono">{skill.proficiency}%</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(skill)}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-md hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSkillToDelete(skill);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Skill */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Skill Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              placeholder="e.g. React JS, TypeScript, C++"
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
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Proficiency ({formData.proficiency}%)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Expertise Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 bg-dark-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span>Featured Skill</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={actionLoading}>
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}"?`}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminSkills;
