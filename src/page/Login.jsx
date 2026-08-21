import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, Zap } from 'lucide-react';

export default function Login() {
  // ប្តូរពី email មកប្រើ username ឱ្យត្រូវតាម API Backend របស់អ្នក
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'មានបញ្ហាក្នុងការចូលប្រើប្រាស់');
      }

      // រក្សាទុក Token និង ឈ្មោះអ្នកប្រើប្រាស់ដែលបានមកពី Backend
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-xl border border-white/20 dark:bg-slate-900/80 dark:border-slate-800">
         
         {/* Brand Logo */}
         <div className="flex flex-col items-start justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">សួស្តីម្តងទៀត!</h2>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">សូមបំពេញព័ត៌មានដើម្បីចូលប្រើប្រាស់</p>
         </div>
         
         {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
            {error}
          </div>
         )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</label>
            <div>
              <span>
                <User className="h-5 w-5" />
              </span>
              <input 
              type="text" 
              placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
            />
            </div>
          </div>

           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">លេខសម្ងាត់</label>
            <div>
              <span>
                <Lock className="h-5 w-5" />
              </span>
              <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-10 py-2.5 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>
           </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 py-3 text-white font-semibold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'ចូលប្រើប្រាស់'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          មិនទាន់មានគណនី?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            បង្កើតគណនី
          </Link>
        </p>
      </div>
    </div>
  );
}
