"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, CheckCircle2, CircleDashed, Loader2, Lock, Eye } from "lucide-react";

export default function LiveLeaderboard({ eventId }: { eventId: string }) {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [status, setStatus] = useState("");
    const [isRevealing, setIsRevealing] = useState(false);
    const [currentPhase, setCurrentPhase] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`/api/event/${eventId}/leaderboard`);
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
        const interval = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(interval);
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
            <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center text-zinc-500 font-medium shadow-2xl">
                No active teams on the leaderboard yet.
            </div>
        );
    }

    const isJudging = status === "JUDGING" || status === "ENDED";

    return (
        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/40">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <Trophy className="w-6 h-6 text-amber-500" /> Event Leaderboard
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        Scoring Mode: {isJudging ? "Judicial Evaluation Average" : "Real-time Task Completion"}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 absolute"></span>
                    <span className="ml-2 pl-2 border-l border-indigo-500/30">Live Syncing</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/20 text-xs uppercase tracking-widest text-zinc-500">
                            <th className="px-6 py-5 font-bold">Rank</th>
                            <th className="px-6 py-5 font-bold">Team Name</th>
                            <th className="px-6 py-5 font-bold">
                                {isJudging ? "Jury Score" : "Task Score"}
                            </th>
                            <th className="px-6 py-5 font-bold">Development Progress</th>
                            <th className="px-6 py-5 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-medium">
                        {leaderboard.map((team) => (
                            <tr key={team.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        {team.rank === 1 && <Medal className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                                        {team.rank === 2 && <Medal className="w-6 h-6 text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,216,0.3)]" />}
                                        {team.rank === 3 && <Medal className="w-6 h-6 text-amber-700" />}
                                        <span className={`font-black text-xl ${team.rank <= 3 ? 'text-white' : 'text-zinc-600'}`}>
                                            #{team.rank}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-bold text-lg text-white">{team.teamName}</td>
                                <td className="px-6 py-6">
                                    <span className={`px-4 py-2 rounded-xl border font-mono font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 ${isJudging
                                            ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                                            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                        }`}>
                                        {isJudging ? team.judgeScore.toFixed(2) : team.dynamicScore} PTS
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-zinc-400 font-bold">
                                    {team.tasksCompleted} Tasks Complete
                                </td>
                                <td className="px-6 py-6">
                                    {team.hasSubmission ? (
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl w-fit border border-emerald-500/20 text-[10px] uppercase tracking-widest leading-none">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Project Sent
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-zinc-500 font-bold px-3 py-1.5 rounded-xl w-fit text-[10px] uppercase tracking-widest leading-none">
                                            <CircleDashed className="w-3.5 h-3.5 animate-spin-slow" /> Building
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
