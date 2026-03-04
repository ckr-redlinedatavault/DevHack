"use client";

import { useState } from "react";
import { Settings, Play, Pause, Eye, EyeOff, LayoutPanelTop } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventControlCenter({ eventId, initialStatus, initialPhase, initialReveal }: {
    eventId: string,
    initialStatus: string,
    initialPhase: string,
    initialReveal: boolean
}) {
    const [status, setStatus] = useState(initialStatus);
    const [phase, setPhase] = useState(initialPhase);
    const [isRevealing, setIsRevealing] = useState(initialReveal);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const updateEvent = async (data: any) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-zinc-500" />
                    <h2 className="text-lg font-bold text-white tracking-tight">System Controls</h2>
                </div>
                <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold transition-all">
                    Active System
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Event Status */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-600 font-bold">Lifecycle Status</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["UPCOMING", "LIVE", "JUDGING", "ENDED"].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatus(s); updateEvent({ status: s }); }}
                                disabled={loading}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${status === s ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/10" : "bg-black border-white/5 text-zinc-500 hover:border-white/20"
                                    }`}
                            >
                                {s.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Phase */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-600 font-bold">Active Phase</label>
                    <div className="flex gap-2">
                        <input
                            value={phase}
                            onChange={(e) => setPhase(e.target.value)}
                            onBlur={() => updateEvent({ currentPhase: phase })}
                            className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm text-white w-full outline-none focus:border-rose-500/40 transition-all font-medium"
                            placeholder="e.g. Round 1"
                        />
                    </div>
                </div>

                {/* Revelation Mode */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-600 font-bold">Reveal Protocol</label>
                    <button
                        onClick={() => { setIsRevealing(!isRevealing); updateEvent({ isRevealing: !isRevealing }); }}
                        disabled={loading}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isRevealing
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-black border-white/5 text-zinc-500 hover:border-white/20"
                            }`}
                    >
                        <span className="font-bold text-xs flex items-center gap-2 tracking-tight">
                            {isRevealing ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {isRevealing ? "Reveal Active" : "Leaderboard Hidden"}
                        </span>
                    </button>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-2">Manage audience-facing state.</p>
                </div>
            </div>
        </div>
    );
}
