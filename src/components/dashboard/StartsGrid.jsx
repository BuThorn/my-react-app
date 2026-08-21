import React from 'react';
import { ArrowRight, BarChart3, DollarSign, Target, Users } from 'lucide-react';

const defaultStats = [
    { id: 'clients', label: 'Total Clients', value: '21,008', change: '+12.5%', progress: 78, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'revenue', label: 'Revenue', value: '$78,290', change: '+8.2%', progress: 64, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { id: 'campaigns', label: 'Active Campaigns', value: '18', change: '+4.6%', progress: 52, icon: Target, color: 'from-orange-500 to-amber-500' },
    { id: 'conversion', label: 'Conversion Rate', value: '24.8%', change: '+3.1%', progress: 83, icon: BarChart3, color: 'from-violet-500 to-fuchsia-500' },
];

function StartsGrid({ items = defaultStats }) {
    const stats = Array.isArray(items) && items.length > 0 ? items : defaultStats;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.filter(Boolean).map((stat, index) => {
                const Icon = stat.icon;
                const progress = Math.min(100, Math.max(0, Number(stat.progress) || 0));
                const statId = stat.id ?? stat.label ?? `stat-${index}`;
                const color = stat.color || 'from-slate-500 to-slate-600';

                return (
                    <article
                        key={statId}
                        className="group rounded-xl border border-slate-200/50 bg-white/80 p-9 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/10 dark:border-slate-700/50 dark:bg-slate-700/50 dark:hover:shadow-slate-900/10"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {stat.label || 'Statistic'}
                                </p>
                                <p className="mb-4 text-3xl font-bold text-slate-800 dark:text-white">
                                    {stat.value ?? '0'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {stat.change || 'No change'} vs last period
                                    </span>
                                </div>
                            </div>
                            {Icon && (
                                <div className={`rounded-xl bg-gradient-to-r p-3 text-white transition-transform duration-200 group-hover:scale-110 ${color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        <div className="mt-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className={`h-2 rounded-full bg-gradient-to-r transition-all duration-500 ${color}`}
                                style={{ width: `${progress}%` }}
                                role="progressbar"
                                aria-label={`${stat.label || 'Statistic'} progress`}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-valuenow={progress}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export default StartsGrid;