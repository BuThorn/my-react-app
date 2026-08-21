import React, { useMemo, useState } from 'react';
import { Mail, MoreHorizontal, Plus, Search, Users as UsersIcon } from 'lucide-react';

const initialUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Administrator', status: 'Active', joined: 'Jan 12, 2026' },
    { id: 2, name: 'Olivia Martin', email: 'olivia@example.com', role: 'Manager', status: 'Active', joined: 'Feb 04, 2026' },
    { id: 3, name: 'Liam Carter', email: 'liam@example.com', role: 'Editor', status: 'Pending', joined: 'Mar 18, 2026' },
    { id: 4, name: 'Ava Wilson', email: 'ava@example.com', role: 'Analyst', status: 'Inactive', joined: 'Apr 02, 2026' },
];

const statusStyles = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    Inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

function Users() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return initialUsers.filter((user) => {
            const matchesSearch = !query || [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(query));
            const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <main className="space-y-6 p-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage team members and access roles.</p>
                        </div>
                    </div>
                </div>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4" />
                    Add user
                </button>
            </div>

            <section className="rounded-xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search users..."
                            aria-label="Search users"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        aria-label="Filter users by status"
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                        <option>All</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Inactive</option>
                    </select>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            <tr>
                                <th className="pb-3 font-medium">User</th>
                                <th className="pb-3 font-medium">Role</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Joined</th>
                                <th className="pb-3 text-right" aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/70">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="text-slate-700 dark:text-slate-300">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">{user.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Mail className="h-3 w-3" />{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">{user.role}</td>
                                    <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[user.status]}`}>{user.status}</span></td>
                                    <td className="py-4">{user.joined}</td>
                                    <td className="py-4 text-right"><button type="button" aria-label={`More actions for ${user.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">No users match your filters.</p>}
                </div>
            </section>
        </main>
    );
}

export default Users;
