"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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


    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-[400px] space-y-10 relative">
                {/* Branding */}
                <div className="flex flex-col items-center space-y-6">
                    <Link href="/" className="transition-transform hover:scale-105 duration-300">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
                            alt="DevHack Logo"
                            className="h-24 w-auto object-contain"
                        />
                    </Link>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm">Access your innovation hub</p>
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
                                    <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot?</a>
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
