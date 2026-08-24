import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProfileSettings() {
  const [profile, setProfile] = useState({ username: '', email: '' });
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

        setProfile({
          username: data.username || '',
          email: data.email || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setMessage('Unable to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem('username', profile.username);
      setMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Profile update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account details.</p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 dark:text-slate-400">Loading profile...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfileSettings;
