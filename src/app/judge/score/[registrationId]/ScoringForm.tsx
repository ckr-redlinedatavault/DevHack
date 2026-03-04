"use client";

import { useState } from "react";
import { Star, ShieldCheck, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ScoringProps {
    registrationId: string;
    teamName: string;
    initialScore?: {
        innovation: number;
        implementation: number;
        design: number;
        impact: number;
        comment: string | null;
    };
}

export default function ScoringForm({ registrationId, teamName, initialScore }: ScoringProps) {
    const [innovation, setInnovation] = useState(initialScore?.innovation || 5);
    const [implementation, setImplementation] = useState(initialScore?.implementation || 5);
    const [design, setDesign] = useState(initialScore?.design || 5);
    const [impact, setImpact] = useState(initialScore?.impact || 5);
    const [comment, setComment] = useState(initialScore?.comment || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const metrics = [
        { label: "Innovation", value: innovation, setter: setInnovation, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
        { label: "Implementation", value: implementation, setter: setImplementation, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
        { label: "Design", value: design, setter: setDesign, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
        { label: "Impact", value: impact, setter: setImpact, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/judge/score/${registrationId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ innovation, implementation, design, impact, comment }),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/judge/dashboard");
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-6 group hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">{m.label}</label>
                            <span className={`px-4 py-1.5 rounded-xl font-black text-lg border ${m.color}`}>
                                {m.value}/10
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={m.value}
                            onChange={(e) => m.setter(parseInt(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-700 font-black uppercase tracking-widest">
                            <span>Poor</span>
                            <span>Outstanding</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Judicial Comments (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-sky-500/50 transition-all min-h-[120px] placeholder:text-zinc-800"
                    placeholder="Provide specific feedback or internal notes for this team's project..."
                />
            </div>

            <div className="flex items-center justify-between gap-6">
                <Link
                    href="/judge/dashboard"
                    className="px-8 py-4 rounded-2xl border border-white/5 text-zinc-500 font-bold hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading || success}
                    className={`flex-grow py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl transition-all ${success
                            ? "bg-emerald-500 text-black"
                            : "bg-sky-500 text-black hover:bg-sky-400 shadow-sky-500/20"
                        }`}
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> :
                        success ? <CheckCircle2 className="w-6 h-6 animate-bounce" /> : <ShieldCheck className="w-6 h-6" />}
                    {success ? "Scores Finalized" : "Submit Final Score"}
                </button>
            </div>
        </form>
    );
}
