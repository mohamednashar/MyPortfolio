import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Wrench,
  Briefcase,
  MessageSquare,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import { statsAPI, projectsAPI, contactAPI } from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, projectsRes, messagesRes] = await Promise.all([
          statsAPI.getStats(),
          projectsAPI.getAll({ all: 'true' }),
          contactAPI.getMessages(),
        ]);

        if (statsRes.data?.data) setStats(statsRes.data.data);
        if (projectsRes.data?.data) setRecentProjects(projectsRes.data.data.slice(0, 4));
        if (messagesRes.data?.data) setRecentMessages(messagesRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CMS Administration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Welcome back, Mohamed!
            </h2>
            <p className="text-sm text-slate-400 max-w-xl font-light">
              Manage your portfolio content, projects, experience timeline, and visitor inquiries in real time without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link to="/admin/projects">
              <Button variant="primary" size="md" icon={Plus}>
                Add Project
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="secondary" size="md">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Projects"
            value={stats?.projects?.total || 0}
            subtitle={`${stats?.projects?.featured || 0} Featured on Home`}
            icon={FolderGit2}
            color="cyan"
          />
          <StatCard
            title="Skills Catalog"
            value={stats?.skills?.total || 0}
            subtitle="Frontend, Core, APIs & Tools"
            icon={Wrench}
            color="indigo"
          />
          <StatCard
            title="Career Timeline"
            value={stats?.experience?.total || 0}
            subtitle="InstaTech & Internships"
            icon={Briefcase}
            color="emerald"
          />
          <StatCard
            title="Inquiries / Messages"
            value={stats?.messages?.total || 0}
            subtitle={`${stats?.messages?.unread || 0} Unread`}
            icon={MessageSquare}
            color="amber"
          />
        </div>

        {/* Main 2-Column Split: Recent Projects & Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Projects Table */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-semibold text-white">
                  Recent Projects
                </h3>
                <p className="text-xs text-slate-400">
                  Quick status of your showcase projects
                </p>
              </div>
              <Link
                to="/admin/projects"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-1">Project</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentProjects.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pl-1">
                        <div className="font-semibold text-white truncate max-w-[180px]">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {p.summary}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-mono">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.published
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {p.published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-1">
                        <Link
                          to="/admin/projects"
                          className="text-slate-400 hover:text-cyan-400 inline-block p-1"
                          title="Manage"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-semibold text-white">
                  Visitor Inquiries
                </h3>
                <p className="text-xs text-slate-400">
                  Messages submitted from contact form
                </p>
              </div>
              <Link
                to="/admin/messages"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No inquiries received yet. Submit a message from the contact form to test.
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                      !msg.read
                        ? 'bg-cyan-500/5 border-cyan-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{msg.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 line-clamp-2 font-light">
                      {msg.message}
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {msg.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
