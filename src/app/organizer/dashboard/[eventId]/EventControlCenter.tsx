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
        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-rose-500" />
                    <h2 className="text-xl font-bold text-white text-pretty">Organizer Control Center</h2>
                </div>
                <div className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Live Controls
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Event Status */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Global Status</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["UPCOMING", "LIVE", "JUDGING", "ENDED"].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatus(s); updateEvent({ status: s }); }}
                                disabled={loading}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${status === s ? "bg-rose-500 text-white" : "bg-black border border-white/5 text-zinc-500 hover:border-rose-500/30"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Phase */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Round / Phase</label>
                    <div className="flex gap-2">
                        <input
                            value={phase}
                            onChange={(e) => setPhase(e.target.value)}
                            onBlur={() => updateEvent({ currentPhase: phase })}
                            className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm text-white w-full outline-none focus:border-rose-500/50"
                            placeholder="e.g. Hacking, Finals"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-zinc-600 font-bold">
                        {["Opening", "Hacking", "Judging", "Announcing"].map(p => (
                            <button key={p} onClick={() => { setPhase(p); updateEvent({ currentPhase: p }); }} className="bg-white/5 px-2 py-1 rounded-md hover:text-white transition-colors">{p}</button>
                        ))}
                    </div>
                </div>

                {/* Revelation Mode */}
                <div className="space-y-4">
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest text-pretty">Ceremony Reveal Mode</label>
                    <button
                        onClick={() => { setIsRevealing(!isRevealing); updateEvent({ isRevealing: !isRevealing }); }}
                        disabled={loading}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isRevealing
                                ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                : "bg-black border-white/5 text-zinc-500"
                            }`}
                    >
                        <span className="font-bold flex items-center gap-2">
                            {isRevealing ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            {isRevealing ? "REVEAL ACTIVE" : "STAY HIDDEN"}
                        </span>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${isRevealing ? 'bg-amber-500' : 'bg-zinc-800'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isRevealing ? 'right-1' : 'left-1'}`} />
                        </div>
                    </button>
                    <p className="text-[10px] text-zinc-600">Reveal mode forces audience screen to hold results until ceremony reveal.</p>
                </div>
            </div>
        </div>
    );
}
