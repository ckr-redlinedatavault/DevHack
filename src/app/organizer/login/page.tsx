"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OrganizerLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");

            const res = await fetch("/api/organizer/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                router.push("/organizer/dashboard");
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
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 selection:bg-rose-500/30 relative overflow-hidden">
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-rose-600/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-[400px] space-y-10 relative">
                {/* Branding */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="inline-flex py-1 px-3 rounded-full bg-[#121214] border border-white/5 text-rose-400 text-xs font-bold tracking-wide uppercase">
                        Organizer Portal
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Welcome Admin</h1>
                        <p className="text-zinc-500 text-sm font-medium">Manage your hackathons from mission control.</p>
                    </div>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Admin Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-rose-500 transition-colors" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-rose-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-rose-500 transition-colors" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-black border-white/5 focus:border-rose-500/50 text-white rounded-xl pl-11 transition-all placeholder:text-zinc-700 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-zinc-500 font-medium">
                        Need an admin account?{" "}
                        <Link href="/organizer/register" className="text- rose-400 hover:text-rose-300 font-bold transition-colors">
                            Apply here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
