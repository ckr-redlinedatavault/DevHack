import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Gavel, Calendar } from "lucide-react";

export default async function EventDashboard({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) redirect("/organizer/login");

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId, organizerId },
        include: {
            registrations: true,
            judges: true,
        },
    });

    if (!event) redirect("/organizer/dashboard");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dev-hack-v2-xi.vercel.app";
    const publicLink = `${appUrl}/event/${event.id}`;

    const stats = [
        { label: "Active Teams", value: event.registrations.filter(r => r.status === "INVITED").length, icon: Users, color: "text-zinc-500", bg: "bg-white/5" },
        { label: "Pending Requests", value: event.registrations.filter(r => r.status === "PENDING").length, icon: Users, color: "text-zinc-500", bg: "bg-white/5" },
        { label: "Judges Panel", value: event.judges.length, icon: Gavel, color: "text-zinc-500", bg: "bg-white/5" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                        Event Overview
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium max-w-xl">{event.description}</p>
                </div>

                <div className="flex items-center gap-3 bg-zinc-950 p-3 border border-white/5 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="pr-2">
                        <p className="text-[10px] text-zinc-600 font-bold leading-none mb-1">Creation Date</p>
                        <p className="text-xs font-semibold text-zinc-400">{new Date(event.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex flex-col gap-3 group hover:border-white/10 transition-all">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center transition-colors group-hover:bg-rose-500/10`}>
                            <stat.icon className={`w-4 h-4 ${stat.color} group-hover:text-rose-500 transition-colors`} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-[11px] font-bold leading-none mb-2">{stat.label}</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="bg-zinc-950 border border-white/5 p-7 rounded-2xl space-y-6">
                    <h3 className="text-sm font-bold text-zinc-400">System Links</h3>
                    <div className="space-y-3">
                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
                            <div className="truncate">
                                <label className="text-[10px] text-zinc-600 font-bold">Public Registration</label>
                                <p className="text-xs text-zinc-500 truncate mt-1">{publicLink}</p>
                            </div>
                            <Link href={publicLink} target="_blank" className="p-2 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-rose-500 rounded-lg transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
                            <div className="truncate">
                                <label className="text-[10px] text-zinc-600 font-bold">Live Scoring Board</label>
                                <p className="text-xs text-zinc-500 truncate mt-1">{publicLink}/leaderboard</p>
                            </div>
                            <Link href={`${publicLink}/leaderboard`} target="_blank" className="p-2 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-rose-500 rounded-lg transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-950 border border-white/5 p-8 rounded-2xl flex flex-col justify-center gap-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-opacity">
                        <Trophy className="w-32 h-32 text-white" />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-lg font-bold text-white tracking-tight leading-none">Event Status</h3>
                        <p className="text-zinc-500 text-sm font-medium max-w-sm leading-relaxed">
                            Mission portal is currently in {event.status.toLowerCase()} mode. Reach out to teams via the broadcast center.
                        </p>
                    </div>
                    <Link
                        href={`/event/${event.id}/live`}
                        target="_blank"
                        className="w-fit bg-white text-black px-6 py-3 rounded-xl font-bold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                        Enter Portal <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
