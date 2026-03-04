"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Logo at top left */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/" className="transition-transform hover:scale-105 duration-300">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
                        alt="DevHack Logo"
                        className="h-16 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-[400px] space-y-10 relative">
                {/* Branding */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm font-medium">Access your innovation hub</p>
                    </div>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-indigo-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium text-zinc-400">Password</label>
                                    <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium tracking-tight">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-indigo-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-700 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                            </Button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-xs font-medium">
                                    <span className="bg-[#121214] px-4 text-zinc-600 leading-none">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleSignIn}
                                className="w-full h-11 bg-transparent border-white/5 hover:bg-white/5 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                Sign in with Google
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-zinc-500">
                                    New to DevHack?{" "}
                                    <Link href="/register" className="text-white hover:text-indigo-400 font-medium transition-colors">Create Account</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Subtle Text */}
                <p className="text-center text-[10px] text-zinc-700 font-medium">
                    Secure Authentication Powered by DevHack
                </p>
            </div>
        </div>
    );
}
