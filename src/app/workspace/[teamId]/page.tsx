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
    X,
    LogOut,
    Wrench,
    Bot,
    Sparkles,
    Heart,
    Terminal,
    Boxes,
    Cpu,
    Code,
    Code2,
    ChevronDown,
    Menu,
    GitCommit,
    Share2,
    CheckCircle2,
    Activity
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
    { id: "problem-statements", label: "Problem Statements", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "browse-tools", label: "Browse Tools", icon: <Wrench className="w-4 h-4" /> },
    { id: "llm", label: "LLM AI", icon: <Bot className="w-4 h-4" /> },
    { id: "code-library", label: "Code Library", icon: <Code2 className="w-4 h-4" /> },
    { id: "push-update", label: "Push Update", icon: <GitCommit className="w-4 h-4 text-emerald-400" /> },
];

export default function WorkspacePage({ params: paramsPromise }: { params: Promise<{ teamId: string }> }) {
    const params = use(paramsPromise);
    const teamId = params.teamId;

    const [team, setTeam] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModule, setActiveModule] = useState("overview");
    const [copied, setCopied] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="min-h-screen bg-[#09090b] text-white flex selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-72 border-r border-white/5 bg-black flex flex-col fixed inset-y-0 z-[60] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full shadow-2xl"}`}>
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
                                    setActiveModule(mod.id);
                                    setIsSidebarOpen(false);
                                }}
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
            <main className="flex-1 lg:ml-72 min-h-screen bg-[#09090b] w-full transition-all">
                {/* Top Header - Lean & Minimal */}
                <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-black sticky top-0 z-40 w-full">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-[9px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest hidden xs:block">Workspace</span>
                            <div className="w-[1px] h-3 bg-zinc-800 hidden xs:block" />
                            <span className="text-[9px] sm:text-[11px] font-bold text-white uppercase tracking-widest truncate max-w-[100px] sm:max-w-none">
                                {activeModule.replace('-', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input
                                className="w-40 md:w-64 bg-transparent border-none focus:ring-0 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none pl-9"
                                placeholder="Search..."
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-colors">
                                <Bell className="w-4 h-4" />
                            </button>

                            <div className="h-4 w-px bg-zinc-800" />

                            <button className="flex items-center gap-2 sm:gap-3 group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.1em]">
                                        {team.members?.[0]?.user?.name || "User"}
                                    </p>
                                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter opacity-60">Admin</p>
                                </div>
                                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-[#27272a] flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:border-zinc-500 transition-all shrink-0">
                                    {team.members?.[0]?.user?.name?.[0] || "U"}
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Modules */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {activeModule === "overview" && <OverviewModule team={team} setActiveModule={setActiveModule} />}
                    {activeModule === "tasks" && <TasksModule teamId={teamId} initialTasks={team.tasks || []} />}
                    {activeModule === "resources" && <ResourcesModule teamId={teamId} initialResources={team.resources || []} />}
                    {activeModule === "notes" && <NotesModule teamId={teamId} initialNotes={team.notes || []} />}
                    {activeModule === "submission" && <SubmissionModule teamId={teamId} initialSubmission={team.submission} />}
                    {activeModule === "members" && <MembersModule team={team} copyInvite={copyInvite} copied={copied} />}
                    {activeModule === "problem-statements" && <ProblemStatementsModule teamId={teamId} initialProblems={team.problemStatements || []} />}
                    {activeModule === "browse-tools" && <BrowseToolsModule />}
                    {activeModule === "llm" && <LLMModule team={team} />}
                    {activeModule === "code-library" && <CodeLibraryModule />}
                    {activeModule === "push-update" && <PushUpdateModule teamId={teamId} teamName={team?.name} />}
                </div>
            </main>
        </div>
    );
}

/* Modules */

function OverviewModule({ team, setActiveModule }: { team: any, setActiveModule: (m: string) => void }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = time.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-6xl mx-auto">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">{getGreeting()}</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight">{team.projectName}</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl font-medium">
                        {team.description || "The mission objective for this project is yet to be defined."}
                    </p>
                </div>
                <div className="flex -space-x-2">
                    {[...Array(team._count?.members || 1)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center text-[10px] font-medium text-zinc-400">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Section */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="cursor-pointer group" onClick={() => setActiveModule("submission")}>
                        <div className="p-6 rounded-2xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 transition-all">
                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.1em] mb-2">Hackathon</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-medium text-white truncate pr-4">{team.hackathonName}</p>
                                <Zap className="w-4 h-4 text-amber-500/40 group-hover:text-amber-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="cursor-pointer group" onClick={() => setActiveModule("tasks")}>
                        <div className="p-6 rounded-2xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 transition-all">
                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.1em] mb-2">Project Phase</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-medium text-white">Execution</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-3 h-1 rounded-full ${i <= 2 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="md:col-span-2">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-[#27272a] space-y-6 relative overflow-hidden group">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.1em]">Total Completion</p>
                                    <h3 className="text-xl font-medium text-white">Project Progress</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-semibold text-emerald-500">
                                        {Math.round((team.tasks?.filter((t: any) => t.status === "DONE").length || 0) / (team.tasks?.length || 1) * 100)}%
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-3">
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.round((team.tasks?.filter((t: any) => t.status === "DONE").length || 0) / (team.tasks?.length || 1) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[9px] font-medium text-zinc-600 uppercase tracking-widest">
                                    <span>Sprint Started</span>
                                    <span>Review Phase</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discovery Section */}
                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => setActiveModule("problem-statements")}
                        className="flex-1 p-8 rounded-3xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 transition-all group relative overflow-hidden text-left"
                    >
                        <p className="text-[10px] font-medium text-indigo-500 uppercase tracking-[0.2em] mb-3">Discovery</p>
                        <h3 className="text-xl font-semibold text-white leading-tight">Identify Global<br />Problem Statements</h3>
                        <div className="mt-8 flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Access Engine</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                    </button>

                    <div className="p-6 rounded-2xl bg-white text-black hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-between group" onClick={() => setActiveModule("members")}>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Collaborators</p>
                            <p className="text-xl font-bold mt-1">{team._count?.members || 1} <span className="text-zinc-400 font-medium">/ 4</span></p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
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

function ProblemStatementsModule({ teamId, initialProblems }: { teamId: string, initialProblems: any[] }) {
    const [problems, setProblems] = useState(initialProblems);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [scrapedProblems, setScrapedProblems] = useState<any[]>([]);
    const [isScraping, setIsScraping] = useState(false);
    const [showScraped, setShowScraped] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("relevance");

    const [analyses, setAnalyses] = useState<Record<string, string>>({});
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

    const analyzeProblem = async (problem: any) => {
        setAnalyzingIds(prev => new Set(prev).add(problem.id));
        try {
            const prompt = `Analyze this hackathon problem statement in extreme detail. Extract core themes, suggest a modern tech stack, list 3 potential technical roadblocks, and outline a high-level solution architecture.\nTitle: ${problem.title}\nDescription: ${problem.description}`;
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt })
            });
            if (res.ok) {
                const data = await res.json();
                setAnalyses(prev => ({ ...prev, [problem.id]: data.text }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(problem.id);
                return next;
            });
        }
    };

    const fetchScraped = async () => {
        setIsScraping(true);
        setShowScraped(true);
        try {
            const res = await fetch("/api/problem-statements/scraper");
            if (res.ok) {
                const data = await res.json();
                setScrapedProblems(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsScraping(false);
        }
    };

    const filteredScraped = scrapedProblems
        .filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.theme?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "difficulty") return a.difficulty.localeCompare(b.difficulty);
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

    const addScrapedProblem = async (problem: any) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/problem-statements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `[${problem.category}] ${problem.title}`,
                    description: `${problem.description}\n\nOrganization: ${problem.organization}\nTheme: ${problem.theme}`
                })
            });
            if (res.ok) {
                const newProblem = await res.json();
                setProblems([newProblem, ...problems]);
                setShowScraped(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/problem-statements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
            if (res.ok) {
                const newProblem = await res.json();
                setProblems([newProblem, ...problems]);
                setTitle("");
                setDescription("");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const deleteProblem = async (id: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/problem-statements`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setProblems(prev => prev.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/workspace/${teamId}/problem-statements`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                const updated = await res.json();
                setProblems(prev => prev.map(p => p.id === id ? updated : p));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Problem Statements</h2>
                    <p className="text-zinc-500 text-sm mt-1">Define the core challenges you&apos;re tackling in this project.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                            const res = await fetch(`/api/workspace/${teamId}/problem-statements`);
                            if (res.ok) setProblems(await res.json());
                        }}
                        className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                    >
                        <Rocket className="w-4 h-4" />
                    </Button>
                    {!showScraped && (
                        <Button
                            onClick={fetchScraped}
                            variant="outline"
                            className="border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50 rounded-xl h-10 px-6 font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                        >
                            <Search className="w-4 h-4" />
                            Find Global Problems
                        </Button>
                    )}
                </div>
            </div>

            {showScraped && (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Problem Discovery</h3>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Curated for Hackathons</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setShowScraped(false)}
                            className="text-zinc-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#18181b]/50 border border-[#27272a] p-4 rounded-2xl">
                        <div className="relative w-full md:w-96">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#121214] border border-[#27272a] focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none transition-all"
                                placeholder="Search by organization, theme, or title..."
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#121214] border border-[#27272a] text-zinc-400 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all w-full"
                            >
                                <option value="relevance">Relevance</option>
                                <option value="title">Alphabetical</option>
                                <option value="difficulty">Difficulty</option>
                            </select>
                        </div>
                    </div>

                    {isScraping ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-[#121214] border border-[#27272a] rounded-3xl">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-zinc-400 font-medium animate-pulse">Scraping SIH 2025 problem statements...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredScraped.map((p) => (
                                <div key={p.id} className="bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 rounded-3xl p-6 space-y-5 flex flex-col group transition-all relative overflow-hidden shadow-sm hover:shadow-indigo-500/5">
                                    <div className="flex justify-between items-start">
                                        <div className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{p.category}</p>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-white/5`}>
                                            {p.difficulty}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            {p.organization && (
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{p.organization}</p>
                                            )}
                                            <h4 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors">{p.title}</h4>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 min-h-[5em]">
                                            {p.description}
                                        </p>
                                    </div>

                                    {p.theme && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{p.theme}</p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-1.5">
                                        {p.tags.map((t: string) => (
                                            <span key={t} className="text-[9px] bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-1 rounded font-mono">{t}</span>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => addScrapedProblem(p)}
                                        className="w-full bg-white hover:bg-indigo-50 text-black rounded-2xl font-bold text-sm h-11 mt-auto transition-all shadow-none border-none"
                                    >
                                        Adopt This Problem
                                    </Button>

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[100px] -z-10 group-hover:bg-indigo-500/10 transition-all" />
                                </div>
                            ))}
                        </div>
                    )}
                    {filteredScraped.length === 0 && !isScraping && (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <SearchIcon className="w-8 h-8 text-zinc-700 mb-3" />
                            <p className="text-zinc-500 font-medium">No results found for &quot;{searchQuery}&quot;</p>
                            <p className="text-zinc-700 text-xs mt-1">Try searching by organization or theme instead.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Add Form */}
            <div className="bg-[#121214] border border-[#27272a] focus-within:border-[#3f3f46] transition-colors rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-bold bg-transparent border-none focus:ring-0 focus:outline-none w-full text-zinc-100 placeholder:text-zinc-600 px-6 py-5"
                    placeholder="Problem Title (e.g., Fragmented Data Access)"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-zinc-300 leading-relaxed text-sm px-6 pb-4 min-h-[120px] custom-scrollbar"
                    placeholder="Describe the challenge in detail..."
                />
                <div className="flex justify-between items-center px-6 py-4 border-t border-[#27272a] bg-[#18181b]/30 backdrop-blur-sm">
                    <p className="text-xs text-zinc-500 font-mono hidden sm:block">🎯 Clear definitions lead to better solutions.</p>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !title.trim() || !description.trim()}
                        className="bg-white text-black hover:bg-zinc-200 rounded-lg h-9 px-6 font-medium transition-all shadow-none flex items-center gap-2 ml-auto"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Problem
                    </Button>
                </div>
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems?.map((problem) => (
                    <div key={problem.id} className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl flex flex-col group transition-all relative p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${problem.status === "OPEN" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                problem.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                    "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                }`}>
                                {problem.status.replace('_', ' ')}
                            </span>
                            <button
                                onClick={() => deleteProblem(problem.id)}
                                className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-zinc-100 truncate pr-4">{problem.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                {problem.description}
                            </p>
                        </div>

                        <div className="pt-2 flex justify-start">
                            <button
                                onClick={() => analyzeProblem(problem)}
                                disabled={analyzingIds.has(problem.id)}
                                className="flex items-center text-[10px] h-7 px-3 bg-violet-500/10 border border-violet-500/20 font-bold uppercase tracking-widest text-violet-400 rounded-lg hover:text-white hover:bg-violet-500/30 transition-all disabled:opacity-50"
                            >
                                {analyzingIds.has(problem.id) ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
                                {analyses[problem.id] ? "Re-Analyze" : "AI Deep Extract"}
                            </button>
                        </div>

                        {analyses[problem.id] && (
                            <div className="mt-4 p-5 rounded-xl bg-[#121214] border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]">
                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                                    <Bot className="w-4 h-4 text-violet-400" />
                                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">AI Extraction Complete</span>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                                    <ReactMarkdown>{analyses[problem.id]}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex items-center justify-between gap-2 border-t border-white/5 mt-auto">
                            <select
                                value={problem.status}
                                onChange={(e) => updateStatus(problem.id, e.target.value)}
                                className="bg-[#121214] border border-[#27272a] text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 focus:outline-none focus:border-[#3f3f46]"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>

                            {problem.creator && (
                                <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                    <p className="text-[10px] text-zinc-500 font-medium">Added by</p>
                                    <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-0.5 rounded-full border border-white/5">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-[7px] font-bold text-white uppercase">
                                            {problem.creator.name?.[0] || 'U'}
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-300">{problem.creator.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(!problems || problems.length === 0) && (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-[#27272a] bg-[#121214] rounded-2xl">
                    <div className="w-12 h-12 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mb-4">
                        <ClipboardList className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium text-sm">No problem statements defined.</p>
                    <p className="text-zinc-600 text-xs mt-1">Start by adding your first challenge above.</p>
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
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-amber-500">Pending Requests</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.joinRequests.map((req: any) => (
                            <div key={req.id} className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden flex flex-col justify-between">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#121214] border border-[#27272a] flex items-center justify-center font-bold text-amber-500">
                                            {req.user?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-100">{req.user?.name}</p>
                                            <p className="text-xs text-zinc-500">{req.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleRequest(req.id, "APPROVE")}
                                            disabled={isUpdating}
                                            className="bg-white hover:bg-zinc-200 text-black rounded-lg h-8 px-4 text-xs font-medium"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRequest(req.id, "REJECT")}
                                            disabled={isUpdating}
                                            className="bg-[#121214] border-[#27272a] text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 rounded-lg h-8 px-4 text-xs font-medium"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold">Team Members</h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage collaborators and invite people to join.</p>
                </div>
                <Button onClick={copyInvite} className="bg-white text-black hover:bg-zinc-200 rounded-lg flex items-center gap-2 px-6 h-10 font-medium shadow-none shrink-0">
                    {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    {copied ? "Copied Link" : "Copy Invite Link"}
                </Button>
            </div>

            {/* Email Invite Box */}
            <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-black">
                        <Bell className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-bold text-zinc-100 text-sm">Invite via Email</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Send a direct invitation link to your teammate.</p>
                    </div>
                </div>
                <form onSubmit={handleEmailInvite} className="flex gap-3">
                    <Input
                        type="email"
                        placeholder="teammate@email.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 h-10 bg-[#18181b] border-[#27272a] rounded-lg px-4 focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] transition-all text-zinc-100 text-sm"
                        required
                    />
                    <Button
                        type="submit"
                        disabled={isSending}
                        className="h-10 px-5 bg-white text-black hover:bg-zinc-200 rounded-lg font-medium flex items-center gap-2 shrink-0 shadow-none text-sm"
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


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members?.map((m: any, i: number) => (
                    <div key={i} className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition-colors rounded-xl flex items-center p-5 gap-4 group">
                        <div className="w-14 h-14 rounded-xl bg-[#121214] border border-[#3f3f46] flex items-center justify-center shrink-0">
                            <span className="font-bold text-lg text-zinc-100 uppercase">{m.user?.name?.[0] || "?"}</span>
                        </div>
                        <div className="flex flex-col text-left overflow-hidden">
                            <p className="font-bold text-zinc-100 text-sm truncate">{m.user?.name}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{m.role}</p>
                            <p className="text-zinc-400 text-xs mt-1 truncate">{m.user?.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



function CodeLibraryModule() {
    const [activeLangCategory, setActiveLangCategory] = useState("All");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const languages = [
        // ... same languages array ...
        // Core Languages
        { name: "HTML5", desc: "Structure of webpages", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", category: "Core", customLogo: "https://www.w3.org/html/logo/downloads/HTML5_Badge_512.png" },
        { name: "CSS3", desc: "Styling and layout", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", category: "Core", customLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" },
        { name: "JavaScript", desc: "The language of the web", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "Core", customLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
        { name: "TypeScript", desc: "Typed superset of JavaScript", url: "https://www.typescriptlang.org", category: "Core" },
        { name: "Python", desc: "Versatile and easy to learn", url: "https://www.python.org", category: "Core" },
        { name: "Java", desc: "Enterprise-grade programming", url: "https://www.java.com", category: "Core" },
        { name: "Go", desc: "Simple, reliable, efficient software", url: "https://go.dev", category: "Core" },
        { name: "Rust", desc: "Performance, safety, and concurrency", url: "https://www.rust-lang.org", category: "Core" },

        // Frontend Frameworks
        { name: "React", desc: "UI development powerhouse", url: "https://react.dev", category: "Frontend" },
        { name: "Next.js", desc: "The React framework for the web", url: "https://nextjs.org", category: "Frontend" },
        { name: "Vue.js", desc: "The progressive framework", url: "https://vuejs.org", category: "Frontend" },
        { name: "Angular", desc: "The web development platform", url: "https://angular.io", category: "Frontend" },
        { name: "Svelte", desc: "Cybernetically enhanced web apps", url: "https://svelte.dev", category: "Frontend" },

        // UI & Styling
        { name: "Tailwind CSS", desc: "Utility-first CSS framework", url: "https://tailwindcss.com", category: "UI" },
        { name: "Bootstrap", desc: "Powerful extensible frontend toolkit", url: "https://getbootstrap.com", category: "UI" },
        { name: "Material UI", desc: "React components for faster development", url: "https://mui.com", category: "UI" },
        { name: "Shadcn UI", desc: "Modern UI components", url: "https://ui.shadcn.com", category: "UI" },
        { name: "Chakra UI", desc: "Simple, modular and accessible", url: "https://chakra-ui.com", category: "UI" },

        // Backend Frameworks
        { name: "Node.js", desc: "JavaScript runtime for backend", url: "https://nodejs.org", category: "Backend" },
        { name: "Express.js", desc: "REST API development", url: "https://expressjs.com", category: "Backend" },
        { name: "NestJS", desc: "Structured backend framework", url: "https://nestjs.com", category: "Backend" },
        { name: "Fastify", desc: "Fast and low overhead web framework", url: "https://www.fastify.io", category: "Backend" },
        { name: "Django", desc: "Full Python backend framework", url: "https://www.djangoproject.com", category: "Backend" },
        { name: "FastAPI", desc: "High-performance Python APIs", url: "https://fastapi.tiangolo.com", category: "Backend" },

        // Databases
        { name: "PostgreSQL", desc: "Advanced SQL database", url: "https://www.postgresql.org", category: "Database" },
        { name: "MySQL", desc: "Scalable SQL database", url: "https://www.mysql.com", category: "Database" },
        { name: "SQLite", desc: "Small, fast, self-contained SQL database", url: "https://sqlite.org", category: "Database" },
        { name: "MongoDB", desc: "Flexible document database", url: "https://www.mongodb.com", category: "Database" },
        { name: "Firestore", desc: "Google's NoSQL document database", url: "https://firebase.google.com/docs/firestore", category: "Database" },
        { name: "Cassandra", desc: "Highly-scalable distributed database", url: "https://cassandra.apache.org", category: "Database" },

        // ORM / Database Tools
        { name: "Prisma", desc: "Next-generation Node.js and TypeScript ORM", url: "https://www.prisma.io", category: "ORM" },
        { name: "Sequelize", desc: "Promise-based Node.js ORM for SQL", url: "https://sequelize.org", category: "ORM" },
        { name: "TypeORM", desc: "ORM that can run in multiple platforms", url: "https://typeorm.io", category: "ORM" },
        { name: "Mongoose", desc: "MongoDB object modeling for Node.js", url: "https://mongoosejs.com", category: "ORM" },

        // API Technologies
        { name: "REST", desc: "Representational State Transfer", url: "https://restfulapi.net", category: "API" },
        { name: "GraphQL", desc: "Query language for your API", url: "https://graphql.org", category: "API" },
        { name: "gRPC", desc: "Modern high-performance RPC framework", url: "https://grpc.io", category: "API" },

        // Authentication Systems
        { name: "NextAuth.js", desc: "Auth for Next.js apps", url: "https://next-auth.js.org", category: "Auth" },
        { name: "Clerk", desc: "SaaS user management", url: "https://clerk.com", category: "Auth" },
        { name: "Auth0", desc: "Enterprise identity platform", url: "https://auth0.com", category: "Auth" },
        { name: "Firebase Auth", desc: "Google's authentication service", url: "https://firebase.google.com/docs/auth", category: "Auth" },

        // Caching & Search
        { name: "Redis", desc: "Fast in-memory data store", url: "https://redis.io", category: "Caching" },
        { name: "Memcached", desc: "Distributed memory object caching system", url: "https://memcached.org", category: "Caching" },
        { name: "Elasticsearch", desc: "Distributed, RESTful search engine", url: "https://www.elastic.co", category: "Search" },
        { name: "Meilisearch", desc: "Fast and relevant search engine", url: "https://www.meilisearch.com", category: "Search" },
        { name: "Algolia", desc: "Powerful search for your apps", url: "https://www.algolia.com", category: "Search" },

        // Message Queues
        { name: "RabbitMQ", desc: "Widely deployed open source message broker", url: "https://www.rabbitmq.com", category: "Messaging" },
        { name: "Apache Kafka", desc: "Distributed event streaming platform", url: "https://kafka.apache.org", category: "Messaging" },
        { name: "BullMQ", desc: "Message queue for Node.js based on Redis", url: "https://bullmq.io", category: "Messaging" },

        // Cloud & Hosting
        { name: "Vercel", desc: "The frontend cloud for Next.js", url: "https://vercel.com", category: "Cloud" },
        { name: "Netlify", desc: "Composable web platform", url: "https://www.netlify.com", category: "Cloud" },
        { name: "AWS", desc: "Scalable cloud infrastructure", url: "https://aws.amazon.com", category: "Cloud" },
        { name: "Google Cloud", desc: "Cloud computing services", url: "https://cloud.google.com", category: "Cloud" },
        { name: "Azure", desc: "Enterprise cloud services", url: "https://azure.microsoft.com", category: "Cloud" },

        // DevOps & CI/CD
        { name: "Docker", desc: "Containerization platform", url: "https://www.docker.com", category: "DevOps" },
        { name: "Kubernetes", desc: "Container orchestration", url: "https://kubernetes.io", category: "DevOps" },
        { name: "Terraform", desc: "Infrastructure as Code", url: "https://www.terraform.io", category: "DevOps" },
        { name: "GitHub Actions", desc: "Automation and CI/CD", url: "https://github.com/features/actions", category: "DevOps" },
        { name: "GitLab CI", desc: "Integrated CI/CD platform", url: "https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/", category: "DevOps" },
        { name: "Jenkins", desc: "Extensible open source automation server", url: "https://www.jenkins.io", category: "DevOps" },

        // Monitoring & Analytics
        { name: "Sentry", desc: "Application monitoring and error tracking", url: "https://sentry.io", category: "Monitoring" },
        { name: "Datadog", desc: "Monitoring and security for cloud apps", url: "https://www.datadoghq.com", category: "Monitoring" },
        { name: "Google Analytics", desc: "Web analytics service", url: "https://analytics.google.com", category: "Monitoring" },

        // Payments
        { name: "Stripe", desc: "Financial infrastructure for the internet", url: "https://stripe.com", category: "Payments" },
        { name: "Razorpay", desc: "Payment solution for India", url: "https://razorpay.com", category: "Payments" },
        { name: "PayPal", desc: "Digital wallet and payment service", url: "https://www.paypal.com", category: "Payments" },

        // File Storage
        { name: "Cloudinary", desc: "Image and video management", url: "https://cloudinary.com", category: "Storage" },
        { name: "Amazon S3", desc: "Object storage service", url: "https://aws.amazon.com/s3", category: "Storage" },
        { name: "UploadThing", desc: "Best way to add file uploads to your app", url: "https://uploadthing.com", category: "Storage" },
    ];

    const categories = ["All", "Core", "Frontend", "UI", "Backend", "Database", "ORM", "API", "Auth", "Caching", "Search", "Messaging", "Cloud", "DevOps", "Monitoring", "Payments", "Storage"];

    // Group categories into logical Tech Stacks
    const STACKS = [
        { name: "Languages & Frameworks", categories: ["Core", "Frontend", "UI"] },
        { name: "Backend & Communication", categories: ["Backend", "API", "Messaging"] },
        { name: "Data & Performance", categories: ["Database", "ORM", "Caching", "Search"] },
        { name: "Cloud & Infrastructure", categories: ["Cloud", "DevOps"] },
        { name: "SaaS Ecosystem", categories: ["Auth", "Monitoring", "Payments", "Storage"] }
    ];

    const filteredLangs = activeLangCategory === "All" ? languages : languages.filter(l => l.category === activeLangCategory);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative z-50">
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-white tracking-tight">Code Library</h2>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">Core languages and official documentation.</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#121214] border border-[#27272a] hover:border-zinc-500 transition-all text-zinc-400 hover:text-white"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{activeLangCategory}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#121214] border border-[#27272a] shadow-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setActiveLangCategory(cat);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeLangCategory === cat
                                            ? 'bg-white text-black'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-16">
                {activeLangCategory === "All" ? (
                    STACKS.map((stack) => (
                        <div key={stack.name} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold text-white tracking-tight">{stack.name}</h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                                {languages.filter(l => stack.categories.includes(l.category)).map((lang) => (
                                    <LangCard key={lang.name} lang={lang} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                        {filteredLangs.map((lang) => (
                            <LangCard key={lang.name} lang={lang} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LangCard({ lang }: { lang: any }) {
    return (
        <div
            onClick={() => window.open(lang.url, '_blank')}
            className="p-3.5 rounded-xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 hover:bg-[#18181b] transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl overflow-hidden p-2">
                    <img
                        src={lang.customLogo || `https://www.google.com/s2/favicons?domain=${new URL(lang.url).hostname}&sz=128`}
                        alt={lang.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            if (!lang.customLogo) {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${lang.name}&background=6366f1&color=fff`;
                            }
                        }}
                    />
                </div>
                <span className="text-[6.5px] font-bold text-zinc-500 tracking-wider bg-zinc-900/50 px-1.5 py-0.5 rounded-md border border-white/5 group-hover:text-white transition-colors">
                    {lang.category}
                </span>
            </div>

            <div className="space-y-1 flex-1">
                <h3 className="text-[11px] font-medium text-white tracking-tight group-hover:text-indigo-400 transition-colors">{lang.name}</h3>
                <p className="text-zinc-500 text-[9px] leading-tight font-normal line-clamp-2">
                    {lang.desc}
                </p>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 text-white">
                <span className="text-[7.5px] font-medium tracking-tight text-indigo-400">Documentation</span>
                <ExternalLink className="w-2.5 h-2.5" />
            </div>

            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100" />
        </div>
    );
}

function BrowseToolsModule() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const tools = [
        // Core Vibe Coding Tools
        { name: "v0 by Vercel", desc: "Generate React / Next.js UI from prompts", url: "https://v0.dev", category: "Core" },
        { name: "Bolt.new", desc: "Build full stack apps instantly", url: "https://bolt.new", category: "Core" },
        { name: "Lovable", desc: "Turn ideas into full SaaS apps", url: "https://lovable.dev", category: "Core" },
        { name: "Replit Agent", desc: "Autonomous coding agent", url: "https://replit.com/ai", category: "Core" },
        { name: "Cursor", desc: "AI powered VS Code", url: "https://cursor.com", category: "Core" },
        { name: "Windsurf", desc: "AI programming environment", url: "https://windsurf.dev", category: "Core" },
        { name: "GitHub Copilot", desc: "AI pair programmer", url: "https://github.com/copilot", category: "Core" },

        // Autonomous AI Coding Agents
        { name: "Devin AI", desc: "Fully autonomous developer agent", url: "https://cognition.ai", category: "Agents" },
        { name: "OpenAI Codex", desc: "Code generating AI system", url: "https://openai.com", category: "Agents" },
        { name: "Claude Code", desc: "AI programming agent", url: "https://claude.ai", category: "Agents" },
        { name: "Amazon Q Developer", desc: "AI developer assistant for AWS", url: "https://aws.amazon.com/q", category: "Agents" },
        { name: "Aider", desc: "Terminal based AI coder", url: "https://aider.chat", category: "Agents" },
        { name: "Smol Developer", desc: "Prompt → full app", url: "https://github.com/smol-ai/developer", category: "Agents" },
        { name: "Antigravity", desc: "Next-gen agentic coding assistant", url: "https://antigravity.ai", category: "Agents", customLogo: "https://www.google.com/favicon.ico" },

        // AI App / Website Builders
        { name: "Framer AI", desc: "Prompt → website", url: "https://framer.com", category: "Builders" },
        { name: "Durable AI", desc: "Build websites instantly", url: "https://durable.co", category: "Builders" },
        { name: "Webflow AI", desc: "AI design system", url: "https://webflow.com", category: "Builders" },
        { name: "Builder.ai", desc: "AI assisted product development", url: "https://builder.ai", category: "Builders" },
        { name: "Bubble", desc: "No-code web app builder", url: "https://bubble.io", category: "Builders" },
        { name: "TeleportHQ", desc: "UI generation tool", url: "https://teleporthq.io", category: "Builders" },

        // Emerging Vibe Coding Platforms
        { name: "Base44", desc: "Prompt → SaaS builder", url: "https://base44.com", category: "Emerging" },
        { name: "Emergent", desc: "Build apps with natural language", url: "https://emergent.sh", category: "Emerging" },
        { name: "Tempo Labs", desc: "Product design + dev", url: "https://tempo.dev", category: "Emerging" },
        { name: "Softgen", desc: "Prompt to application", url: "https://softgen.ai", category: "Emerging" },
        { name: "Meku", desc: "Rapid app generation", url: "https://meku.dev", category: "Emerging" },
        { name: "Macaly", desc: "Simple prompt-based sites", url: "https://macaly.com", category: "Emerging" },

        // AI Coding Assistants
        { name: "Tabnine", desc: "AI coding assistant", url: "https://tabnine.com", category: "Assistants" },
        { name: "Sourcegraph Cody", desc: "Codebase AI helper", url: "https://sourcegraph.com", category: "Assistants" },
        { name: "JetBrains AI Assistant", desc: "AI integrated in JetBrains IDEs", url: "https://jetbrains.com", category: "Assistants" },
        { name: "CodeGeeX", desc: "Multi language AI coder", url: "https://codegeex.cn", category: "Assistants" },
        { name: "Phind", desc: "Developer focused AI", url: "https://phind.com", category: "Assistants" },

        // Experimental AI Dev Agents
        { name: "GPT Engineer", desc: "AI builds entire projects", url: "https://gptengineer.app", category: "Experimental" },
        { name: "MetaGPT", desc: "AI team building software", url: "https://github.com/geekan/MetaGPT", category: "Experimental" },
        { name: "AutoDev", desc: "Autonomous coding", url: "https://autodev.ai", category: "Experimental" },
        { name: "OpenDevin", desc: "Autonomous dev agent", url: "https://all-hands.ai", category: "Experimental" },
        { name: "Devika AI", desc: "Open source AI developer", url: "https://github.com/stitionai/devika", category: "Experimental" },

        // Special
        { name: "AI Studio", desc: "Experimental AI development playground", url: "https://aistudio.google.com", category: "Experimental" },
    ];

    const categories = ["All", "Core", "Agents", "Builders", "Emerging", "Assistants", "Experimental"];
    const filteredTools = activeCategory === "All" ? tools : tools.filter(t => t.category === activeCategory);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative z-50">
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-white tracking-tight">Browse Tools</h2>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">The complete vibe coding ecosystem at your fingertips.</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#121214] border border-[#27272a] hover:border-zinc-500 transition-all text-zinc-400 hover:text-white"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{activeCategory}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#121214] border border-[#27272a] shadow-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setActiveCategory(cat);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                            ? 'bg-white text-black'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {filteredTools.map((tool, i) => (
                    <div
                        key={tool.name}
                        onClick={() => window.open(tool.url, '_blank')}
                        className="p-3.5 rounded-xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 hover:bg-[#18181b] transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl overflow-hidden p-2">
                                <img
                                    src={tool.customLogo || `https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=128`}
                                    alt={tool.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        if (!tool.customLogo) {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}&background=6366f1&color=fff`;
                                        }
                                    }}
                                />
                            </div>
                            <span className="text-[6.5px] font-bold text-zinc-500 tracking-wider bg-zinc-900/50 px-1.5 py-0.5 rounded-md border border-white/5 group-hover:text-white transition-colors">
                                {tool.category}
                            </span>
                        </div>

                        <div className="space-y-1 flex-1">
                            <h3 className="text-[11px] font-medium text-white tracking-tight group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                            <p className="text-zinc-500 text-[9px] leading-tight font-normal line-clamp-2">
                                {tool.desc}
                            </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 text-white">
                            <span className="text-[7.5px] font-medium tracking-tight text-indigo-400">Launch Tool</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                        </div>

                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function LLMModule({ team }: { team: any }) {
    const [sessions, setSessions] = useState<{ id: string, title: string, messages: { role: 'user' | 'assistant', content: string }[], updatedAt: number }[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(`chat-sessions-${team.id}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                setSessions(parsed);
                if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
            }
        } catch (e) {
            console.error(e);
        }
    }, [team.id]);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem(`chat-sessions-${team.id}`, JSON.stringify(sessions));
        } else {
            localStorage.removeItem(`chat-sessions-${team.id}`);
        }
    }, [sessions, team.id]);

    const activeSession = sessions.find(s => s.id === currentSessionId);
    const messages = activeSession ? activeSession.messages : [];

    const createNewChat = () => {
        const newSession = { id: Date.now().toString(), title: "New Chat", messages: [], updatedAt: Date.now() };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
    };

    const updateCurrentSession = (newMessages: { role: 'user' | 'assistant', content: string }[]) => {
        setSessions(prev => {
            let sessionExists = false;
            let title = "New Chat";
            if (newMessages.length > 0) {
                const firstUser = newMessages.find(m => m.role === 'user');
                if (firstUser) title = firstUser.content.slice(0, 30) + (firstUser.content.length > 30 ? "..." : "");
            }
            const updated = prev.map(s => {
                if (s.id === currentSessionId) {
                    sessionExists = true;
                    return { ...s, messages: newMessages, updatedAt: Date.now(), title };
                }
                return s;
            });
            if (!sessionExists && currentSessionId) {
                return [{ id: currentSessionId, title, messages: newMessages, updatedAt: Date.now() }, ...prev];
            }
            return updated;
        });
    };

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions(prev => {
            const next = prev.filter(s => s.id !== id);
            if (currentSessionId === id) setCurrentSessionId(next.length > 0 ? next[0].id : null);
            return next;
        });
    };

    const handleSendMessage = async (e?: React.FormEvent, predefinedInput?: string) => {
        if (e) e.preventDefault();
        const textToSend = (predefinedInput || input).trim();
        if (!textToSend || isLoading) return;

        let activeId = currentSessionId;
        if (!activeId) {
            activeId = Date.now().toString();
            setCurrentSessionId(activeId);
        }

        const updatedMessages = [...messages, { role: 'user' as const, content: textToSend }];
        updateCurrentSession(updatedMessages);

        if (!predefinedInput) setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: textToSend, context: JSON.stringify(team) })
            });
            if (!res.ok) throw new Error("Failed to get response");
            const data = await res.json();
            updateCurrentSession([...updatedMessages, { role: 'assistant', content: data.text }]);
        } catch (error) {
            console.error(error);
            updateCurrentSession([...updatedMessages, { role: 'assistant', content: "Sorry, an error occurred." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight">LLM Intelligence</h2>
                    <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-medium">Deep-Analysis Workspace Co-Pilot.</p>
                </div>
                <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Gemini Experimental</span>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden relative">
                {/* History Sidebar */}
                <div className="w-64 bg-[#121214] border border-[#27272a] rounded-[1.5rem] p-4 flex flex-col pt-6 hidden md:flex h-full shrink-0">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">History</h3>
                        <button onClick={createNewChat} className="text-violet-400 hover:text-violet-300 p-1.5 rounded-lg hover:bg-violet-500/10 transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {sessions.map(s => (
                            <div
                                key={s.id}
                                onClick={() => setCurrentSessionId(s.id)}
                                className={`p-3 rounded-xl border cursor-pointer group relative transition-all flex items-center justify-between ${s.id === currentSessionId ? "bg-violet-500/10 border-violet-500/30" : "bg-black/20 border-transparent hover:border-white/5"}`}
                            >
                                <p className={`text-xs font-semibold truncate pr-6 ${s.id === currentSessionId ? "text-violet-300" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                                    {s.title}
                                </p>
                                <button
                                    onClick={(e) => deleteSession(s.id, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-rose-400 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 bg-[#121214] border border-[#27272a] rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col relative overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto space-y-6 mb-4 scrollbar-hide pr-2">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-semibold text-white tracking-tight">How can I assist your team today?</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
                                        I have been trained with high-detail extraction models to provide deep project context and technical precision.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-6">
                                    {["Draft project readme", "Analyze problem statement", "Fix react bug", "Generate tech stack"].map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => handleSendMessage(e, p)}
                                            className="p-4 rounded-2xl bg-black/40 border border-[#27272a] hover:border-violet-500/30 text-zinc-400 text-xs font-medium hover:text-white transition-all text-left group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{p}</span>
                                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-violet-400" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user'
                                        ? 'bg-violet-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                        : 'bg-black/40 border border-[#27272a] text-zinc-300 rounded-tl-none'
                                        }`}>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-black/40 border border-[#27272a] p-4 rounded-2xl rounded-tl-none">
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-auto relative pt-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-black border border-[#27272a] focus:border-violet-500/30 rounded-2xl h-16 px-8 text-sm outline-none transition-all placeholder:text-zinc-700"
                            placeholder="Message Deep-Extraction AI..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black hover:bg-zinc-200 transition-all disabled:opacity-50"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 blur-[120px] -z-0 pointer-events-none" />
                </div>
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

function PushUpdateModule({ teamId, teamName }: { teamId: string, teamName: string }) {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [comment, setComment] = useState("");
    const [research, setResearch] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch registered events for this team to populate the dropdown
                const eventsRes = await fetch(`/api/workspace/${teamId}/events`);
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    setEvents(eventsData.events || []);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load Data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!selectedEventId) {
            setError("Please select a target Hackathon Event");
            return;
        }
        if (!comment.trim() || !research.trim()) {
            setError("Please fill out both the commit comment and your research notes");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                eventId: selectedEventId,
                comment,
                research
            };

            const response = await fetch(`/api/workspace/${teamId}/commit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to push commit");
            }

            setSuccessMessage("Update committed to the organizer dashboard successfully!");
            setComment("");
            setResearch("");
            setSelectedEventId("");

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error("Commit error:", err);
            setError(err.message || "Failed to commit update to organizer");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center bg-[#050505] text-white rounded-2xl border border-white/5">
                <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <GitCommit className="w-6 h-6 text-[#4f46e5]" />
                        Push Update
                    </h1>
                    <p className="text-sm font-medium text-zinc-500">
                        Commit your team's ({teamName}) latest progress directly to the active event organizer dashboard.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4" /> {error}
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {successMessage}
                </div>
            )}

            <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6 shadow-xl shadow-black/50">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Target Hackathon</label>
                        <div className="relative">
                            <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full h-12 bg-black border border-[#27272a] focus:border-[#4f46e5]/50 rounded-xl pl-11 pr-4 text-sm font-medium text-white appearance-none outline-none transition-all"
                            >
                                <option value="" disabled className="text-zinc-600">Select active event...</option>
                                {events.map((evt) => (
                                    <option key={evt.id} value={evt.id}>
                                        {evt.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {events.length === 0 && (
                            <p className="text-[10px] text-zinc-500 font-medium pl-1 mt-1">
                                No active hackathon events found in the system.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Commit Message</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-[#4f46e5] transition-colors" />
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you build? (e.g., 'Implemented core auth logic and database schema')"
                                className="w-full bg-black border border-[#27272a] focus:border-[#4f46e5]/50 text-white rounded-xl pl-11 pr-4 py-3 min-h-[100px] resize-y outline-none transition-all placeholder:text-zinc-700 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Research & Findings</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-[#4f46e5] transition-colors" />
                            <textarea
                                value={research}
                                onChange={(e) => setResearch(e.target.value)}
                                placeholder="Any major technical research, articles read, or bugs resolved during this phase..."
                                className="w-full bg-black border border-[#27272a] focus:border-[#4f46e5]/50 text-white rounded-xl pl-11 pr-4 py-3 min-h-[150px] resize-y outline-none transition-all placeholder:text-zinc-700 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#27272a]">
                        <button
                            type="submit"
                            disabled={isSubmitting || events.length === 0}
                            className="w-full h-11 bg-white hover:bg-zinc-200 text-black rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><GitCommit className="w-4 h-4" /> Push to Organizer Dashboard</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
