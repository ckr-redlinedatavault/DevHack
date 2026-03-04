"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const data = await res.json();
                setError(data.message || "Invalid credentials");
            }
        } catch (err: any) {
            setError("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-rose-500/30 relative overflow-hidden">
            {/* Logo at top left */}
            <div className="absolute top-10 left-10 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-all">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tighter">DevHack</span>
                </Link>
            </div>

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.01] blur-[150px] rounded-full -z-10" />

            <div className="w-full max-w-[400px] space-y-12 relative">
                <div className="flex flex-col items-center space-y-4">
                    <div className="inline-flex py-1 px-3 rounded-full bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Identity Verification
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-white leading-tight">Welcome Back.</h1>
                        <p className="text-zinc-500 text-sm font-medium italic opacity-70">Initialize your secure mission control session.</p>
                    </div>
                </div>

                <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 ml-1 uppercase tracking-widest leading-none">Access Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-rose-500 transition-colors" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="john@devhack.com"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-rose-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-800 text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Credential Key</label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[10px] text-rose-500 hover:text-rose-400 font-black uppercase tracking-widest transition-colors"
                                    >
                                        Recover
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-rose-500 transition-colors" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-rose-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-800 text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6 pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-white text-black hover:bg-rose-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Access"}
                            </Button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-[#0c0c0e] px-4 text-[10px] font-black text-zinc-800 uppercase tracking-widest">Alt Relay</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleSignIn}
                                className="w-full h-12 bg-black hover:bg-white hover:text-black text-zinc-400 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                Google Auth
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                                    New operative?{" "}
                                    <Link href="/register" className="text-white hover:text-rose-500 transition-colors">Apply Registration</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                <p className="text-center text-[10px] text-zinc-800 font-black uppercase tracking-[0.4em] opacity-40">
                    Security Layer L3-A
                </p>
            </div>
        </div>
    );
}
