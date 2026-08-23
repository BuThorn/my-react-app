import { useMemo } from 'react';
import { FileText, Image, LayoutGrid, Megaphone, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';

const contentSections = {
  'content-overview': {
    title: 'Content Overview',
    description: 'Plan, review, and track your team content in one place.',
    icon: LayoutGrid,
  },
  posts: {
    title: 'Posts',
    description: 'Manage articles, announcements, and scheduled posts.',
    icon: FileText,
  },
  'social-media': {
    title: 'Social Media',
    description: 'Coordinate social campaigns and publishing activity.',
    icon: Megaphone,
  },
  'content-performance': {
    title: 'Content Performance',
    description: 'Review engagement and performance across your content.',
    icon: Image,
  },
};

export default function Content() {
  const { section = 'content-overview' } = useParams();
  const activeSection = useMemo(
    () => contentSections[section] || contentSections['content-overview'],
    [section],
  );
  const Icon = activeSection.icon;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{activeSection.title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activeSection.description}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create content
        </button>
      </div>

      <section className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/60">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Drafts</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/60">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Published</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">48</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/60">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Scheduled</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">8</p>
          </div>
        </div>
      </section>
    </div>
  );
}
