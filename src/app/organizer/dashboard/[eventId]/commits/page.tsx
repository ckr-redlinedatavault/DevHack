"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, GitCommit, FileText, Search, Activity, User, Star, ChevronRight } from "lucide-react";
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

    const [rewardingUpdateId, setRewardingUpdateId] = useState<string | null>(null);
    const [rewardPoints, setRewardPoints] = useState<number>(5);
    const [isRewarding, setIsRewarding] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [realTime, setRealTime] = useState("");

    const handleReward = async (teamName: string, updateId: string) => {
        if (!rewardPoints) return;
        setIsRewarding(true);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/commits/reward`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamName, points: rewardPoints })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to reward points");
            }

            alert(`Successfully awarded ${rewardPoints} points to ${teamName}!`);
            setRewardingUpdateId(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsRewarding(false);
        }
    };

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                setEventName("Event");

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

        // Polling every 15s for new updates
        const fetchInterval = setInterval(() => {
            fetchUpdates();
            setCountdown(15);
        }, 15000);

        // Ticking every 1s for the clock UI
        const tickInterval = setInterval(() => {
            setCountdown((prev) => (prev > 1 ? prev - 1 : 15));
            setRealTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);

        setRealTime(new Date().toLocaleTimeString('en-US', { hour12: false }));

        return () => {
            clearInterval(fetchInterval);
            clearInterval(tickInterval);
        };
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
                        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                            {/* Sharp Edged Real-Time Timer & Countdown */}
                            <div className="flex items-center border border-[#27272a] bg-[#0a0a0a] text-[10px] font-mono tracking-widest text-zinc-500 uppercase whitespace-nowrap overflow-hidden">
                                <div className="px-3 py-1.5 border-r border-[#27272a] text-white">
                                    {realTime || "00:00:00"}
                                </div>
                                <div className="px-2 py-1.5 flex items-center gap-1.5 min-w-fit">
                                    Refresh <span className="text-rose-500 w-3 text-center">{countdown}</span>s
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-sm border border-rose-500/20 uppercase tracking-widest whitespace-nowrap">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full bg-rose-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 bg-rose-500"></span>
                                </span>
                                Live Sync
                            </div>
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

                                    {/* Action Bar */}
                                    <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                                        {rewardingUpdateId === update.id ? (
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300 w-full">
                                                <input
                                                    type="number"
                                                    value={rewardPoints}
                                                    onChange={(e) => setRewardPoints(Number(e.target.value))}
                                                    className="bg-black border border-[#27272a] rounded-lg h-9 px-3 w-24 text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500/50"
                                                    min="1"
                                                    max="100"
                                                />
                                                <button
                                                    onClick={() => handleReward(update.teamName, update.id)}
                                                    disabled={isRewarding}
                                                    className="h-9 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                                                >
                                                    {isRewarding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Points"}
                                                </button>
                                                <button
                                                    onClick={() => setRewardingUpdateId(null)}
                                                    className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg text-sm font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRewardingUpdateId(update.id)}
                                                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 text-sm font-semibold transition-colors group/reward"
                                            >
                                                <Star className="w-4 h-4 group-hover/reward:fill-emerald-400/20" /> Reward Points via Commits
                                            </button>
                                        )}
                                        {rewardingUpdateId !== update.id && (
                                            <div className="flex items-center gap-1 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                                                Quick Actions <ChevronRight className="w-4 h-4" />
                                            </div>
                                        )}
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
