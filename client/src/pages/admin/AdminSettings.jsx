import React, { useState, useEffect } from 'react';
import {
  User,
  Globe,
  Share2,
  Lock,
  Save,
  Check,
  AlertCircle,
  Upload,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import { profileAPI, authAPI, uploadAPI } from '../../api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    subtitle: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    resumeUrl: '',
    statusText: '',
    heroIntro: '',
    aboutBio: '',
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
      twitter: '',
      telegram: '',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ success: null, text: '' });
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getProfile();
        if (res.data?.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data.data,
            socialLinks: {
              ...prev.socialLinks,
              ...(res.data.data.socialLinks || {}),
            },
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ success: null, text: '' });

    try {
      const res = await profileAPI.updateProfile(profile);
      if (res.data?.success) {
        setStatusMessage({
          success: true,
          text: 'Profile and website settings saved successfully!',
        });
      }
    } catch (err) {
      setStatusMessage({
        success: false,
        text: err.response?.data?.message || 'Failed to update settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatusMessage({ success: false, text: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    setStatusMessage({ success: null, text: '' });

    try {
      const res = await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setStatusMessage({ success: true, text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setStatusMessage({
        success: false,
        text: err.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingResume(true);
    try {
      const res = await uploadAPI.uploadImage(data);
      if (res.data?.url) {
        setProfile((prev) => ({ ...prev, resumeUrl: res.data.url }));
        setStatusMessage({ success: true, text: 'CV uploaded and updated!' });
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingResume(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'content', label: 'Hero & About Text', icon: Globe },
    { id: 'social', label: 'Social & Links', icon: Share2 },
    { id: 'security', label: 'Security & Password', icon: Lock },
  ];

  return (
    <AdminLayout title="Website Settings & CMS">
      <div className="space-y-6 max-w-4xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusMessage({ success: null, text: '' });
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 border ${
              statusMessage.success
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {statusMessage.success ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Personal Information */}
        {activeTab === 'personal' && (
          <form onSubmit={handleProfileSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-base font-display font-semibold text-white mb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sub-headline
              </label>
              <input
                type="text"
                value={profile.subtitle}
                onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Availability Status Text
                </label>
                <input
                  type="text"
                  value={profile.statusText}
                  onChange={(e) => setProfile({ ...profile, statusText: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                  placeholder="e.g. Available for Full-time Roles"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CV / Resume Link or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profile.resumeUrl}
                    onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                    className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                    placeholder="/Mohamed-Alaa-CV.pdf"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl border border-slate-700 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{uploadingResume ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={Save} loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Hero & About Copy */}
        {activeTab === 'content' && (
          <form onSubmit={handleProfileSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-base font-display font-semibold text-white mb-2">
              Website Texts & Bio
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hero Introduction Paragraph
              </label>
              <textarea
                rows="3"
                value={profile.heroIntro}
                onChange={(e) => setProfile({ ...profile, heroIntro: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                About Section Detailed Bio
              </label>
              <textarea
                rows="6"
                value={profile.aboutBio}
                onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={Save} loading={saving}>
                Save Texts
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Social & Links */}
        {activeTab === 'social' && (
          <form onSubmit={handleProfileSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-base font-display font-semibold text-white mb-2">
              Social Profiles & Links
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.socialLinks?.github || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, github: e.target.value },
                  })
                }
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Portfolio Custom Domain / URL
              </label>
              <input
                type="url"
                value={profile.socialLinks?.portfolio || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, portfolio: e.target.value },
                  })
                }
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://mohamedalaa.dev"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twitter / X URL (Optional)
              </label>
              <input
                type="url"
                value={profile.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                placeholder="https://x.com/..."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={Save} loading={saving}>
                Save Links
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-base font-display font-semibold text-white mb-2">
              Change Admin Password
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current Password <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Password <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm New Password <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={Lock} loading={saving}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
