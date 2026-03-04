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
        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-sky-400" /> Judge Management
            </h2>

            <form onSubmit={addJudge} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                <input placeholder="Judge Name" value={name} onChange={e => setName(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-sky-500" required />
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-sky-500" required />
                <input placeholder="Set Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-sky-500" required />
                <button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-400 text-black font-bold rounded-xl py-2 shadow-lg shadow-sky-500/20 transition-all">Add Judge</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingJudges.map(j => (
                    <div key={j.id} className="bg-black/60 border border-white/5 p-5 rounded-2xl flex items-center justify-between group">
                        <div className="space-y-1">
                            <p className="font-bold text-white leading-none">{j.name}</p>
                            <p className="text-xs text-zinc-500 font-mono">{j.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`/judge/login?eventId=${eventId}`}
                                target="_blank"
                                className="bg-white/5 p-2 rounded-lg hover:bg-sky-500/20 hover:text-sky-400 pt-2 transition-all cursor-pointer"
                                title="Login Portal"
                            >
                                <Key className="w-4 h-4" />
                            </a>
                            <div className="bg-white/5 p-2 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                                <QrCode className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
