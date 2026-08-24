import React from 'react';
import { useParams } from 'react-router-dom';

const sectionConfig = {
  overview: { label: 'Overview', description: 'High-level performance across your digital channels.' },
  posts: { label: 'Posts', description: 'Track publishing activity and engagement for your latest content.' },
  'social-media': { label: 'Social Media', description: 'Monitor campaign reach, referrals, and social performance.' },
  'content-performance': { label: 'Content Performance', description: 'Review impressions, clicks, and conversion quality across content.' },
};

function Content() {
  const { section } = useParams();
  const activeSection = section && sectionConfig[section] ? section : 'overview';
  const details = sectionConfig[activeSection];

  return (
    <div className="space-y-6 p-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Content</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{details.label}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{details.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Impressions', value: '24.8K' },
          { label: 'Clicks', value: '3.6K' },
          { label: 'Conversion', value: '8.4%' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li>• Campaign report updated 2 hours ago.</li>
          <li>• New social post published to the main product feed.</li>
          <li>• Audience retention improved by 12% this week.</li>
        </ul>
      </div>
    </div>
  );
}

export default Content;
