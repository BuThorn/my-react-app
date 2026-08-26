import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function DashboardProfile() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'Admin User');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const syncProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nextUsername = data.username || localStorage.getItem('username') || 'Admin User';
        setUsername(nextUsername);
        localStorage.setItem('username', nextUsername);
        setEmail(data.email || '');
      } catch (error) {
        console.error('Failed to load profile for dashboard card:', error);
        setUsername(localStorage.getItem('username') || 'Admin User');
      }
    };

    syncProfile();
  }, []);

  const initials = username
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'AU';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{username}</h3>
          {email ? <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;
