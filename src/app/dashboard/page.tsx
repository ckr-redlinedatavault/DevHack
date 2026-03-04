"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Plus,
    Settings,
    Users,
    Rocket,
    ArrowRight,
    Loader2,
    Search as SearchIcon,
    Bell,
    Globe,
    LogOut,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [time, setTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch("/api/teams");
                if (res.ok) {
                    const data = await res.json();
                    setTeams(data);
                }
            } catch (err) {
                console.error("Failed to fetch teams");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            signOut({ callbackUrl: "/login" });
        } catch (err) {
            console.error("Logout failed");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 flex overflow-x-hidden">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
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
                    </div>

                    <nav className="p-4 space-y-1">
                        <SidebarLink icon={<LayoutDashboard className="w-4 h-4" />} label="All Teams" active />
                        <SidebarLink icon={<Plus className="w-4 h-4" />} label="Join Workspace" />
                        <SidebarLink icon={<Settings className="w-4 h-4" />} label="Settings" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full h-11 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-semibold">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 lg:ml-72 min-h-screen w-full transition-all">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-black sticky top-0 z-40 w-full">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-[9px] sm:text-[11px] font-bold text-zinc-500 hidden xs:block">DevHack</span>
                            <div className="w-[1px] h-3 bg-zinc-800 hidden xs:block" />
                            <span className="text-[9px] sm:text-[11px] font-bold text-white">Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden lg:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input
                                className="w-64 bg-transparent border-none focus:ring-0 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none pl-9"
                                placeholder="Search workspace..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-colors">
                                <Bell className="w-4 h-4" />
                            </button>

                            <div className="h-4 w-px bg-zinc-800" />

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                    {/* Hero Section */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                                <span className="text-[10px] font-bold text-zinc-500">Active hub</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Your Workspaces</h2>
                            <p className="text-zinc-500 text-sm max-w-xl font-medium leading-relaxed">
                                Select a workspace to continue building your innovation.
                            </p>
                        </div>

                        <Link
                            href="/create-team"
                            className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 group sm:w-auto w-full"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs font-bold leading-none">New team</span>
                        </Link>
                    </div>

                    {/* Teams Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team) => (
                            <Link key={team.id} href={`/workspace/${team.id}`} className="group">
                                <div className="p-8 rounded-3xl bg-[#121214] border border-[#27272a] hover:border-indigo-500/50 transition-all group-hover:bg-[#18181b] relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            <Rocket className="w-5 h-5" />
                                        </div>
                                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[8px] font-black text-emerald-500">
                                            Active
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{team.projectName}</h3>
                                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{team.name}</p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-medium uppercase tracking-tighter">
                                                <Users className="w-3 h-3" /> {team._count?.members || 1}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-medium uppercase tracking-tighter">
                                                <Globe className="w-3 h-3" /> SIH 2025
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100" />
                                </div>
                            </Link>
                        ))}

                        {/* Join Another Action */}
                        <Link href="/onboarding" className="group">
                            <div className="h-full border border-dashed border-[#27272a] rounded-3xl flex flex-col items-center justify-center p-8 space-y-4 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all min-h-[240px]">
                                <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900 group-hover:border-indigo-500/50 group-hover:scale-110 transition-all">
                                    <Plus className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-zinc-500 text-xs font-bold">Join another workspace</p>
                                    <p className="text-zinc-600 text-[10px] mt-1">Ready for more innovation?</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {teams.length === 0 && !isLoading && (
                        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-[#27272a] rounded-[2.5rem] bg-[#121214]/50">
                            <div className="w-16 h-16 rounded-[2rem] bg-indigo-600/10 flex items-center justify-center mb-6">
                                <Rocket className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">No active workspaces</h3>
                            <p className="text-zinc-500 text-sm mt-2 mb-8">Ready to bring your idea to life?</p>
                            <Link href="/create-team">
                                <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl px-8 h-12 font-bold uppercase text-[10px] tracking-widest">
                                    Create First Team
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/10"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
        >
            {icon}
            <span className="text-sm font-semibold">{label}</span>
        </a>
    )
}
