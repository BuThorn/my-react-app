import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

import StartsGrid from './components/dashboard/StartsGrid';
import ChartSection from './components/dashboard/ChartSection';
import TableSection from './components/dashboard/TableSection';
import ActivityFeed from './components/dashboard/ActivityFeed';
import Users from './page/Users';

import Login from './page/Login';
import Register from './page/Register';

// ១. បង្កើត Component សម្រាប់ការពារទំព័រខាងក្នុង (បើមិនទាន់ Login ទេ វានឹងរុញទៅទំព័រ Login វិញ)
function ProtectedLayout({ isCollapsed, setIsCollapsed, currentPage, onPageChange, isDarkMode, onToggleTheme }) {
    // ពិនិត្យមើល token ឬស្ថានភាព लॉगिन ក្នុង LocalStorage
    const isAuthenticated = Boolean(localStorage.getItem('token')); 

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
            <div className="flex h-screen overflow-hidden">
                {/* បញ្ជូន State ទំព័របច្ចុប្បន្ន ទៅកាន់ Sidebar ឱ្យវាបំភ្លឺពណ៌ Menu */}
                <Sidebar
                    collapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed((previous) => !previous)}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* បញ្ជូនមុខងារឱ្យ Header អាចបើក/បិទ Sidebar តាមរយៈប៊ូតុង Menu បានដែរ */}
                    <Header 
                    onToggleSidebar={() => setIsCollapsed((prev) => !prev)}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme} 

                    />
                    <main className="flex-1 p-4 overflow-auto">
                        <Outlet /> {/* កន្លែងដែលទំព័រ Dashboard ឬ Users នឹងត្រូវបង្ហាញ */}
                    </main>
                </div>
            </div>
        </div>
    );
}

// ២. សមាសភាគសម្រាប់រុញផ្លូវរត់ដើម (Root Redirect)
function RootRedirect() {
    const isAuthenticated = Boolean(localStorage.getItem('token'));
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

// ៣. សមាសភាគចម្បង App
function App() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); // State សម្រាប់ទំព័របច្ចុប្បន្ន
    
    // បង្កើត State សម្រាប់គ្រប់គ្រង Dark Mode (ទាញយកតម្លៃចាស់ពី localStorage បើមាន)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    
    const location = useLocation();
    
    // បង្កើតមុខងារប្ដូរទៅ Dark Mode ឬ Light Mode
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    } , [isDarkMode]);

    // កំណត់ទំព័របច្ចុប្បន្ននៅពេលផ្លូវរត់ផ្លាស់ប្តូរ
    useEffect(() => {
        const path = location.pathname.replace('/', '');
        if (path) {
            setCurrentPage(path);
        } else {
            setCurrentPage('dashboard');
        }
    }, [location.pathname]);

    const handleToggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <Routes>
        ​​​​​​    {/* ទំព័រសាធារណៈ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={
                <ProtectedLayout 
                ​​​​​      isCollapsed={isCollapsed} 
                      setIsCollapsed={setIsCollapsed} 
                ​​​​​​​​      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      isDarkMode={isDarkMode}
                      onToggleTheme={handleToggleTheme}
                />
            }>

                <Route path="/dashboard" element={
                    <>
                        <StartsGrid />
                        <ChartSection />
                        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                            <TableSection />
                            <ActivityFeed />
                        </div>
                    </>
                } />

                <Route path="/team" element={<Users />} />
            </Route>
            
            {/* ទំព័រមិនស្គាល់ ឬទំព័រដើម */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    );
}

export default App;
