import React from 'react';
import {
  Search,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';

const customers = [
  {
    id: 1,
    name: 'Acme Corporation',
    email: 'hello@acmecorp.com',
    phone: '+1 (415) 555-0142',
    location: 'San Francisco, CA',
    status: 'Active',
    value: '$24.8K',
    avatar: 'AC',
  },
  {
    id: 2,
    name: 'Northwind Labs',
    email: 'team@northwindlabs.io',
    phone: '+1 (206) 555-0188',
    location: 'Seattle, WA',
    status: 'Pending',
    value: '$12.4K',
    avatar: 'NL',
  },
  {
    id: 3,
    name: 'Bluewave Studio',
    email: 'contact@bluewave.studio',
    phone: '+44 20 7946 0124',
    location: 'London, UK',
    status: 'Active',
    value: '$31.2K',
    avatar: 'BS',
  },
  {
    id: 4,
    name: 'Summit Ventures',
    email: 'partners@summitventures.co',
    phone: '+1 (312) 555-0135',
    location: 'Chicago, IL',
    status: 'VIP',
    value: '$48.7K',
    avatar: 'SV',
  },
];

const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  VIP: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
};

export default function Customers() {
  return (
    <div className="space-y-6 p-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Clients</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Customer Directory</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950/50">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search client"
                className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Clients</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">1,284</h2>
          <p className="mt-2 text-sm text-emerald-600">+12.5% from last month</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Accounts</p>
            <ArrowUpRight className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">842</h2>
          <p className="mt-2 text-sm text-emerald-600">+8.1% this quarter</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Revenue</p>
            <Mail className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">$184K</h2>
          <p className="mt-2 text-sm text-violet-600">Projected growth</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/70">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Client</th>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Contact</th>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Location</th>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Value</th>
                <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Client since 2023</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5" />
                      {customer.location}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{customer.value}</span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label={`More actions for ${customer.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
