"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Gavel,
    Clock,
    ArrowLeft,
    Activity,
    ExternalLink,
    GitCommit,
    Mail,
    Trophy
} from "lucide-react";

export default function OrganizerSidebar({ eventId, eventName }: { eventId: string, eventName: string }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Summary", href: `/organizer/dashboard/${eventId}`, icon: LayoutDashboard },
        { name: "Team Hub", href: `/organizer/dashboard/${eventId}/teams`, icon: Users },
        { name: "Updates & Commits", href: `/organizer/dashboard/${eventId}/commits`, icon: GitCommit },
        { name: "Judges Panel", href: `/organizer/dashboard/${eventId}/judges`, icon: Gavel },
        { name: "Bulk Invitations", href: `/organizer/dashboard/${eventId}/bulk-invite`, icon: Mail },
        { name: "Leaderboard Scores", href: `/organizer/dashboard/${eventId}/scoring`, icon: Trophy },
        { name: "Live Timeline", href: `/organizer/dashboard/${eventId}/timeline`, icon: Clock },
        { name: "System Controls", href: `/organizer/dashboard/${eventId}/controls`, icon: Activity },
    ];

    return (
        <aside className="w-64 bg-zinc-950/80 border-r border-white/5 flex flex-col fixed inset-y-0 z-40 h-full backdrop-blur-3xl transition-all left-20">
            <div className="p-8 pb-4 space-y-6">
                <Link
                    href="/organizer/dashboard"
                    className="group flex items-center gap-2 text-zinc-600 hover:text-rose-500 transition-colors text-xs font-medium mt-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Hub
                </Link>

                <div className="mt-4 flex flex-col gap-2 pr-4">
                    <h2 className="text-white font-bold text-xl tracking-tight leading-none break-words">{eventName}</h2>
                    <div className="w-6 h-0.5 bg-rose-500/30 rounded-full" />
                </div>
            </div>

            <nav className="flex-grow p-4 space-y-1 pt-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${isActive
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.08)]"
                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-4 h-4 transition-transform ${isActive ? "text-rose-500" : "group-hover:scale-105"}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto mb-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-4">
                    <p className="text-[10px] text-zinc-700 font-semibold px-1">Public access</p>
                    <div className="space-y-1.5">
                        <Link
                            href={`/event/${eventId}`}
                            target="_blank"
                            className="flex items-center justify-between group p-2.5 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 transition-all border border-rose-500/10"
                        >
                            <span className="text-xs font-semibold text-zinc-500 group-hover:text-rose-400">Public Portal</span>
                            <ExternalLink className="w-3 h-3 text-zinc-700 group-hover:text-rose-500" />
                        </Link>
                        <Link
                            href={`/event/${eventId}/leaderboard`}
                            target="_blank"
                            className="flex items-center justify-between group p-2.5 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 transition-all border border-rose-500/10"
                        >
                            <span className="text-xs font-semibold text-zinc-500 group-hover:text-rose-400">Score Board</span>
                            <ExternalLink className="w-3 h-3 text-zinc-700 group-hover:text-rose-500" />
                        </Link>
                    </div>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-[9px] text-zinc-800 font-medium opacity-20">Engine version 2.0</p>
                </div>
            </div>
        </aside>
    );
}
