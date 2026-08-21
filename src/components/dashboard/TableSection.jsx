import React from 'react';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

const clients = [
	{ id: 1, name: 'Acme Corporation', contact: 'olivia@acme.com', project: 'Brand Campaign', status: 'Active', value: '$12,400' },
	{ id: 2, name: 'Northstar Labs', contact: 'liam@northstar.com', project: 'Product Launch', status: 'Pending', value: '$8,750' },
	{ id: 3, name: 'Vertex Studio', contact: 'ava@vertex.studio', project: 'Social Strategy', status: 'Active', value: '$6,280' },
	{ id: 4, name: 'Bluebird Health', contact: 'noah@bluebird.health', project: 'Analytics Setup', status: 'Completed', value: '$4,920' },
];

const statusStyles = {
	Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
	Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
	Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

function TableSection() {
	return (
		<section className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
			<div className="mb-5 flex items-center justify-between gap-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Clients</h2>
					<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your latest client projects and revenue.</p>
				</div>
				<button type="button" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30">
					View all <ArrowUpRight className="h-4 w-4" />
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[620px] text-left text-sm">
					<thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
						<tr>
							<th className="pb-3 font-medium">Client</th>
							<th className="pb-3 font-medium">Project</th>
							<th className="pb-3 font-medium">Status</th>
							<th className="pb-3 text-right font-medium">Value</th>
							<th className="pb-3" aria-label="Actions" />
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-700/70">
						{clients.map((client) => (
							<tr key={client.id} className="text-slate-700 dark:text-slate-300">
								<td className="py-4">
									<p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
									<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{client.contact}</p>
								</td>
								<td className="py-4">{client.project}</td>
								<td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[client.status]}`}>{client.status}</span></td>
								<td className="py-4 text-right font-semibold text-slate-900 dark:text-white">{client.value}</td>
								<td className="py-4 text-right"><button type="button" aria-label={`More actions for ${client.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></button></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

export default TableSection;
