"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Rocket, Users, Trophy, ClipboardList, Send, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTeamPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            teamName: formData.get("teamName"),
            projectName: formData.get("projectName"),
            hackathonName: formData.get("hackathonName"),
            teamSize: formData.get("teamSize"),
            description: formData.get("description"),
        };

        try {
            const res = await fetch("/api/create-team", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const result = await res.json();
                router.push(`/workspace/${result.teamId}`);
            } else {
                console.error("Failed to create team");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-rose-500/30 relative overflow-hidden">
            {/* Logo at top left */}
            <div className="absolute top-10 left-10 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-all">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tighter">DevHack</span>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 relative">
                <nav className="flex items-center space-x-3 text-xs font-bold text-zinc-600 mb-10 pt-10">
                    <Link href="/onboarding" className="hover:text-rose-500 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Choice
                    </Link>
                    <span className="text-zinc-800">/</span>
                    <span className="text-rose-500">Workspace Build</span>
                </nav>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">Start your build.</h1>
                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-xl italic">Ready to transform your mission registration into a production-ready workspace.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 relative z-10">
                    <div className="lg:col-span-2">
                        <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="p-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                                    <h2 className="text-xl text-white font-bold tracking-tight">Project Identity</h2>
                                    <p className="text-zinc-500 text-sm font-medium mt-1 opacity-70">Define the core metadata for your hackathon journey.</p>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-zinc-600 ml-1 flex items-center gap-2">
                                                <Users className="w-4 h-4 text-rose-500" /> Team name
                                            </label>
                                            <Input
                                                name="teamName"
                                                placeholder="Quantum Hack"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-rose-500/50 text-white rounded-xl placeholder:text-zinc-800 transition-all font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-zinc-600 ml-1 flex items-center gap-2">
                                                <Rocket className="w-4 h-4 text-white opacity-40" /> Hackathon target
                                            </label>
                                            <Input
                                                name="hackathonName"
                                                placeholder="Summit Event 2026"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-rose-500/50 text-white rounded-xl placeholder:text-zinc-800 transition-all font-medium text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-600 ml-1 flex items-center gap-2">
                                            <ClipboardList className="w-4 h-4 text-rose-500" /> Executive summary
                                        </label>
                                        <Textarea
                                            name="description"
                                            placeholder="What are we solving today?"
                                            className="bg-black border-white/5 min-h-[140px] focus:border-rose-500/50 text-white rounded-3xl p-5 placeholder:text-zinc-800 transition-all font-medium text-sm leading-relaxed resize-y"
                                        />
                                    </div>
                                </div>
                                <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end gap-4 mt-auto">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black hover:bg-rose-500 hover:text-white px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Initialize Workspace</>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 space-y-6 shadow-xl relative overflow-hidden group backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-lg font-bold text-white tracking-tight relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-rose-500" />
                                </div>
                                Setup kit
                            </h3>
                            <ul className="space-y-5 text-zinc-500 text-sm font-medium relative z-10">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-black border border-white/5 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-zinc-600">01</div>
                                    <span className="leading-relaxed">Team lead permission initialized internally.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-black border border-white/5 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-zinc-600">02</div>
                                    <span className="leading-relaxed">Automated invite link generated upon save.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-black border border-white/5 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-zinc-600">03</div>
                                    <span className="leading-relaxed">Sync with mission rankings starts immediately.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-10 rounded-[2.5rem] border border-white/5 space-y-4 bg-transparent hover:bg-zinc-900/40 transition-colors duration-500 group">
                            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-rose-500 transition-colors">Launch guide</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">Ensure your team name matches your event registration for live leaderboard telemetry.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
