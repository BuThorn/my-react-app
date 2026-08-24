import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Acountuser() {
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || 'Admin User',
    email: '',
  });

  useEffect(() => {
    const syncProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nextUsername = data.username || localStorage.getItem('username') || 'Admin User';
        const nextEmail = data.email || '';

        setUser({ username: nextUsername, email: nextEmail });
        localStorage.setItem('username', nextUsername);
      } catch (error) {
        console.error('Failed to load account user profile:', error);
      }
    };

    syncProfile();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white">
          {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</h3>
          {user.email ? <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Acountuser;
