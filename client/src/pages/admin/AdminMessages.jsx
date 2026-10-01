import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, MailOpen, Reply, Clock, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { contactAPI } from '../../api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await contactAPI.getMessages();
      if (res.data?.data) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    try {
      const updatedRead = !msg.read;
      await contactAPI.markRead(msg._id, updatedRead);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, read: updatedRead } : m))
      );
    } catch (err) {
      alert('Failed to update message status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    setActionLoading(true);
    try {
      await contactAPI.delete(messageToDelete._id);
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
      if (selectedMessage?._id === messageToDelete._id) {
        setSelectedMessage(null);
      }
      loadMessages();
    } catch (err) {
      alert('Failed to delete message');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Inquiries & Messages Inbox">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries by sender, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            Total Messages: <span className="text-cyan-400 font-bold">{messages.length}</span> (
            <span className="text-amber-400 font-bold">
              {messages.filter((m) => !m.read).length} Unread
            </span>
            )
          </div>
        </div>

        {/* Messages List & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inbox Feed */}
          <div className="lg:col-span-6 space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-500 text-xs">
                No messages found. Form inquiries from the public website will appear here.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`glass-card rounded-xl p-4 border transition-all cursor-pointer ${
                    selectedMessage?._id === msg._id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : !msg.read
                      ? 'border-cyan-500/40 bg-dark-900'
                      : 'border-slate-800 bg-dark-950/60 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-white truncate">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-300 truncate mb-1">
                    {msg.subject || 'No Subject'}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 font-light">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Reading Pane */}
          <div className="lg:col-span-6">
            {selectedMessage ? (
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 sticky top-24">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">
                      {selectedMessage.subject || 'General Inquiry'}
                    </h3>
                    <div className="mt-1 text-xs text-slate-400 space-y-0.5">
                      <p>
                        From: <span className="text-white font-medium">{selectedMessage.name}</span>
                      </p>
                      <p className="font-mono text-cyan-400">
                        {selectedMessage.email}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(selectedMessage)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMessage.read
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-cyan-400 hover:bg-cyan-500/20'
                      }`}
                      title={selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageToDelete(selectedMessage);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Portfolio Inquiry'
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-semibold text-xs transition-colors shadow-md shadow-cyan-500/20"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-500 text-xs border border-slate-800">
                Select a message on the left to read full details.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Inquiry"
        message="Are you sure you want to delete this message?"
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminMessages;
