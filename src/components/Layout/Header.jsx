import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Filter, LogOut, Menu, Plus, Settings, Sun } from 'lucide-react';
import profileImage from '../../assets/img.jpg';

function Header({ onToggleSidebar = () => {}, isDarkMode = false, onToggleTheme = () => {} }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        navigate('/login', { replace: true });
    };

    return (
        <header className="border-b border-slate-200/50 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar menu"
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Menu className="w-6 h-5" />
                    </button>

                    <div className="hidden md:block">
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Welcome back, Alex! here's what's happening today.
                        </p>
                    </div>
                </div>

                <div className="mx-8 hidden max-w-md flex-1 md:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                            type="button"
                            aria-label="Filter search"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:hover:text-slate-300"
                        >
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">Add</span>
                    </button>

                    <button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label="Toggle theme"
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Sun className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-slate-700'}`} />
                    </button>

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Bell className="h-6 w-6" />
                        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white ring-2 ring-white">
                            3
                        </span>
                    </button>

                    <button
                        type="button"
                        aria-label="Settings"
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Settings className="h-6 w-6" />
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        <span>Logout</span>
                    </button>

                    <button
                        type="button"
                        aria-label="Open user profile"
                        className="flex items-center space-x-2 rounded-lg bg-slate-100 p-2 text-left transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        <img
                            className="h-10 w-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
                            src={profileImage}
                            alt="User Profile"
                        />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-slate-800 dark:text-white">Thorng</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
