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
    ArrowRight

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
                                    <span className="text-emerald-400">0%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[0%] bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000" />
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
                    const statusKey = col.toLowerCase().replace(" ", "_");
                    const colTasks = tasks?.filter(t => t.status.toLowerCase() === statusKey);

                    return (
                        <div key={col} className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{col}</h3>
                                <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 uppercase font-mono">
                                    {colTasks?.length || 0}
                                </span>
                            </div>

                            <div className="space-y-3 min-h-[500px] border-2 border-dashed border-zinc-900/50 rounded-2xl p-2 bg-black/20">
                                {colTasks?.map((task, i) => (
                                    <div key={task.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors capitalize">{task.title}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                className="bg-black/50 border border-zinc-800 text-xs px-2 py-1 rounded-lg text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="BACKLOG">Backlog</option>
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </select>

                                            <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-rose-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!colTasks || colTasks.length === 0) && (
                                    <div className="h-20 flex items-center justify-center text-zinc-600 text-xs font-semibold uppercase tracking-widest">
                                        Empty
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Team Resources</h2>
                <form onSubmit={addResource} className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
                    <Input
                        placeholder="Link Title (e.g., Figma)"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 rounded-xl"
                    />
                    <Input
                        placeholder="URL (https://...)"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 rounded-xl"
                    />
                    <Button disabled={isAdding || !newTitle || !newUrl} type="submit" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl whitespace-nowrap px-6">
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources?.map((res) => (
                    <Card key={res.id} className="bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60 transition-all group overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                                    <LinkIcon className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-zinc-200 truncate">{res.title}</p>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline font-mono mt-0.5 truncate block">{res.url}</a>
                                </div>
                            </div>
                            <button onClick={() => deleteResource(res.id)} className="text-zinc-600 hover:text-rose-500 transition-colors shrink-0 ml-4">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
                {(!resources || resources.length === 0) && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="text-zinc-500 font-medium">No resources added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function NotesModule({ teamId, initialNotes }: { teamId: string, initialNotes: any[] }) {
    const [notes, setNotes] = useState(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNotes?.[0]?.id || null);
    const [isCreating, setIsCreating] = useState(false);

    const activeNote = notes.find(n => n.id === activeNoteId);

    const createNote = async () => {
        setIsCreating(true);
        try {
            const res = await fetch(`/api/workspace/${teamId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "New Note", content: "Start typing here..." })
            });
            if (res.ok) {
                const newNote = await res.json();
                setNotes([newNote, ...notes]);
                setActiveNoteId(newNote.id);
            }
        } finally {
            setIsCreating(false);
        }
    };

    const updateNote = async (id: string, updates: { title?: string, content?: string }) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
        try {
            await fetch(`/api/workspace/${teamId}/notes`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates })
            });
        } catch (err) {
            console.error(err);
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
                const remaining = notes.filter(n => n.id !== id);
                setNotes(remaining);
                if (activeNoteId === id) {
                    setActiveNoteId(remaining[0]?.id || null);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Project Notes</h2>
                <Button onClick={createNote} disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} New Note
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {notes?.map((note) => (
                        <div key={note.id} onClick={() => setActiveNoteId(note.id)} className="cursor-pointer">
                            <SidebarNote title={note.title} date="Updated recently" active={activeNoteId === note.id} />
                        </div>
                    ))}
                    {(!notes || notes.length === 0) && <p className="text-zinc-600 text-sm p-4 text-center">No notes created.</p>}
                </div>
                <div className="lg:col-span-3">
                    <Card className="bg-zinc-900/20 border-zinc-800 min-h-[500px] rounded-3xl p-8 space-y-6">
                        {activeNote ? (
                            <div className="space-y-6 flex flex-col h-full">
                                <div className="flex justify-between items-start border-b border-zinc-800 pb-6 group">
                                    <input
                                        value={activeNote.title}
                                        onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                                        className="text-3xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white"
                                        placeholder="Note Title"
                                    />
                                    <button onClick={() => deleteNote(activeNote.id)} className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <textarea
                                    value={activeNote.content}
                                    onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                                    className="w-full h-full min-h-[400px] bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-zinc-400 leading-relaxed text-base"
                                    placeholder="Start writing..."
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px] text-zinc-600">
                                Select a note or create a new one.
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

function SubmissionModule({ teamId, initialSubmission }: { teamId: string, initialSubmission: any }) {
    const [sub, setSub] = useState(initialSubmission || { problemStatement: "", solution: "", videoUrl: "" });
    const [isSaving, setIsSaving] = useState(false);

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
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Submission Builder</h2>
                <p className="text-zinc-500 text-lg">Build weights for your project's final profile.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Problem Statement</label>
                    <textarea
                        value={sub.problemStatement || ""}
                        onChange={e => setSub({ ...sub, problemStatement: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white min-h-[100px] focus:outline-none focus:border-indigo-500"
                        placeholder="What problem are you solving?"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Our Solution</label>
                    <textarea
                        value={sub.solution || ""}
                        onChange={e => setSub({ ...sub, solution: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white min-h-[120px] focus:outline-none focus:border-indigo-500"
                        placeholder="Explain your technical solution..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Tech Stack</label>
                        <Input
                            value={sub.techStack || ""}
                            onChange={e => setSub({ ...sub, techStack: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 rounded-xl h-12"
                            placeholder="Next.js, Prisma, Tailwind..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Demo Video URL</label>
                        <Input
                            value={sub.videoUrl || ""}
                            onChange={e => setSub({ ...sub, videoUrl: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 rounded-xl h-12"
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-600/20 text-lg flex items-center gap-2 group mt-4">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    {isSaving ? "Saving..." : "Save Submission Details"}
                </Button>
            </div>
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
