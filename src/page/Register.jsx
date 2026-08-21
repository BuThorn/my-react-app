import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, Zap, CheckCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'មានបញ្ហាក្នុងការចុះឈ្មោះ');
      }

      setSuccess('ចុះឈ្មោះបានជោគជ័យ! កំពុងនាំទៅទំព័រ Login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">បង្កើតគណនី</h2>
          <p className="text-center text-sm text-gray-500">សូមបំពេញព័ត៌មានដើម្បីបង្កើតគណនី</p>
        </div>
        
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</label>
            <div>
              <span>
                <User className="h-5 w-5"/>
              </span>
              <input 
              type="text" 
              placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">លេខសម្ងាត់</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5"/>
              </span>
              <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="w-full flex items-center justify-normal gap-2 rounded-xl bg-gradient-to-tr from-emerald-600 py-3 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ?  <Loader2 className="h-5 w-5 animate-spin" /> : 'ចុះឈ្មោះ'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          មានគណនីហើយមែនទេ?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            ចូលប្រើប្រាស់
          </Link>
        </p>
      </div>
    </div>
  );
}
