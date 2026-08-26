import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSettings, FiChevronUp, FiChevronDown, FiUser, FiBell, FiShield, FiSave, FiRefreshCw } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultFormData = {
  username: '',
  email: '',
  notifications: true,
  darkMode: false,
  language: 'khmer',
  permissions: {
    dashboard: true,
    team: true,
    settings: true,
  },
};

const SettingsPage = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          notifications: Boolean(response.data.notifications ?? true),
          darkMode: Boolean(response.data.darkMode ?? false),
          language: response.data.language || 'khmer',
          permissions: response.data.permissions || {
            dashboard: true,
            team: true,
            settings: true,
          },
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage({
          type: 'error',
          text: 'Unable to load settings. Please check your connection or token.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith('permission-')) {
      const permissionKey = name.replace('permission-', '');
      setFormData((previous) => ({
        ...previous,
        permissions: {
          ...previous.permissions,
          [permissionKey]: checked,
        },
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/settings`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem('username', formData.username);
      setMessage({
        type: 'success',
        text: 'Settings saved successfully.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        type: 'error',
        text: 'Save failed. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b1329]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b1329] font-sans text-gray-300 antialiased select-none">
      <div className="hidden w-64 border-r border-gray-800 bg-[#0d1733] p-4 md:block">
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center justify-between rounded-lg bg-[#111c44] p-3 text-[#3b82f6] transition-all duration-200 hover:bg-[#16255a]"
        >
          <div className="flex items-center gap-3 text-base font-semibold">
            <FiSettings className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <div>
            {isDropdownOpen ? <FiChevronUp className="h-4 w-4 text-[#3b82f6]" /> : <FiChevronDown className="h-4 w-4 text-gray-400" />}
          </div>
        </div>

        {isDropdownOpen && (
          <div className="mt-2 flex flex-col gap-1 pl-11">
            {['general', 'notifications', 'permissions'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full py-2 text-left text-sm font-medium transition-colors ${
                  activeTab === tab ? 'font-bold text-[#3b82f6]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-800/80 bg-[#111c44]/40 p-6 shadow-2xl backdrop-blur-sm">
          {message.text && (
            <div
              className={`mb-6 rounded-lg border p-4 text-sm font-medium ${
                message.type === 'success'
                  ? 'border-green-500/30 bg-green-950/40 text-green-400'
                  : 'border-red-500/30 bg-red-950/40 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <FiUser className="h-5 w-5 text-[#3b82f6]" />
                  <h2 className="text-lg font-semibold text-white">General</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-400">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-700 bg-[#0b1329] p-2.5 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-400">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-700 bg-[#0b1329] p-2.5 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <FiBell className="h-5 w-5 text-[#3b82f6]" />
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                </div>

                <label className="flex items-center justify-between rounded border border-gray-700 bg-[#0b1329] p-3 text-white">
                  <span>Receive email notifications</span>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between rounded border border-gray-700 bg-[#0b1329] p-3 text-white">
                  <span>Enable dark mode</span>
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <FiShield className="h-5 w-5 text-[#3b82f6]" />
                  <h2 className="text-lg font-semibold text-white">Permissions</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'dashboard', label: 'Dashboard Access' },
                    { key: 'team', label: 'Team Management' },
                    { key: 'settings', label: 'Settings Access' },
                  ].map((permission) => (
                    <label
                      key={permission.key}
                      className="flex items-center justify-between rounded border border-gray-700 bg-[#0b1329] p-3 text-white"
                    >
                      <span>{permission.label}</span>
                      <input
                        type="checkbox"
                        name={`permission-${permission.key}`}
                        checked={Boolean(formData.permissions?.[permission.key])}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-gray-800 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
              >
                <FiRefreshCw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-70"
              >
                <FiSave className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
