import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiSave, FiShield, FiBell, FiCheckCircle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultProfile = {
  username: '',
  email: '',
  role: 'Administrator',
  notifications: true,
  darkMode: false,
  language: 'English',
  permissions: {
    dashboard: true,
    team: true,
    settings: true,
  },
};

export default function Acount() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const merged = {
          username: data.username || '',
          email: data.email || '',
          role: data.role || 'Administrator',
          notifications: Boolean(data.notifications ?? true),
          darkMode: Boolean(data.darkMode ?? false),
          language: data.language || 'English',
          permissions: {
            dashboard: Boolean(data.permissions?.dashboard ?? true),
            team: Boolean(data.permissions?.team ?? true),
            settings: Boolean(data.permissions?.settings ?? true),
          },
        };

        setProfile(merged);
        localStorage.setItem('username', merged.username);
      } catch (error) {
        console.error('Failed to load account data:', error);
        setMessage('Unable to load account information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith('permission-')) {
      const permissionKey = name.replace('permission-', '');
      setProfile((current) => ({
        ...current,
        permissions: {
          ...current.permissions,
          [permissionKey]: checked,
        },
      }));
      return;
    }

    setProfile((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        {
          username: profile.username,
          email: profile.email,
          notifications: profile.notifications,
          darkMode: profile.darkMode,
          language: profile.language,
          permissions: profile.permissions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem('username', profile.username);
      setMessage('Account updated successfully.');
    } catch (error) {
      console.error('Failed to update account:', error);
      setMessage('Account update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">My Account</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <FiCheckCircle className="h-4 w-4" />
            {profile.role}
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">Loading account...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{profile.username || 'Account User'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email || 'No email available'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <FiUser className="h-4 w-4" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <FiMail className="h-4 w-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Language</label>
                  <select
                    name="language"
                    value={profile.language}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="Khmer">Khmer</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <div className="mb-4 flex items-center gap-2">
                  <FiBell className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60">
                  <span className="text-slate-700 dark:text-slate-200">Email notifications</span>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={profile.notifications}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                </label>

                <label className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60">
                  <span className="text-slate-700 dark:text-slate-200">Dark mode</span>
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={profile.darkMode}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <div className="mb-4 flex items-center gap-2">
                  <FiShield className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Permissions</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'dashboard', label: 'Dashboard access' },
                    { key: 'team', label: 'Team management' },
                    { key: 'settings', label: 'Settings access' },
                  ].map((permission) => (
                    <label
                      key={permission.key}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60"
                    >
                      <span className="text-slate-700 dark:text-slate-200">{permission.label}</span>
                      <input
                        type="checkbox"
                        name={`permission-${permission.key}`}
                        checked={Boolean(profile.permissions?.[permission.key])}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
