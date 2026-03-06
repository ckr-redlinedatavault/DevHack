"use client";

import { useEffect, useState, use } from "react";
import {
    Trophy,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventScoringPage({ params: paramsPromise }: { params: Promise<{ eventId: string }> }) {
    const params = use(paramsPromise);
    const eventId = params.eventId;

    const [teams, setTeams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [initialScores, setInitialScores] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchTeams();
    }, [eventId]);

    const fetchTeams = async () => {
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/scoring`);
            if (res.ok) {
                const data = await res.json();
                setTeams(data);

                // Track initial scores for change detection
                const scores: Record<string, number> = {};
                data.forEach((t: any) => scores[t.id] = t.totalScore);
                setInitialScores(scores);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScoreChange = (id: string, value: string) => {
        const num = parseFloat(value);
        if (isNaN(num) && value !== "") return;

        setTeams(prev => prev.map(t =>
            t.id === id ? { ...t, totalScore: value === "" ? 0 : num } : t
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatus(null);

        // Only send changed scores
        const scoresToUpdate = teams.map(t => ({
            registrationId: t.id,
            score: t.totalScore
        }));

        try {
            const res = await fetch(`/api/organizer/events/${eventId}/scoring`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scores: scoresToUpdate })
            });

            if (res.ok) {
                setStatus({ type: 'success', message: "Leaderboard synced successfully!" });
                // Re-fetch to ensure sorting is updated
                await fetchTeams();
            } else {
                setStatus({ type: 'error', message: "Failed to update leaderboard." });
            }
        } catch (err) {
            setStatus({ type: 'error', message: "A system error occurred." });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredTeams = teams.filter(t =>
        t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.leadEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-4 uppercase font-black">
                        Leaderboard Scoring
                        <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[11px] font-bold rounded-full border border-rose-500/20 shadow-lg shadow-rose-500/5">
                            LIVE SYNC
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">Manually update team points. Changes reflect instantly on the public leaderboard.</p>
                </div>

                <div className="flex items-center gap-4">
                    {status && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animate-in zoom-in duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-rose-600/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        SYNC BOARD
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-zinc-950 p-4 border border-white/5 rounded-3xl flex items-center gap-4 group">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-rose-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search teams by name or lead email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all font-medium"
                    />
                </div>
                <div className="px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl text-[10px] uppercase tracking-widest font-black text-rose-500 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" /> {teams.length} Teams
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900/50 border-b border-white/5">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Rank</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Team Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Points</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Adjustment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTeams.map((team, index) => {
                            const initialScore = initialScores[team.id] || 0;
                            const diff = team.totalScore - initialScore;

                            return (
                                <tr key={team.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${index < 3 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-white/5 border-white/10 text-zinc-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-white tracking-tight">{team.teamName}</p>
                                            <p className="text-xs text-zinc-600 font-mono opacity-80">{team.leadEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                                                {team.totalScore}
                                            </span>
                                            {diff !== 0 && (
                                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${diff > 0 ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border border-rose-500/20'
                                                    }`}>
                                                    {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {diff > 0 ? '+' : ''}{diff}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end">
                                            <input
                                                type="number"
                                                value={team.totalScore}
                                                onChange={(e) => handleScoreChange(team.id, e.target.value)}
                                                className="w-24 bg-black border border-white/10 focus:border-rose-500/50 rounded-xl px-4 py-2 text-center text-sm font-bold text-white transition-all hover:border-white/20"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredTeams.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-zinc-700 font-bold text-xs uppercase tracking-widest opacity-40">
                                    No compatible teams discovered
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Legend/Info */}
            <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] flex items-start gap-6">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-rose-500/20">
                    <TrendingUp className="w-6 h-6 text-rose-500" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">Advanced Ranking Algorithm</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium max-w-2xl">
                        The leaderboard is calculated based on these manual points combined with dynamic commit activity and task completion status. Use this panel for final judging or bonus point allocation.
                    </p>
                </div>
            </div>
        </div>
    );
}
