"use client";

import { useEffect, useState, use } from "react";
import {
    Layout,
    CheckSquare,
    Link as LinkIcon,
    FileText,
    Globe,
    Users,
    Settings,
    Plus,
    MoreVertical,
    Github,
    Figma,
    ExternalLink,
    ChevronRight,
    ClipboardList,
    MessageSquare,
    Search,
    Bell,
    Search as SearchIcon,
    Copy,
    Check,
    Zap,
    Trash2,
    Calendar,
    Clock,
    Rocket,
    Loader2,
    ArrowRight,
    Save,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

const MODULES = [
    { id: "overview", label: "Overview", icon: <Layout className="w-4 h-4" /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "resources", label: "Resources", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "notes", label: "Notes", icon: <FileText className="w-4 h-4" /> },
    { id: "submission", label: "Submission", icon: <Globe className="w-4 h-4" /> },
    { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
];

export default function WorkspacePage({ params: paramsPromise }: { params: Promise<{ teamId: string }> }) {
    const params = use(paramsPromise);
    const teamId = params.teamId;

    const [team, setTeam] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModule, setActiveModule] = useState("overview");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`/api/teams/${teamId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeam(data);
                } else {
                    const err = await res.json().catch(() => ({}));
                    console.error("Team fetch failed:", res.status, err.message);
                }
            } catch (err) {
                console.error("Failed to fetch team data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeam();
    }, [teamId]);

    const copyInvite = () => {
        if (team?.inviteCode) {
            navigator.clipboard.writeText(`${window.location.origin}/join/${team.inviteCode}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
                    <span className="text-rose-400 text-2xl">✕</span>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Team not found</h2>
                    <p className="text-zinc-500 text-sm">This team doesn't exist or you are not a member.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="border-zinc-800 rounded-xl"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#09090b] text-white flex selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black flex flex-col fixed inset-y-0 z-50 transition-all">
                <div className="p-6">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">D</div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate uppercase tracking-tight">{team.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate font-mono tracking-widest">v1.0.0</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {MODULES.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeModule === mod.id
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/10"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                    }`}
                            >
                                {mod.icon}
                                <span className="text-sm font-semibold">{mod.label}</span>
                                {activeModule === mod.id && <div className="ml-auto w-1 h-4 bg-white rounded-full" />}
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
                    <button className="flex items-center gap-3 px-4 py-2 w-full text-zinc-500 hover:text-rose-400 text-sm transition-colors">
                        <Trash2 className="w-4 h-4" /> Leave Team
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 ml-64 min-h-screen bg-[#09090b]">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-sm font-medium">Workspace</span>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                        <span className="text-white text-sm font-bold uppercase tracking-widest">{activeModule}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                            <Input className="w-64 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 pl-10 h-9 rounded-full text-xs" placeholder="Search team assets..." />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative text-zinc-400 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-[10px]">JD</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Modules */}
                <div className="p-8">
                    {activeModule === "overview" && <OverviewModule team={team} setActiveModule={setActiveModule} />}
                    {activeModule === "tasks" && <TasksModule teamId={teamId} initialTasks={team.tasks || []} />}
                    {activeModule === "resources" && <ResourcesModule teamId={teamId} initialResources={team.resources || []} />}
                    {activeModule === "notes" && <NotesModule teamId={teamId} initialNotes={team.notes || []} />}
                    {activeModule === "submission" && <SubmissionModule teamId={teamId} initialSubmission={team.submission} />}
                    {activeModule === "members" && <MembersModule team={team} copyInvite={copyInvite} copied={copied} />}

                </div>
            </main>
        </div>
    );
}

/* Modules */

function OverviewModule({ team, setActiveModule }: { team: any, setActiveModule: (m: string) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight">{team.projectName}</h2>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
                            {team.description || "No description provided."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="cursor-pointer" onClick={() => setActiveModule("submission")}>
                            <StatsCard icon={<Zap className="w-5 h-5 text-amber-400" />} label="Hackathon" value={team.hackathonName} />
                        </div>
                        <div className="cursor-pointer" onClick={() => setActiveModule("tasks")}>
                            <StatsCard icon={<Clock className="w-5 h-5 text-emerald-400" />} label="Status" value="Planning Phase" />
                        </div>
                    </div>

                    <Card className="bg-zinc-900/30 border-zinc-800/50 cursor-pointer hover:bg-zinc-900/50 transition-all group" onClick={() => setActiveModule("tasks")}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">Project Progress</CardTitle>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono uppercase">
                                    <span className="text-zinc-500">Tasks Complete</span>
                                    <span className="text-emerald-400">{Math.round((team.tasks?.filter((t: any) => t.status === "DONE").length || 0) / (team.tasks?.length || 1) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000"
                                        style={{ width: `${Math.round((team.tasks?.filter((t: any) => t.status === "DONE").length || 0) / (team.tasks?.length || 1) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-600/5 border-indigo-600/20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-600/5 cursor-pointer hover:bg-indigo-600/10 transition-all group" onClick={() => setActiveModule("members")}>
                        <CardHeader className="bg-indigo-600/10 p-6 border-b border-indigo-600/10 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-400 uppercase tracking-widest">Team Stats</CardTitle>
                            <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{team._count?.members || 1} Members</p>
                                    <p className="text-zinc-500 text-xs mt-0.5">Capacity: {team.teamSize} members</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


function TasksModule({ teamId, initialTasks }: { teamId: string, initialTasks: any[] }) {
    const columns = ["Backlog", "To Do", "In Progress", "Done"];
    const [tasks, setTasks] = useState(initialTasks);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        setIsAdding(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTaskTitle, status: "BACKLOG" })
            });
            if (res.ok) {
                const newTask = await res.json();
                setTasks(prev => [...prev, newTask]);
                setNewTaskTitle("");
            }
        } finally {
            setIsAdding(false);
        }
    };

    const updateTaskStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/tasks`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/tasks`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setTasks(prev => prev.filter(t => t.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kanban Board</h2>
                <form onSubmit={addTask} className="flex gap-2 w-full max-w-sm">
                    <Input
                        placeholder="New task..."
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 rounded-xl"
                    />
                    <Button disabled={isAdding || !newTaskTitle} type="submit" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2">
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {columns.map(col => {
                    const statusKey = col === "To Do" ? "todo" : col.toLowerCase().replace(" ", "_");
                    const colTasks = tasks?.filter(t => t.status?.toLowerCase() === statusKey);

                    let colorTheme = {
                        bg: "bg-zinc-900/30",
                        border: "border-zinc-800/50",
                        hoverBorder: "hover:border-zinc-700",
                        dot: "bg-zinc-500",
                        text: "text-zinc-200"
                    };

                    if (statusKey === "todo") {
                        colorTheme = {
                            bg: "bg-amber-500/5",
                            border: "border-amber-500/10",
                            hoverBorder: "hover:border-amber-500/30",
                            dot: "bg-amber-400",
                            text: "text-amber-100"
                        };
                    } else if (statusKey === "in_progress") {
                        colorTheme = {
                            bg: "bg-indigo-500/5",
                            border: "border-indigo-500/10",
                            hoverBorder: "hover:border-indigo-500/30",
                            dot: "bg-indigo-400",
                            text: "text-indigo-100"
                        };
                    } else if (statusKey === "done") {
                        colorTheme = {
                            bg: "bg-emerald-500/5",
                            border: "border-emerald-500/10",
                            hoverBorder: "hover:border-emerald-500/30",
                            dot: "bg-emerald-400",
                            text: "text-emerald-100"
                        };
                    }

                    return (
                        <div key={col} className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${colorTheme.dot}`} />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{col}</h3>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                                    {colTasks?.length || 0}
                                </span>
                            </div>

                            <div className="space-y-3 min-h-[500px] border border-white/5 rounded-3xl p-3 bg-white/[0.01]">
                                {colTasks?.map((task) => (
                                    <div key={task.id} className={`p-5 rounded-2xl ${colorTheme.bg} border ${colorTheme.border} ${colorTheme.hoverBorder} transition-all duration-300 group`}>
                                        <p className={`text-sm font-medium leading-relaxed ${colorTheme.text}`}>{task.title}</p>

                                        <div className="flex items-center justify-between mt-6">
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                className="bg-black/30 border border-white/5 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-lg text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hover:bg-black/50 hover:text-white transition-colors"
                                            >
                                                <option value="BACKLOG">Backlog</option>
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </select>

                                            <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-rose-500/10 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!colTasks || colTasks.length === 0) && (
                                    <div className="h-28 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800/50 rounded-2xl">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-50">Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}


function ResourcesModule({ teamId, initialResources }: { teamId: string, initialResources: any[] }) {
    const [resources, setResources] = useState(initialResources);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const addResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;
        setIsAdding(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/resources`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, url: newUrl })
            });
            if (res.ok) {
                const newRes = await res.json();
                setResources(prev => [...prev, newRes]);
                setNewTitle("");
                setNewUrl("");
            }
        } finally {
            setIsAdding(false);
        }
    };

    const deleteResource = async (id: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/resources`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setResources(prev => prev.filter(r => r.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Team Resources</h2>
                    <p className="text-zinc-500 text-sm mt-1">Important links, repos, and design files.</p>
                </div>
                <form onSubmit={addResource} className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
                    <Input
                        placeholder="Title (e.g., GitHub)"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="bg-[#18181b] border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 rounded-lg text-sm h-10 transition-all placeholder:text-zinc-600"
                    />
                    <Input
                        placeholder="https://..."
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        className="bg-[#18181b] border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 rounded-lg text-sm h-10 transition-all placeholder:text-zinc-600"
                    />
                    <Button disabled={isAdding || !newTitle || !newUrl} type="submit" className="bg-white text-black hover:bg-zinc-200 rounded-lg whitespace-nowrap px-6 h-10 font-medium transition-all shadow-none">
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Link"}
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources?.map((res) => {
                    const colors = [
                        { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-500", hoverBg: "group-hover:bg-emerald-500/20" },
                        { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-500", hoverBg: "group-hover:bg-violet-500/20" },
                        { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-500", hoverBg: "group-hover:bg-amber-500/20" },
                        { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-500", hoverBg: "group-hover:bg-cyan-500/20" },
                        { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-500", hoverBg: "group-hover:bg-rose-500/20" },
                        { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-500", hoverBg: "group-hover:bg-sky-500/20" },
                    ];
                    // Deterministic color assignment based on title string
                    const colorIndex = [...res.title].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
                    const theme = colors[colorIndex];

                    return (
                        <div key={res.id} className="bg-[#121214] border border-[#27272a] hover:border-[#3f3f46] rounded-xl transition-all group overflow-hidden flex items-center justify-between p-4">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-all ${theme.bg} ${theme.border} ${theme.hoverBg}`}>
                                    <LinkIcon className={`w-4 h-4 ${theme.text}`} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-zinc-200 text-sm truncate">{res.title}</p>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300 font-mono mt-0.5 truncate block transition-colors">
                                        {res.url.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pl-4">
                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:bg-[#18181b] hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button onClick={() => deleteResource(res.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {(!resources || resources.length === 0) && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-[#27272a] bg-[#121214] rounded-2xl">
                        <div className="w-12 h-12 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mb-4">
                            <LinkIcon className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 font-medium text-sm">No resources added yet.</p>
                        <p className="text-zinc-600 text-xs mt-1">Add your first link above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function NotesModule({ teamId, initialNotes }: { teamId: string, initialNotes: any[] }) {
    const [notes, setNotes] = useState(initialNotes);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftContent, setDraftContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);

    const handleSave = async () => {
        if (!draftTitle.trim() && !draftContent.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: draftTitle || "Untitled Note", content: draftContent })
            });
            if (res.ok) {
                const newNote = await res.json();
                setNotes([newNote, ...notes]);
                setDraftTitle("");
                setDraftContent("");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const deleteNote = async (id: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/notes`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setNotes(prev => prev.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            {selectedNote && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#121214] border border-[#27272a] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-5 border-b border-[#27272a] flex items-center justify-between bg-[#18181b]">
                            <h3 className="text-xl font-bold text-white pr-8 truncate">{selectedNote.title}</h3>
                            <button onClick={() => setSelectedNote(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-p:leading-relaxed max-w-none break-words">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {selectedNote.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold">Project Notes</h2>
                <p className="text-zinc-500 text-sm mt-1">Jot down architecture decisions, meeting logs, or quick ideas.</p>
            </div>

            {/* Quick Note Editor */}
            <div className="bg-[#121214] border border-[#27272a] focus-within:border-[#3f3f46] transition-colors rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="text-lg font-bold bg-transparent border-none focus:ring-0 focus:outline-none w-full text-zinc-100 placeholder:text-zinc-600 px-6 py-5"
                    placeholder="Note Title"
                />
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-zinc-300 leading-relaxed text-sm px-6 pb-4 min-h-[140px] custom-scrollbar"
                    placeholder="Start writing your thoughts here..."
                />
                <div className="flex justify-between items-center px-6 py-4 border-t border-[#27272a] bg-[#18181b]/30 backdrop-blur-sm">
                    <p className="text-xs text-zinc-500 font-mono hidden sm:block">📝 Markdown & Code Blocks Supported</p>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || (!draftTitle && !draftContent)}
                        className="bg-white text-black hover:bg-zinc-200 rounded-lg h-9 px-6 font-medium transition-all shadow-none flex items-center gap-2 ml-auto"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Note
                    </Button>
                </div>
            </div>

            {/* Notes Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes?.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] cursor-pointer rounded-xl flex flex-col group transition-all relative h-48"
                    >
                        <div className="p-6 flex-1 flex flex-col overflow-hidden">
                            <h3 className="font-bold text-zinc-100 mb-2 truncate pr-8">{note.title}</h3>
                            <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                {note.content}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                            }}
                            className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {(!notes || notes.length === 0) && (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-[#27272a] bg-[#121214] rounded-2xl">
                    <div className="w-12 h-12 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium text-sm">No notes saved yet.</p>
                    <p className="text-zinc-600 text-xs mt-1">Write your first note in the editor above.</p>
                </div>
            )}
        </div>
    );
}

function SubmissionModule({ teamId, initialSubmission }: { teamId: string, initialSubmission: any }) {
    const [sub, setSub] = useState(initialSubmission || { problemStatement: "", solution: "", videoUrl: "" });
    const [isSaving, setIsSaving] = useState(false);

    const hasData = Boolean(sub.problemStatement || sub.solution || sub.techStack || sub.videoUrl);
    const [isEditing, setIsEditing] = useState(!hasData);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub)
            });
            if (res.ok) {
                const updated = await res.json();
                setSub(updated);
                setIsEditing(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Submission Builder</h2>
                    <p className="text-zinc-500 text-sm">Prepare and finalize your project details for judging.</p>
                </div>
                {isEditing ? (
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-white text-black hover:bg-zinc-200 h-10 px-6 font-medium rounded-lg transition-all shadow-none flex items-center gap-2 shrink-0"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{isSaving ? "Saving..." : "Save Submission"}</span>
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#18181b] text-white border border-[#27272a] hover:bg-[#27272a] h-10 px-6 font-medium rounded-lg transition-all shadow-none flex items-center gap-2 shrink-0"
                    >
                        <Settings className="w-4 h-4" />
                        <span>Edit Submission</span>
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-6">
                    <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            The Problem
                        </h3>
                        <div className="space-y-2">
                            <textarea
                                value={sub.problemStatement || ""}
                                onChange={e => setSub({ ...sub, problemStatement: e.target.value })}
                                className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] rounded-xl p-5 text-zinc-300 min-h-[140px] transition-all resize-y custom-scrollbar text-sm leading-relaxed"
                                placeholder="Describe the problem your team identified in the market or society..."
                            />
                        </div>
                    </div>

                    <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Our Solution
                        </h3>
                        <div className="space-y-2">
                            <textarea
                                value={sub.solution || ""}
                                onChange={e => setSub({ ...sub, solution: e.target.value })}
                                className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] rounded-xl p-5 text-zinc-300 min-h-[180px] transition-all resize-y custom-scrollbar text-sm leading-relaxed"
                                placeholder="Explain how your project solves the problem, your architecture, and key features..."
                            />
                        </div>
                    </div>

                    <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            Technical Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Tech Stack</label>
                                <Input
                                    value={sub.techStack || ""}
                                    onChange={e => setSub({ ...sub, techStack: e.target.value })}
                                    className="bg-[#18181b] border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] rounded-lg h-12 text-sm text-zinc-300 px-4 transition-all"
                                    placeholder="Next.js, Prisma, Tailwind..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Demo Video URL</label>
                                <Input
                                    value={sub.videoUrl || ""}
                                    onChange={e => setSub({ ...sub, videoUrl: e.target.value })}
                                    className="bg-[#18181b] border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] rounded-lg h-12 text-sm text-zinc-300 px-4 transition-all"
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-8 md:p-10 space-y-10">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3 mb-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
                                The Problem
                            </h3>
                            <p className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap pl-6">{sub.problemStatement || "No problem statement provided."}</p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272a] to-transparent" />

                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3 mb-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                                Our Solution
                            </h3>
                            <p className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap pl-6">{sub.solution || "No solution provided."}</p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272a] to-transparent" />

                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3 mb-6">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                                Technical Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-6">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Tech Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        {sub.techStack ? sub.techStack.split(',').map((tech: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs font-semibold text-zinc-300">
                                                {tech.trim()}
                                            </span>
                                        )) : <span className="text-zinc-600 text-sm">Not provided</span>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Demo Video</p>
                                    {sub.videoUrl ? (
                                        <a href={sub.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                            Watch Demo
                                        </a>
                                    ) : (
                                        <span className="text-zinc-600 text-sm">Not provided</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MembersModule({ team: initialTeam, copyInvite, copied }: { team: any, copyInvite: () => void, copied: boolean }) {
    const [team, setTeam] = useState(initialTeam);
    const [isUpdating, setIsUpdating] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
    const [sendError, setSendError] = useState("");

    const handleEmailInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setIsSending(true);
        setSendStatus("idle");
        setSendError("");
        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, teamId: team.id })
            });
            const data = await res.json();
            console.log("Invite API response:", res.status, data);
            if (res.ok) {
                setSendStatus("success");
                setInviteEmail("");
            } else {
                setSendStatus("error");
                setSendError(data?.error || data?.message || "Unknown error");
            }
        } catch (err: any) {
            setSendStatus("error");
            setSendError(err.message || "Network error");
        } finally {
            setIsSending(false);
            setTimeout(() => setSendStatus("idle"), 8000);
        }
    };


    const handleRequest = async (requestId: string, action: "APPROVE" | "REJECT") => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/requests/${requestId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                // Refresh team data
                const updatedRes = await fetch(`/api/teams/${team.id}`);
                if (updatedRes.ok) {
                    const updatedData = await updatedRes.json();
                    setTeam(updatedData);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Pending Requests Section */}
            {team.joinRequests?.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-amber-500">Pending Requests</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.joinRequests.map((req: any) => (
                            <Card key={req.id} className="bg-amber-500/5 border-amber-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-500">
                                            {req.user?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{req.user?.name}</p>
                                            <p className="text-xs text-zinc-500">{req.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleRequest(req.id, "APPROVE")}
                                            disabled={isUpdating}
                                            className="bg-emerald-600 hover:bg-emerald-500 rounded-lg h-8 px-4 text-xs"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRequest(req.id, "REJECT")}
                                            disabled={isUpdating}
                                            className="border-zinc-800 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg h-8 px-4 text-xs"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold">Team Members</h2>
                    <p className="text-zinc-500 mt-1">Manage collaborators and invite people to join.</p>
                </div>
                <Button onClick={copyInvite} className="bg-white text-black hover:bg-zinc-200 rounded-2xl flex items-center gap-2 px-6 h-12 font-bold shadow-xl shadow-white/10">
                    {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    {copied ? "Copied Link" : "Copy Invite Link"}
                </Button>
            </div>

            {/* Email Invite Box */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">Invite via Email</p>
                        <p className="text-xs text-zinc-500">Send a beautifully designed invite email directly to your teammate.</p>
                    </div>
                </div>
                <form onSubmit={handleEmailInvite} className="flex gap-3">
                    <Input
                        type="email"
                        placeholder="teammate@email.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 h-12 bg-zinc-900 border-zinc-800 rounded-2xl px-5 focus:border-indigo-500 transition-all"
                        required
                    />
                    <Button
                        type="submit"
                        disabled={isSending}
                        className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center gap-2"
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        {isSending ? "Sending..." : "Send Invite"}
                    </Button>
                </form>
                {sendStatus === "success" && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm animate-in fade-in duration-300">
                        <Check className="w-4 h-4" /> Invite email sent successfully!
                    </div>
                )}
                {sendStatus === "error" && (
                    <div className="space-y-1 animate-in fade-in duration-300">
                        <p className="text-rose-400 text-sm font-semibold">Failed to send invite.</p>
                        {sendError && (
                            <p className="text-zinc-500 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">{sendError}</p>
                        )}
                    </div>
                )}

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.members?.map((m: any, i: number) => (
                    <Card key={i} className="bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/60 transition-all rounded-3xl group overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-2xl group-hover:text-indigo-400 transition-colors">
                                        {m.user?.name?.[0] || "?"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white uppercase tracking-tight">{m.user?.name}</p>
                                    <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest text-[10px] mt-1">{m.role}</p>
                                </div>
                                <p className="text-zinc-600 font-mono text-xs">{m.user?.email}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-zinc-900/20 border-t border-zinc-800/50 justify-center flex items-center gap-4">
                            <button className="text-zinc-500 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></button>
                            <button className="text-zinc-500 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}


/* Helpers */

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800/50">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">{label}</p>
                <p className="text-white font-bold tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function SidebarNote({ title, date, active = false }: { title: string, date: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${active ? "bg-indigo-600/10 border border-indigo-600/30 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
            }`}>
            <span className="text-sm font-bold truncate pr-4">{title}</span>
            <span className="text-[10px] font-mono text-zinc-600">{date}</span>
        </button>
    )
}

function InputGroup({ label, value }: { label: string, value?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                {label}
            </label>
            <Input defaultValue={value} className="bg-zinc-900/30 border-zinc-800 h-14 rounded-2xl px-6 focus:border-indigo-500 text-zinc-300" />
        </div>
    );
}
