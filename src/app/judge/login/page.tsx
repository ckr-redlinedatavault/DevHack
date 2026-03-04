"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldCheck, Mail, Loader2, Trophy } from "lucide-react";
import Link from "next/link";

function JudgeLoginForm() {
    const searchParams = useSearchParams();
    const eventIdParam = searchParams.get("eventId") || "";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [eventId, setEventId] = useState(eventIdParam);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/judge/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, eventId }),
            });
            if (res.ok) {
                router.push("/judge/dashboard");
            } else {
                setError("Invalid login for this event.");
            }
        } catch (e) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                        <Trophy className="w-8 h-8 text-sky-400" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Judge Portal</h1>
                    <p className="text-zinc-500 font-medium">Authenticating scoring authority...</p>
                </div>

                <div className="bg-[#121214] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    {/* Decorative subtle pulse */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/5 blur-[80px] rounded-full group-hover:bg-sky-500/10 transition-colors" />

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest pl-1">Event Reference</label>
                            <input
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-zinc-300 font-mono text-sm focus:border-sky-500/50 outline-none transition-all"
                                placeholder="Public Event ID"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest pl-1">Judge Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-zinc-300 focus:border-sky-500/50 outline-none transition-all placeholder:text-zinc-700"
                                    placeholder="your-email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest pl-1">Secret Key</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-zinc-300 focus:border-sky-500/50 outline-none transition-all placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-bold animate-shake text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-500 hover:bg-sky-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            Grant Access
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <Link href="/" className="text-sm text-zinc-600 font-bold hover:text-white transition-colors">Return to Home Portal</Link>
                </div>
            </div>
        </div>
    );
}

export default function JudgeLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>}>
            <JudgeLoginForm />
        </Suspense>
    );
}
