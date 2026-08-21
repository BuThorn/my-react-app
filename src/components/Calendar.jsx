import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const initialEvents = [
    { id: 1, title: 'Team stand-up', time: '09:00', type: 'Work' },
    { id: 2, title: 'Client presentation', time: '11:30', type: 'Meeting' },
    { id: 3, title: 'Review project updates', time: '15:00', type: 'Task' },
];

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function Calendar() {
    const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
    const [events, setEvents] = useState(initialEvents);

    const weekDays = useMemo(() => {
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay());

        return Array.from({ length: 7 }, (_, index) => {
            const day = new Date(start);
            day.setDate(start.getDate() + index);
            return day;
        });
    }, [selectedDate]);

    const moveWeek = (offset) => {
        setSelectedDate((previous) => {
            const next = new Date(previous);
            next.setDate(next.getDate() + offset * 7);
            return next;
        });
    };

    const isSameDay = (first, second) => startOfDay(first).getTime() === startOfDay(second).getTime();

    const addEvent = () => {
        const title = window.prompt('Event name');
        if (!title?.trim()) return;

        setEvents((previous) => [
            ...previous,
            { id: Date.now(), title: title.trim(), time: 'All day', type: 'Personal' },
        ]);
    };

    return (
        <main className="space-y-6 p-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Plan and review your daily schedule.</p>
                    </div>
                </div>
                <button type="button" onClick={addEvent} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4" />
                    Add event
                </button>
            </div>

            <section className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{monthFormatter.format(selectedDate)}</h2>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveWeek(-1)} aria-label="Previous week" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"><ChevronLeft className="h-5 w-5" /></button>
                        <button type="button" onClick={() => setSelectedDate(startOfDay(new Date()))} className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30">Today</button>
                        <button type="button" onClick={() => moveWeek(1)} aria-label="Next week" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                        const selected = isSameDay(day, selectedDate);
                        return (
                            <button key={day.toISOString()} type="button" onClick={() => setSelectedDate(startOfDay(day))} className={`min-w-0 rounded-lg p-2 text-center transition ${selected ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                                <span className="block text-xs font-medium">{weekdayFormatter.format(day)}</span>
                                <span className="mt-1 block text-lg font-semibold">{day.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Schedule</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{dateFormatter.format(selectedDate)}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{events.length} events</span>
                </div>
                <div className="mt-4 space-y-3">
                    {events.map((event) => (
                        <div key={event.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.type}</p>
                            </div>
                            <time className="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">{event.time}</time>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Calendar;
