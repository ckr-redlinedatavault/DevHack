"use client";

import { useEffect, useState, useRef, use } from "react";
import { io, Socket } from "socket.io-client";
import {
    MessageSquare,
    Send,
    Plus,
    Settings,
    Zap,
    ArrowRight,
    Loader2,
    Layout,
    CheckSquare,
    Link as LinkIcon,
    FileText,
    Globe,
    Users,
    ClipboardList,
    Wrench,
    Bot,
    Code2,
    GitCommit,
    LogOut,
    Menu,
    Search as SearchIcon,
    Bell,
    Check,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function MessagesPage({ params: paramsPromise }: { params: Promise<{ teamId: string }> }) {
    const params = use(paramsPromise);
    const teamId = params.teamId;

    const [team, setTeam] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Team Data
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`/api/teams/${teamId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeam(data);
                }
            } catch (err) {
                console.error("Failed to fetch team data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeam();
    }, [teamId]);

    // Fetch Initial Messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/workspace/${teamId}/messages`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        };
        fetchMessages();
    }, [teamId]);

    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Socket.io Implementation
    useEffect(() => {
        // Initialize socket
        const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const socketInstance = io(siteOrigin, {
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socketRef.current = socketInstance;

        socketInstance.on("connect", () => {
            console.log("[Socket] Linked to Messaging Engine:", socketInstance.id);
            socketInstance.emit("join-workspace", teamId);
            setIsConnected(true);
        });

        socketInstance.on("receive-message", (data) => {
            console.log("[Socket] Incoming message packet received");
            setMessages((prev) => {
                // Double check for duplicates (IDs are unique from API)
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        socketInstance.on("disconnect", () => {
            console.log("[Socket] Session terminated");
            setIsConnected(false);
        });

        // Ping check to keep alive
        const pingInterval = setInterval(() => {
            if (socketInstance.connected) {
                socketInstance.emit("ping-check");
            }
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            socketInstance.disconnect();
            socketRef.current = null;
        };
    }, [teamId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending || !team) return;

        const content = newMessage.trim();
        setNewMessage("");
        setIsSending(true);

        try {
            // 1. Save to Database via API
            const res = await fetch(`/api/workspace/${teamId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                const sentMsg = await res.json();

                // 2. Local Update (Immediate)
                setMessages(prev => [...prev, sentMsg]);

                // 3. Emit to Team Members via Socket
                if (socketRef.current) {
                    socketRef.current.emit("send-message", {
                        ...sentMsg,
                        teamId // Routing header
                    });
                }
            } else {
                setNewMessage(content); // Restore if failed
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            setNewMessage(content);
        } finally {
            setIsSending(false);
        }
    };

    const copyInvite = () => {
        if (team?.inviteCode) {
            navigator.clipboard.writeText(`${window.location.origin}/join/${team.inviteCode}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading && !team) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!team) return null;

    const MODULES = [
        { id: "overview", label: "Overview", icon: <Layout className="w-4 h-4" />, href: `/workspace/${teamId}` },
        { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-4 h-4" />, href: `/workspace/${teamId}?tab=tasks` },
        { id: "resources", label: "Resources", icon: <LinkIcon className="w-4 h-4" />, href: `/workspace/${teamId}?tab=resources` },
        { id: "notes", label: "Notes", icon: <FileText className="w-4 h-4" />, href: `/workspace/${teamId}?tab=notes` },
        { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4 text-indigo-400" />, href: `/workspace/${teamId}/messages` },
        { id: "submission", label: "Submission", icon: <Globe className="w-4 h-4" />, href: `/workspace/${teamId}?tab=submission` },
        { id: "members", label: "Members", icon: <Users className="w-4 h-4" />, href: `/workspace/${teamId}?tab=members` },
        { id: "problem-statements", label: "Problem Statements", icon: <ClipboardList className="w-4 h-4" />, href: `/workspace/${teamId}?tab=problem-statements` },
        { id: "browse-tools", label: "Browse Tools", icon: <Wrench className="w-4 h-4" />, href: `/workspace/${teamId}?tab=browse-tools` },
        { id: "llm", label: "LLM AI", icon: <Bot className="w-4 h-4" />, href: `/workspace/${teamId}?tab=llm` },
        { id: "code-library", label: "Code Library", icon: <Code2 className="w-4 h-4" />, href: `/workspace/${teamId}?tab=code-library` },
        { id: "push-update", label: "Push Update", icon: <GitCommit className="w-4 h-4 text-emerald-400" />, href: `/workspace/${teamId}?tab=push-update` },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex selection:bg-indigo-500/30 overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Shared Layout Style) */}
            <aside className={`w-72 border-r border-white/5 bg-black flex flex-col fixed inset-y-0 z-[60] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col items-center pt-2 pb-8 px-4 border-b border-white/5">
                        <div className="w-48 h-32 flex items-center justify-center">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="mt-1 text-center w-full">
                            <h1 className="font-bold text-sm text-white uppercase tracking-[0.2em] truncate px-2">
                                {team.name}
                            </h1>
                            <p className="text-[9px] text-indigo-400 font-mono tracking-[0.4em] mt-0.5 opacity-80 uppercase font-black">Workspace</p>
                        </div>
                    </div>

                    <nav className="space-y-1 p-2">
                        {MODULES.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => {
                                    window.location.href = mod.href;
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${mod.id === 'messages'
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/10"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                    }`}
                            >
                                {mod.icon}
                                <span className="text-sm font-semibold">{mod.label}</span>
                                {mod.id === 'messages' && <div className="ml-auto w-1 h-4 bg-white rounded-full" />}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 space-y-4 border-t border-white/5 bg-zinc-950/40">
                    <button onClick={copyInvite} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-all text-left">
                        <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Invite Code</p>
                            <p className="text-xs font-mono text-zinc-300">{team.inviteCode}</p>
                        </div>
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/10 flex items-center justify-center gap-2 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest leading-none">Leave Team</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 lg:ml-72 flex flex-col h-screen bg-[#09090b]">
                {/* Header */}
                <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black sticky top-0 z-40 w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</span>
                            <div className="w-[1px] h-3 bg-zinc-800" />
                            <span className="text-[11px] font-bold text-white uppercase tracking-widest">Team Sync (Realtime)</span>
                        </div>
                    </div>
                </header>

                {/* Messaging Interface */}
                <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-hidden">
                    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-black border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        {/* Chat Header */}
                        <div className="px-8 py-5 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Messaging Engine</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                                        {isConnected ? 'Connected to Workspace Network' : 'Reconnecting to Secure Link...'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {team.members?.slice(0, 3).map((m: any, i: number) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-zinc-900 border border-black flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
                                            {m.user?.name?.[0] || 'U'}
                                        </div>
                                    ))}
                                </div>
                                <div className="h-6 w-px bg-white/5" />
                                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-[linear-gradient(to_bottom,rgba(79,70,229,0.02)_0%,transparent_100%)]"
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto opacity-30">
                                    <div className="w-24 h-24 rounded-full bg-zinc-900/50 border border-white/5 flex items-center justify-center">
                                        <Zap className="w-12 h-12 text-indigo-500/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-semibold text-white">Secure Channel Established</h4>
                                        <p className="text-sm text-zinc-500">Messages are synced across all active team members in realtime.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isOwn = msg.userId === team.currentUserId;

                                    return (
                                        <div key={msg.id || idx} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                            <div className={`flex items-end gap-4 max-w-[85%] sm:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 shadow-lg`}>
                                                    {msg.user?.name?.[0] || 'U'}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className={`flex items-center gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{msg.user?.name}</span>
                                                        <span className="text-[8px] font-bold text-zinc-700 uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className={`px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed tracking-tight ${isOwn
                                                        ? 'bg-[#4f46e5] text-white rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.3)]'
                                                        : 'bg-[#121214] border border-white/5 text-zinc-200 rounded-tl-none'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-xl">
                            <form onSubmit={handleSendMessage} className="relative group">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message to your team..."
                                    className="w-full h-16 bg-[#0c0c0e] border border-white/10 rounded-[1.25rem] pl-8 pr-20 text-sm outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-700 text-white shadow-inner"
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="absolute right-3 top-3 h-10 w-10 bg-white hover:bg-zinc-200 text-black rounded-xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 shadow-xl"
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                            <div className="flex items-center gap-6 mt-6 px-4">
                                <button className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-all group">
                                    <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> Share Project Asset
                                </button>
                                <div className="h-3 w-px bg-zinc-800" />
                                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">End-to-End Encrypted Workspace Channel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
