import React from 'react';
import { ArrowUpRight, BarChart3, DollarSign } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const revenueData = [38, 48, 43, 62, 57, 74, 86];
const salesData = [28, 42, 35, 51, 47, 63, 72];

function LineChart({ data, color }) {
  const maxValue = Math.max(...data);
  const points = data
    .map((value, index) => `${(index / (data.length - 1)) * 100},${100 - (value / maxValue) * 82}`)
    .join(' ');

  return (
    <div className="mt-6">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full overflow-visible">
        <defs>
          <linearGradient id={`fill-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((line) => (
          <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.35" />
        ))}
        <polyline points={`0,100 ${points} 100,100`} fill={`url(#fill-${color})`} stroke="none" />
        <polyline points={points} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        {data.map((value, index) => (
          <circle key={`${value}-${index}`} cx={(index / (data.length - 1)) * 100} cy={100 - (value / maxValue) * 82} r="1.5" fill={color} stroke="white" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        {months.map((month) => <span key={month}>{month}</span>)}
      </div>
    </div>
  );
}

function ChartCard({ title, value, description, data, color, icon: Icon }) {
  return (
    <article className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Icon className="h-4 w-4" style={{ color }} />
            {title}
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">{description}</p>
        </div>
        <button type="button" aria-label={`View ${title} details`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white">
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>
      <LineChart data={data} color={color} />
    </article>
  );
}

function ChartSection() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2" aria-label="Performance charts">
      <ChartCard title="Revenue" value="$48,290" description="+8.2% from last month" data={revenueData} color="#2563eb" icon={DollarSign} />
      <ChartCard title="Sales" value="1,284" description="+12.5% from last month" data={salesData} color="#10b981" icon={BarChart3} />
    </section>
  );
}

export default ChartSection;
