"use client";

import { useState, useEffect } from "react";
import { Clock, Rocket, Flag } from "lucide-react";

export default function LiveEventTimer({ startDate, endDate }: { startDate: string | null, endDate: string | null }) {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [status, setStatus] = useState<"WAITING" | "LIVE" | "ENDED">("WAITING");

    useEffect(() => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();

            if (now < start) {
                setStatus("WAITING");
                const diff = start - now;
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else if (now >= start && now <= end) {
                setStatus("LIVE");
                const diff = end - now;
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else {
                setStatus("ENDED");
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate, endDate]);

    if (!timeLeft) return <div className="animate-pulse h-32 bg-white/5 rounded-[2rem] max-w-2xl mx-auto" />;

    return (
        <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-12 shadow-2xl shadow-indigo-500/10 text-center relative overflow-hidden group max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_70%)] opacity-50" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className={`px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 
                    ${status === "WAITING" ? "border-amber-500/20 bg-amber-500/10 text-amber-500" :
                        status === "LIVE" ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" :
                            "border-rose-500/20 bg-rose-500/10 text-rose-500"}`}>

                    {status === "WAITING" && <><Clock className="w-4 h-4" /> Hackathon Starting In</>}
                    {status === "LIVE" && <><Rocket className="w-4 h-4 animate-pulse" /> Live Now - Time Remaining</>}
                    {status === "ENDED" && <><Flag className="w-4 h-4" /> Hackathon Concluded</>}
                </div>

                <div className="grid grid-cols-4 gap-4 md:gap-8 text-center text-white">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-7xl font-bold font-mono tracking-tighter tabular-nums">{String(timeLeft.d).padStart(2, '0')}</span>
                        <span className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-2">Days</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-7xl font-bold font-mono tracking-tighter tabular-nums text-indigo-100">{String(timeLeft.h).padStart(2, '0')}</span>
                        <span className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-2">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-7xl font-bold font-mono tracking-tighter tabular-nums text-indigo-300">{String(timeLeft.m).padStart(2, '0')}</span>
                        <span className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-2">Mins</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-7xl font-bold font-mono tracking-tighter tabular-nums text-indigo-400">{String(timeLeft.s).padStart(2, '0')}</span>
                        <span className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-2">Secs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
