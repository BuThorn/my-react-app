import React from 'react';
import { CheckCircle2, FileText, MessageCircle, UserPlus } from 'lucide-react';

const activities = [
  { id: 1, icon: UserPlus, title: 'New client added', detail: 'Acme Corporation joined your workspace', time: '12 min ago', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300' },
  { id: 2, icon: CheckCircle2, title: 'Campaign completed', detail: 'Northstar product launch is complete', time: '1 hr ago', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { id: 3, icon: MessageCircle, title: 'New message received', detail: 'Ava replied to the campaign brief', time: '3 hrs ago', color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300' },
  { id: 4, icon: FileText, title: 'Report exported', detail: 'Monthly performance report is ready', time: 'Yesterday', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300' },
];

export default function ActivityFeed() {
  return (
    <section className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activity</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest updates from your workspace.</p>
        </div>
        <button type="button" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View all</button>
      </div>
      <div className="space-y-5">
        {activities.map(({ id, icon: Icon, title, detail, time, color }) => (
          <div key={id} className="flex items-start gap-3">
            <div className={`rounded-lg p-2 ${color}`}><Icon className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1"><p className="font-medium text-slate-800 dark:text-white">{title}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p></div>
            <time className="shrink-0 text-xs text-slate-400">{time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}
