import React from 'react';
import { ArrowUpRight, BarChart3 } from 'lucide-react';

const defaultData = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 46 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 64 },
  { month: 'Jun', value: 82 },
  { month: 'Jul', value: 94 },
];

function SalesChart({ data = defaultData }) {
  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData.map((item) => Number(item.value) || 0), 1);

  return (
    <section className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            Sales overview
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">1,284</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">+12.5% from last month</p>
        </div>
        <button
          type="button"
          aria-label="View sales details"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 flex h-48 items-end gap-2 sm:gap-4" aria-label="Monthly sales chart">
        {chartData.map((item) => {
          const value = Number(item.value) || 0;
          const height = `${Math.max(6, (value / maxValue) * 100)}%`;

          return (
            <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="group relative flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-300 transition-all duration-300 group-hover:from-emerald-600 group-hover:to-teal-400"
                  style={{ height }}
                  title={`${item.month}: ${value} sales`}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SalesChart;
