import React from 'react'

function RevenueChart() {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-bl-2xl border 
    border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold text-slate-800 dark:text-white">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Revenue Chart
            </h2>
            <p className="text-sm text-slate-400">Monthly revenue and expenses overview</p>

        </div>
      </div>
    </div>
  )
}

export default RevenueChart;
