
import { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Mail, MessageSquare, Paperclip, Phone, Search, Send, Smile, User, X, CheckCheck, Pencil, Trash2, Copy, Reply } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Chats() {
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);
    const [search, setSearch] = useState('');
    const [reply, setReply] = useState('');
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [replyTo, setReplyTo] = useState(null);

    // ទទួលបាន Username បច្ចុប្បន្ន
    const currentUsername = localStorage.getItem('username') || 'You';
    const messagesEndRef = useRef(null);

    // 1. Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/chats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversations(response.data);
                
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

    // 2. Socket & Messages Sync
    useEffect(() => {
        if (!selectedId) return;

        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        const conversationKey = String(selectedId);
        let isFetchingMessages = true;
        const pendingMessages = [];

        socket.on('connect', () => {
            socket.emit('join_room', conversationKey);
        });

        socket.on('receive_message', (message) => {
            if (String(message.conversation_id) !== conversationKey) return;

            if (isFetchingMessages) {
                pendingMessages.push(message);
                return;
            }

            setActiveMessages((previous) => (
                previous.some((item) => item.id === message.id)
                    ? previous
                    : [...previous, message]
            ));
        });

        socket.on('update_sidebar', ({ conversationId, text, time }) => {
            setConversations((previous) => previous.map((conversation) => (
                String(conversation.id) === String(conversationId)
                    ? { ...conversation, preview: text, time }
                    : conversation
            )));
        });

        socket.on('message_updated', (message) => {
            if (String(message.conversation_id) !== conversationKey) return;
            setActiveMessages((previous) => previous.map((item) => item.id === message.id ? message : item));
        });

        socket.on('message_deleted', (message) => {
            if (String(message.conversation_id) !== conversationKey) return;
            setActiveMessages((previous) => previous.map((item) => item.id === message.id ? { ...item, ...message } : item));
        });

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/chats/${selectedId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActiveMessages(() => {
                    const messages = [...response.data, ...pendingMessages];
                    return messages.filter((message, index, allMessages) => (
                        allMessages.findIndex((item) => item.id === message.id) === index
                    ));
                });
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                isFetchingMessages = false;
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        return () => {
            socket.off('receive_message');
            socket.off('update_sidebar');
            socket.off('message_updated');
            socket.off('message_deleted');
            socket.disconnect();
        };
    }, [selectedId]);

    // 3. Auto Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);

    // 4. Search Filter
    const filteredConversations = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return conversations;

        return conversations.filter((conversation) => (
            conversation.name?.toLowerCase().includes(query) ||
            (conversation.preview && conversation.preview.toLowerCase().includes(query))
        ));
    }, [conversations, search]);

    const selectedConversation = conversations.find((c) => c.id === selectedId);
    const customerProfile = selectedConversation && {
        avatar: selectedConversation.avatar,
        phone: selectedConversation.phone || 'Not provided',
        email: selectedConversation.email || 'Not provided',
        customerId: selectedConversation.customer_id || `CUS-${String(selectedConversation.id).padStart(3, '0')}`,
        status: selectedConversation.status || 'Active',
    };

    // 5. Select Conversation & Mark as Read
    const selectConversation = async (conversation) => {
        setSelectedId(conversation.id);

        if (conversation.unread > 0) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${API_BASE_URL}/api/chats/${conversation.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setConversations((prev) => prev.map((item) => 
                    item.id === conversation.id ? { ...item, unread: 0 } : item
                ));
            } catch (error) {
                console.error("Error marking conversation as read:", error);
            }
        } 
    };

    // 6. Send Reply
    const sendReply = async (event) => {
        event.preventDefault();
        const text = reply.trim();
        if ((!text && !attachment) || !selectedId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE_URL}/api/chats/${selectedId}/messages`,
                {
                    text,
                    attachment_name: attachment?.name || '',
                    attachment_data: attachment?.data || '',
                    reply_to_id: replyTo?.id || null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setReply('');
                setAttachment(null);
                setReplyTo(null);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 3.75 * 1024 * 1024) {
            console.error('Attachment must be smaller than 3.75MB');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setAttachment({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const editMessage = async (message) => {
        const text = window.prompt('Edit message', message.text);
        if (text === null || !text.trim()) return;
        try {
            await axios.put(`${API_BASE_URL}/api/chats/${selectedId}/messages/${message.id}`, { text: text.trim() }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const deleteMessage = async (message) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/chats/${selectedId}/messages/${message.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const copyMessage = async (message) => {
        try {
            await navigator.clipboard.writeText(message.text || message.attachment_name || '');
        } catch (error) {
            console.error('Error copying message:', error);
        }
    };

    const appendEmoji = (emoji) => {
        setReply((previous) => `${previous}${emoji}`);
        setEmojiOpen(false);
    };

    const emojis = ['😀', '😂', '😍', '👍', '🎉', '🙏', '🔥', '❤️', '✅', '😢', '😮', '🚀'];

    return (
        <main className="space-y-6 p-4">
            {/* Header section (កែសម្រួលពណ៌អក្សរ Subtitle) */}
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Keep up with your team conversations.</p>
                </div>
            </div>

            {/* Main Layout */}
            <section className="grid min-h-[560px] overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_minmax(0,1fr)_260px]">
                
                {/* Sidebar */}
                <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-700/60 lg:border-b-0 lg:border-r">
                    <div className="border-b border-slate-200/60 p-3.5 dark:border-slate-700/60">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="search" 
                                value={search} 
                                onChange={(event) => setSearch(event.target.value)} 
                                placeholder="Search..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="max-h-[480px] flex-1 overflow-y-auto p-2">
                        {loadingChats ? (
                            <div className="p-4 text-center text-sm text-slate-400">កំពុងទាញយកទិន្នន័យ...</div>
                        ) : filteredConversations.map((conversation) => (
                            <button 
                                key={conversation.id} 
                                type="button" 
                                onClick={() => selectConversation(conversation)} 
                                className={`group mb-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${selectedId === conversation.id ? 'bg-blue-50/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-700/50'}`}
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                    <User className="h-5 w-5"/>
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center justify-between gap-2">
                                        <strong className="truncate text-sm font-medium text-slate-900 dark:text-white">{conversation.name}</strong>
                                        <span className="shrink-0 text-[11px] text-slate-400">{conversation.time}</span>
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{conversation.preview || 'គ្មានសារសន្ទនា'}</span>
                                </span>
                                {conversation.unread > 0 && (
                                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">{conversation.unread}</span>
                                )}
                            </button>
                        ))}
                        {!loadingChats && filteredConversations.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-400">រកមិនឃើញគណនីសន្ទនាទេ។</div>
                        )}
                    </div>
                </div>

                {/* Chat Pane */}
                {selectedConversation ? (
                    <div className="flex h-full flex-col">
                        <header className="flex items-center justify-between border-b border-slate-200/60 p-4 dark:border-slate-700/60">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">{selectedConversation.name}</h2>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Mail className="h-3 w-3" />{selectedConversation.email || 'N/A'}
                                </p>
                            </div>
                        </header>
                        
                        {/* Messages Body */}
                        <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[420px]">
                            {loadingMessages ? (
                                <div className="pt-4 text-center text-xs text-slate-400">កំពុងផ្ទុកសារ...</div>
                            ) : (
                                activeMessages.map((message) => {
                                    const isMe = message.author === currentUsername || message.author === 'You';
                                    return (
                                        <div key={message.id} className={`group flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100 rounded-bl-sm'}`}>
                                                {message.reply_to_id && (
                                                    <div className="mb-2 border-l-2 border-current/40 pl-2 text-xs opacity-75">Replying to message #{message.reply_to_id}</div>
                                                )}
                                                {message.deleted_at ? (
                                                    <p className="italic opacity-70">Message deleted</p>
                                                ) : (
                                                    <>
                                                        <p className="leading-relaxed">{message.text}</p>
                                                        {message.attachment_data && (
                                                            message.attachment_data.startsWith('data:image/') ? (
                                                                <img src={message.attachment_data} alt={message.attachment_name || 'Attachment'} className="mt-2 max-h-48 rounded-lg object-cover" />
                                                            ) : (
                                                                <a href={message.attachment_data} download={message.attachment_name} className="mt-2 block truncate underline">{message.attachment_name || 'Download attachment'}</a>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                                <time className={`mt-1 block text-[10px] text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {message.author} · {message.time}{message.edited_at ? ' · edited' : ''} {isMe && <CheckCheck className="ml-1 inline h-3 w-3" aria-label={message.read_at ? 'Seen' : 'Sent'} />}
                                                </time>
                                            </div>
                                            <div className={`invisible flex items-center gap-1 self-center px-2 group-hover:visible ${isMe ? 'order-first' : ''}`}>
                                                <button type="button" onClick={() => setReplyTo(message)} title="Reply" className="rounded p-1 text-slate-400 hover:text-blue-600"><Reply className="h-3.5 w-3.5" /></button>
                                                <button type="button" onClick={() => copyMessage(message)} title="Copy" className="rounded p-1 text-slate-400 hover:text-blue-600"><Copy className="h-3.5 w-3.5" /></button>
                                                {isMe && !message.deleted_at && <button type="button" onClick={() => editMessage(message)} title="Edit" className="rounded p-1 text-slate-400 hover:text-blue-600"><Pencil className="h-3.5 w-3.5" /></button>}
                                                {isMe && !message.deleted_at && <button type="button" onClick={() => deleteMessage(message)} title="Delete" className="rounded p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Form */}
                        {replyTo && <div className="flex items-center justify-between border-t border-slate-200/60 px-3.5 py-2 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400">Replying to {replyTo.author}: {replyTo.text || replyTo.attachment_name}<button type="button" onClick={() => setReplyTo(null)} title="Cancel reply"><X className="h-4 w-4" /></button></div>}
                        {attachment && <div className="flex items-center justify-between border-t border-slate-200/60 px-3.5 py-2 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400">{attachment.name}<button type="button" onClick={() => setAttachment(null)} title="Remove attachment"><X className="h-4 w-4" /></button></div>}
                        <form onSubmit={sendReply} className="relative mt-auto flex gap-2 border-t border-slate-200/60 p-3.5 dark:border-slate-700/60">
                            <div className="relative">
                                <button type="button" onClick={() => setEmojiOpen((previous) => !previous)} title="Add emoji" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><Smile className="h-5 w-5" /></button>
                                {emojiOpen && <div className="absolute bottom-12 left-0 grid w-48 grid-cols-6 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">{emojis.map((emoji) => <button key={emoji} type="button" onClick={() => appendEmoji(emoji)} className="rounded p-1 text-lg hover:bg-slate-100 dark:hover:bg-slate-700">{emoji}</button>)}</div>}
                            </div>
                            <label title="Attach file" className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><Paperclip className="h-5 w-5" /><input type="file" onChange={handleFileChange} className="hidden" /></label>
                            <input 
                                value={reply} 
                                onChange={(event) => setReply(event.target.value)} 
                                placeholder="Write a reply..." 
                                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" 
                            />
                            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-sm text-slate-400">
                        <MessageSquare className="mb-2 h-10 w-10 text-slate-300 dark:text-slate-600" />
                        សូមជ្រើសរើសការសន្ទនាមួយដើម្បីមើលសារ។
                    </div>
                )}

                {customerProfile && (
                    <aside className="border-t border-slate-200/60 bg-slate-50/60 p-5 dark:border-slate-700/60 dark:bg-slate-900/30 xl:border-l xl:border-t-0">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Customer profile</h3>
                        <div className="mt-5 flex flex-col items-center text-center">
                            {customerProfile.avatar ? (
                                <img src={customerProfile.avatar} alt={selectedConversation.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-800" />
                            ) : (
                                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700 ring-4 ring-white dark:bg-blue-900/40 dark:text-blue-300 dark:ring-slate-800">
                                    <User className="h-9 w-9" />
                                </span>
                            )}
                            <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{selectedConversation.name}</h4>
                            <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                {customerProfile.status}
                            </span>
                        </div>

                        <dl className="mt-6 space-y-4 text-sm">
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Customer ID</dt>
                                <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{customerProfile.customerId}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Phone number</dt>
                                <dd className="mt-1 flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200"><Phone className="h-4 w-4 text-slate-400" />{customerProfile.phone}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500 dark:text-slate-400">Email</dt>
                                <dd className="mt-1 break-words font-medium text-slate-800 dark:text-slate-200">{customerProfile.email}</dd>
                            </div>
                        </dl>
                    </aside>
                )}
            </section>
        </main>
    );
}

export default Chats;