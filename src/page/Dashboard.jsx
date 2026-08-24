import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StartsGrid from '../components/dashboard/StartsGrid';
import ChartSection from '../components/dashboard/ChartSection';
import TableSection from '../components/dashboard/TableSection';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import DashboardProfile from '../components/dashboard/DashboardProfile';

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="space-y-4 p-4">
            <DashboardProfile />
            <StartsGrid />
            <ChartSection />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                <TableSection />
                <ActivityFeed />
            </div>
        </div>
    );
}

export default Dashboard;