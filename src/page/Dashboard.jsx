import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StartsGrid from '../components/dashboard/StartsGrid';
import ChartSection from '../components/dashboard/ChartSection';
import TableSection from '../components/dashboard/TableSection';
import ActivityFeed from '../components/dashboard/ActivityFeed';

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        navigate('/login', { replace: true });
    };

    return (
        <main className="space-y-4 p-4">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md bg-red-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
                >
                    ចាក់ចេញ (Logout)
                </button>
            </div>

            <StartsGrid />
            <ChartSection />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                <TableSection />
                <ActivityFeed />
            </div>
        </main>
    );
}

export default Dashboard;