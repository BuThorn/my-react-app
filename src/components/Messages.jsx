import { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mail, MessageSquare, Search, Send, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Messages() {
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);
    const [search, setSearch] = useState('');
    const [reply, setReply] = useState('');
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const messagesEndRef = useRef(null);

    // ១. ទាញយកបញ្ជីការសន្ទនាទាំងអស់ពី Backend (Conversations List)
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/conversations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversations(response.data);
                
                // បើមានការសន្ទនា ឱ្យវាជ្រើសរើសយក Chat ទីមួយដោយស្វ័យប្រវត្តិ
                if (response.data.length > 0) {
                    setSelectedId(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoadingChats(false);
            }
        };
        fetchConversations();
    }, []);

    // ២. ទាញយកសារលម្អិតនៅពេលដែលប្តូរ ឬជ្រើសរើស Chat (Fetch Messages)
    useEffect(() => {
        if (!selectedId) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/conversations/${selectedId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActiveMessages(response.data);
            } catch (error) {
                console.error("មិនអាចទាញយកសារលម្អិតបានទេ:", error);
            } finally {
                setLoadingMessages(false);
            }
        };


        fetchMessages();
    }, [selectedId]);

    // ៣. អូសចុះក្រោមស្វ័យប្រវត្តិនៅពេលមានសារថ្មី (Auto-scroll to bottom)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);

    // ៤. Logic សម្រាប់ចម្រោះស្វែងរកឈ្មោះ ឬសារ Preview
    const filteredConversations = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return conversations;

        return conversations.filter((conversation) => (
            conversation.name.toLowerCase().includes(query) ||
            (conversation.preview && conversation.preview.toLowerCase().includes(query))

        ));
    }, [conversations, search]);

    // ស្វែងរក Object នៃ Chat ដែលកំពុងជ្រើសរើស
    const selectedConversation = conversations.find((c) => c.id === selectedId);

    // ៥. មុខងារនៅពេលចុចជ្រើសរើស Chat (ប្តូរ ID និងលុបចំនួន Unread ទៅជា 0)
    const selectConversation = async (conversation) => {
        setSelectedId(conversation.id);

        // បើមានសារមិនទាន់អាន ត្រូវ Update ទៅ Backend ឱ្យទៅជា 0
        if (conversation.unread > 0) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${API_BASE_URL}/api/conversations/${conversation.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                }); 
            } catch (error) {
                console.error("Error marking conversation as read:", error);
            }
        } 
    };

    // ៦. មុខងារផ្ញើសារថ្មីទៅកាន់ Backend (Send Message)
    const sendReply = async (event) => {
        event.preventDefault();
        const text = reply.trim();
        if (!text || !selectedId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/api/conversations/${selectedId}/messages`,
                 { text }, 
                 { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const { author, time } = response.data;
                const newMessage = { id: Date.now(), conversation_id: selectedId, author, text, time };

                // ក. បន្ថែមសារថ្មីចូលក្នុងប្រអប់ Chat ភ្លាមៗ
                setActiveMessages((prev) => [...prev, newMessage]);

                // ខ. ធ្វើបច្ចុប្បន្នភាពអក្សរលម្អិត Preview នៅ Sidebar ខាងឆ្វេង
                setConversations((prev) => prev.map((conversation) => (
                    conversation.id === selectedId
                        ? { ...conversation, preview: text, time, unread: 0 }
                        : conversation
                )));

                setReply(''); // លុបអត្ថបទនៅក្នុងប្រអប់ Reply
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

	return (
        <main className="space-y-6 p-4">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
                    <p className="mt-1 text-sm text-slate-50 dark:text-slate-400">Keep up with your team conversations.</p>
                </div>
            </div>
            <section className="grid min-h-[520px] overflow-hidden rounded-xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]">
                  {/* Sidebar បញ្ជីឈ្មោះ Chat */}
                  <div className="border-b border-slate-200/60 dark:border-slate-700/60 lg:border-b-0 lg:border-r">
                       <div className="border-b border-slate-200/60 p-4 dark:border-slate-700/60">
                            <div className="relative">
                                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400'/>
                                <input type='search' value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-lg border border-slate-300/60 bg-slate-100/60 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-400"/>
                            </div>
                       </div>
                       <div className="max-h-[420px] overflow-auto p-2">
                            {loadingChats ? (
                                <div className="p-4 text-center text-sm text-slate-400">កំពុងទាញយកទិន្នន័យ...</div>
                            ) : filteredConversations.map((conversation) => (
                                <button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${selectedId === conversation.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200"><User className="h-5 w-5"/></span>
                                    <span className="min-w-0 flex-1">
                                                <span className="flex items-center justify-between gap-2">
                                                    <strong className="truncate text-sm text-slate-900 dark:text-white">{conversation.name}</strong>
                                                    <span className="shrink-0 text-xs text-slate-400">{conversation.time}</span>
                                                    </span>
                                                <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{conversation.preview || 'គ្មានសារសន្ទនា' }</span>
                                    </span>
                                    {conversation.unread > 0 && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">{conversation.unread}</span>}
                                </button>
                            ))}
                            {!loadingChats && filteredConversations.length === 0 && (
                                <div className="p-4 text-center text-sm text-slate-400">រកមិនឃើញគណនីសន្ទនាទេ។</div>
                            )}
                       </div>
                  </div>

                    {/* ប្រអប់បង្ហាញសារលម្អិត (Chat Pane) */}
                     {selectedConversation ? (
                    <div className="flex min-h-[520px] flex-col">
                        <header className="border-b border-slate-200/60 p-4 dark:border-slate-700/60"><h2 className="font-semibold text-slate-900 dark:text-white">{selectedConversation.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Mail className="h-3 w-3" />{selectedConversation.email}</p></header>
                        
                        <div className="flex-1 space-y-3 overflow-y-auto p-4">
                            {loadingMessages ? (
                                <div className="text-center text-xs text-slate-400 pt-4">កំពុងផ្ទុកសារ...</div>
                            ) : (
                                activeMessages.map((message) => (
                                    <div key={message.id} className={`flex ${message.author === 'You' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${message.author === 'You' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>
                                            <p>{message.text}</p>
                                            <time className={`mt-1 block text-xs ${message.author === 'You' ? 'text-blue-100' : 'text-slate-400'}`}>{message.time}</time>
                                        </div>
                                    </div>
                                ))
                            )}
                            {/* Element ជំនួយសម្រាប់ Auto-scroll */}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendReply} className="flex gap-2 border-t border-slate-200/60 p-4 dark:border-slate-700/60">
                            <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                            <button type="submit" className="rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700"><Send className="h-5 w-5" /></button>
                        </form>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-8 text-sm text-slate-500 m-auto">សូមជ្រើសរើសការសន្ទនាមួយដើម្បីមើលសារ។</div>
                )}
            </section>
        </main>
		 
	);
}

export default Messages;
