import { useMemo, useState } from 'react';
import { Mail, MessageSquare, Search, Send, User } from 'lucide-react';

const initialConversations = [
	{
		id: 1,
		name: 'Alex Johnson',
		email: 'alex@example.com',
		preview: 'The latest dashboard numbers are ready.',
		time: '09:42',
		unread: 2,
		messages: [
			{ id: 1, author: 'Alex Johnson', text: 'The latest dashboard numbers are ready.', time: '09:42' },
			{ id: 2, author: 'You', text: 'Great, I will review them this morning.', time: '09:47' },
		],
	},
	{
		id: 2,
		name: 'Olivia Martin',
		email: 'olivia@example.com',
		preview: 'Can we move the client call to tomorrow?',
		time: 'Yesterday',
		unread: 0,
		messages: [
			{ id: 3, author: 'Olivia Martin', text: 'Can we move the client call to tomorrow?', time: 'Yesterday' },
		],
	},
	{
		id: 3,
		name: 'Liam Carter',
		email: 'liam@example.com',
		preview: 'I have added the new project notes.',
		time: 'Mon',
		unread: 0,
		messages: [
			{ id: 4, author: 'Liam Carter', text: 'I have added the new project notes.', time: 'Mon' },
		],
	},
];

function Messages() {
	const [conversations, setConversations] = useState(initialConversations);
	const [selectedId, setSelectedId] = useState(initialConversations[0].id);
	const [search, setSearch] = useState('');
	const [reply, setReply] = useState('');

	const filteredConversations = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return conversations;

		return conversations.filter((conversation) => (
			conversation.name.toLowerCase().includes(query)
			|| conversation.preview.toLowerCase().includes(query)
		));
	}, [conversations, search]);

	const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || filteredConversations[0];

	const selectConversation = (conversation) => {
		setSelectedId(conversation.id);
		setConversations((previous) => previous.map((item) => (
			item.id === conversation.id ? { ...item, unread: 0 } : item
		)));
	};

	const sendReply = (event) => {
		event.preventDefault();
		const text = reply.trim();
		if (!text || !selectedConversation) return;

		setConversations((previous) => previous.map((conversation) => (
			conversation.id === selectedConversation.id
				? {
					...conversation,
					preview: text,
					time: 'Now',
					messages: [...conversation.messages, { id: Date.now(), author: 'You', text, time: 'Now' }],
				}
				: conversation
		)));
		setReply('');
	};

	return (
		<main className="space-y-6 p-4">
			<div className="flex items-center gap-3">
				<div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
					<MessageSquare className="h-6 w-6" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
					<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep up with your team conversations.</p>
				</div>
			</div>

			<section className="grid min-h-[520px] overflow-hidden rounded-xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]">
				<div className="border-b border-slate-200/60 dark:border-slate-700/60 lg:border-b-0 lg:border-r">
					<div className="border-b border-slate-200/60 p-4 dark:border-slate-700/60">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages" aria-label="Search messages" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
						</div>
					</div>
					<div className="max-h-[420px] overflow-y-auto p-2">
						{filteredConversations.map((conversation) => (
							<button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className={`mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-950/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200"><User className="h-5 w-5" /></span>
								<span className="min-w-0 flex-1">
									<span className="flex items-center justify-between gap-2"><strong className="truncate text-sm text-slate-900 dark:text-white">{conversation.name}</strong><span className="shrink-0 text-xs text-slate-400">{conversation.time}</span></span>
									<span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{conversation.preview}</span>
								</span>
								{conversation.unread > 0 && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">{conversation.unread}</span>}
							</button>
						))}
					</div>
				</div>

				{selectedConversation ? (
					<div className="flex min-h-[520px] flex-col">
						<header className="border-b border-slate-200/60 p-4 dark:border-slate-700/60"><h2 className="font-semibold text-slate-900 dark:text-white">{selectedConversation.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Mail className="h-3 w-3" />{selectedConversation.email}</p></header>
						<div className="flex-1 space-y-3 overflow-y-auto p-4">
							{selectedConversation.messages.map((message) => <div key={message.id} className={`flex ${message.author === 'You' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${message.author === 'You' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}><p>{message.text}</p><time className={`mt-1 block text-xs ${message.author === 'You' ? 'text-blue-100' : 'text-slate-400'}`}>{message.time}</time></div></div>)}
						</div>
						<form onSubmit={sendReply} className="flex gap-2 border-t border-slate-200/60 p-4 dark:border-slate-700/60"><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." aria-label="Write a reply" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /><button type="submit" aria-label="Send reply" className="rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700"><Send className="h-5 w-5" /></button></form>
					</div>
				) : <div className="flex items-center justify-center p-8 text-sm text-slate-500">No conversations found.</div>}
			</section>
		</main>
	);
}

export default Messages;
