"use client";

import Link from "next/link";
import { PlusCircle, Users, ArrowRight, Layout, Rocket } from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30 relative overflow-hidden">
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

            <div className="absolute top-0 inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_50%)]" />

            <div className="max-w-3xl w-full space-y-12 relative">
                <div className="text-center space-y-4">
                    <div className="inline-flex py-1 px-3 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 text-xs font-medium">
                        Welcome to DevHack
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Step into your workspace.</h1>
                    <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
                        Choose how you'd like to start your journey. Create a team from scratch or join an existing one.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                        onClick={() => router.push("/create-team")}
                        className="group relative flex flex-col items-start p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all text-left overflow-hidden shadow-2xl hover:shadow-indigo-500/10"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <PlusCircle className="w-32 h-32" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                            <PlusCircle className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h2 className="text-2xl font-bold text-white">Create a Team</h2>
                            <p className="text-zinc-500 leading-relaxed">
                                Starting a new project? Create a workspace for your team and invite members.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all pt-4 border-t border-zinc-800 w-full">
                            Start Creation <ArrowRight className="w-5 h-5" />
                        </div>
                    </button>

                    <button
                        onClick={() => router.push("/join-team-preview")} // For now, just a placeholder or specific modal
                        className="group relative flex flex-col items-start p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all text-left overflow-hidden shadow-2xl hover:shadow-emerald-500/10"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users className="w-32 h-32" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h2 className="text-2xl font-bold text-white">Join a Team</h2>
                            <p className="text-zinc-500 leading-relaxed">
                                Already have an invite? Enter your code to jump into an existing project.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-emerald-400 font-bold group-hover:gap-4 transition-all pt-4 border-t border-zinc-800 w-full">
                            Enter invite code <ArrowRight className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
