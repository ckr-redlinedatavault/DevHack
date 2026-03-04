"use client";

import { useState } from "react";
import { UserPlus, QrCode, Mail, Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JudgeManager({ eventId, existingJudges }: { eventId: string, existingJudges: any[] }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const addJudge = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/judges`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            if (res.ok) {
                setName(""); setEmail(""); setPassword("");
                router.refresh();
            }
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-8">
            <h2 className="text-sm font-bold flex items-center gap-3 text-zinc-400">
                <UserPlus className="w-5 h-5" /> Credentials Registry
            </h2>

            <form onSubmit={addJudge} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-sm">
                <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500/20 transition-all font-semibold text-white" required />
                <input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500/20 transition-all font-semibold text-white" required />
                <input placeholder="Set Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500/20 transition-all font-semibold text-white" required />
                <button type="submit" disabled={loading} className="bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-xl py-2.5 transition-all shadow-lg shadow-rose-500/10">Authorize Judge</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingJudges.map(j => (
                    <div key={j.id} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="space-y-1">
                            <p className="font-bold text-zinc-100 text-sm leading-tight tracking-tight">{j.name}</p>
                            <p className="text-xs text-zinc-500 font-medium tracking-tight opacity-70 mt-0.5">{j.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`/judge/login?eventId=${eventId}`}
                                target="_blank"
                                className="bg-black/60 border border-white/5 p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:border-rose-500/20 transition-all cursor-pointer"
                                title="Login Portal"
                            >
                                <Key className="w-4 h-4" />
                            </a>
                            <div className="bg-black/60 border border-white/5 p-2 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer opacity-40 group-hover:opacity-100">
                                <QrCode className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
