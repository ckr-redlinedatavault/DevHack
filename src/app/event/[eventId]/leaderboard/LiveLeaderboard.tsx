"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, CheckCircle2, CircleDashed, Loader2, Lock, Eye, Hand } from "lucide-react";

export default function LiveLeaderboard({ eventId }: { eventId: string }) {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [status, setStatus] = useState("");
    const [isRevealing, setIsRevealing] = useState(false);
    const [currentPhase, setCurrentPhase] = useState("");
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(10);
    const [realTime, setRealTime] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`/api/event/${eventId}/leaderboard?_t=${Date.now()}`, {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data.leaderboard);
                    setStatus(data.status);
                    setIsRevealing(data.isRevealing);
                    setCurrentPhase(data.currentPhase);
                }
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        const fetchInterval = setInterval(() => {
            fetchLeaderboard();
            setCountdown(10);
        }, 10000);

        const tickInterval = setInterval(() => {
            setCountdown((prev) => (prev > 1 ? prev - 1 : 10));
            setRealTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);

        // initial clock set
        setRealTime(new Date().toLocaleTimeString('en-US', { hour12: false }));

        return () => {
            clearInterval(fetchInterval);
            clearInterval(tickInterval);
        };
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    // Reveal Mode Overlay
    if (isRevealing) {
        return (
            <div className="bg-[#121214] border border-amber-500/20 rounded-3xl p-16 text-center space-y-8 shadow-[0_0_100px_rgba(245,158,11,0.05)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse">
                        <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Results Embargo</h2>
                        <p className="text-zinc-500 font-medium max-w-md mx-auto text-pretty">The organizer has enabled <span className="text-amber-500 uppercase font-black">Ceremony Mode</span>. Rankings are frozen and hidden until the live stage reveal.</p>
                    </div>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400">
                        <Eye className="w-4 h-4 text-sky-400" /> Standby for {currentPhase || "Closing Ceremony"}
                    </div>
                </div>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-8 text-center text-zinc-500 text-sm font-medium">
                No active teams on the leaderboard yet.
            </div>
        );
    }

    const isJudging = status === "JUDGING" || status === "ENDED";

    return (
        <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl overflow-hidden font-sans">
            <div className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] bg-[#050505]">
                <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
                        <Trophy className="w-4 h-4 text-zinc-400" /> Live Rankings
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                        {isJudging ? "Judicial Evaluation Average" : "Real-time Task Completion"}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {/* Sharp Edged Real-Time Timer & Countdown */}
                    <div className="flex items-center border border-[#27272a] bg-[#0a0a0a] text-[10px] font-mono tracking-widest text-zinc-500 uppercase whitespace-nowrap overflow-hidden">
                        <div className="px-3 py-1.5 border-r border-[#27272a] text-white">
                            {realTime || "00:00:00"}
                        </div>
                        <div className="px-2 py-1.5 flex items-center gap-1.5 min-w-fit">
                            Update in <span className="text-[#4f46e5] w-3 text-center">{countdown}</span>s
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-[#4f46e5] bg-[#4f46e5]/10 px-3 py-1.5 rounded-sm border border-[#4f46e5]/20 uppercase tracking-widest whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-[#4f46e5] opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 bg-[#4f46e5]"></span>
                        </span>
                        Live Sync
                    </div>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest border-b border-[#27272a] mb-2">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-4">Team</div>
                    <div className="col-span-2 text-center">{isJudging ? "Jury Score" : "Score"}</div>
                    <div className="col-span-3 text-center">Progress</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {/* Team Rows */}
                {leaderboard.map((team) => (
                    <div key={team.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center bg-[#0d0d0d] hover:bg-[#121214] border border-[#27272a] hover:border-[#4f46e5]/40 rounded-xl transition-all group group-hover:shadow-[0_0_10px_rgba(79,70,229,0.1)]">
                        {/* Rank */}
                        <div className="col-span-1 flex justify-center items-center">
                            {team.rank === 1 ? (
                                <Medal className="w-4 h-4 text-yellow-500" />
                            ) : team.rank === 2 ? (
                                <Medal className="w-4 h-4 text-zinc-300" />
                            ) : team.rank === 3 ? (
                                <Medal className="w-4 h-4 text-amber-700" />
                            ) : (
                                <span className="text-xs font-semibold text-zinc-600">
                                    {team.rank}
                                </span>
                            )}
                        </div>

                        {/* Team Name */}
                        <div className="col-span-4 font-semibold text-sm text-zinc-100 group-hover:text-white transition-colors truncate pr-2">
                            {team.teamName}
                        </div>

                        {/* Score */}
                        <div className="col-span-2 flex justify-center">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border inline-flex ${isJudging
                                ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                                : "bg-[#4f46e5]/10 border-[#4f46e5]/20 text-[#4f46e5]"
                                }`}>
                                {isJudging ? team.judgeScore.toFixed(2) : team.dynamicScore} PTS
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="col-span-3 flex justify-center text-xs font-medium text-zinc-400">
                            {team.tasksCompleted} Tasks
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                            {team.handRaised && (
                                <div className="flex items-center gap-1.5 text-rose-500 animate-pulse bg-rose-500/10 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border border-rose-500/20">
                                    <Hand className="w-3 h-3 fill-rose-500" /> Help
                                </div>
                            )}
                            {team.hasSubmission ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-[9px] font-semibold uppercase tracking-wider border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3" /> Sent
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-zinc-500 bg-zinc-900 border border-[#27272a] px-2 py-1 rounded text-[9px] font-semibold uppercase tracking-wider">
                                    <CircleDashed className="w-3 h-3 animate-spin-slow" /> Dev
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
