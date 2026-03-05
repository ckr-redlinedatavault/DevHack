"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, GitCommit, FileText, Search, Activity, User } from "lucide-react";
import Link from "next/link";
import { getSession } from "next-auth/react";

interface TeamUpdate {
    id: string;
    teamId: string;
    teamName: string;
    comment: string;
    research: string;
    createdAt: string;
}

export default function OrganizerCommitsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId as string;

    const [updates, setUpdates] = useState<TeamUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventName, setEventName] = useState("");

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                // Fetch event details to ensure access and get event name
                const evRes = await fetch(`/api/organizer/events/${eventId}`);
                if (!evRes.ok) throw new Error("Event not found");
                const evData = await evRes.json();
                setEventName(evData.name);

                // Fetch the event's commit updates
                const res = await fetch(`/api/organizer/events/${eventId}/commits`, {
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error("Failed to load team updates");
                const data = await res.json();
                setUpdates(data.updates || []);
            } catch (err: any) {
                console.error("Error fetching commits:", err);
                setError(err.message || "Failed to load commits");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpdates();
        const interval = setInterval(fetchUpdates, 15000); // Polling every 15s for new updates
        return () => clearInterval(interval);
    }, [eventId, router]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center space-y-4">
                <p className="text-red-500 font-bold">{error}</p>
                <Link href={`/organizer/dashboard/${eventId}`} className="text-rose-500 hover:text-rose-400 font-semibold text-sm">Return to Event</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link href={`/organizer/dashboard/${eventId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Event
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
                                <GitCommit className="w-6 h-6 text-rose-500" /> Team Updates Logging
                            </h1>
                            <p className="text-sm font-medium text-zinc-500">
                                Real-time repository of team research, comments, and task completions submitted for {eventName}.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-sm border border-rose-500/20 uppercase tracking-widest whitespace-nowrap">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-rose-500 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 bg-rose-500"></span>
                            </span>
                            Live Link Active
                        </div>
                    </div>
                </div>

                {/* Commits Container */}
                <div className="space-y-6">
                    {updates.length === 0 ? (
                        <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-[#27272a]">
                                <Activity className="w-8 h-8 text-zinc-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">No Commits Logged</h3>
                                <p className="text-zinc-500 text-sm font-medium">Monitoring incoming data streams...</p>
                            </div>
                        </div>
                    ) : (
                        updates.map((update) => (
                            <div key={update.id} className="bg-[#0d0d0d] border border-[#27272a] hover:border-rose-500/30 rounded-2xl p-6 transition-all shadow-lg group">
                                <div className="space-y-6">
                                    {/* Commit Meta */}
                                    <div className="flex items-start justify-between border-b border-[#27272a] pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                                                <User className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Team</p>
                                                <p className="text-base font-bold text-white tracking-tight">{update.teamName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Timestamp</p>
                                            <p className="text-sm font-medium text-zinc-400 font-mono">
                                                {new Date(update.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Commit Data Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#050505] border border-[#27272a] p-5 rounded-xl space-y-3">
                                            <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-widest">
                                                <FileText className="w-4 h-4" /> Description
                                            </div>
                                            <p className="text-sm font-medium text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                                                {update.comment}
                                            </p>
                                        </div>
                                        <div className="bg-[#050505] border border-[#27272a] p-5 rounded-xl space-y-3">
                                            <div className="flex items-center gap-2 text-sky-500 text-xs font-semibold uppercase tracking-widest">
                                                <Search className="w-4 h-4" /> Research Notes
                                            </div>
                                            <p className="text-sm font-medium text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                                                {update.research}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
