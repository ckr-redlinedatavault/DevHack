"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Rocket, Users, Trophy, ClipboardList, Send, ArrowRight, Zap, Target, Sparkles } from "lucide-react";
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
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-[#4f46e5]/30 relative overflow-hidden flex flex-col font-sans">
            {/* Logo at top left */}
            <div className="absolute top-10 left-10 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
                        alt="DevHack Logo"
                        className="h-10 w-auto object-contain brightness-125 group-hover:scale-105 transition-all duration-500"
                    />
                </Link>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4f46e5]/5 blur-[160px] rounded-full -z-10 animate-pulse transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4f46e5]/3 blur-[140px] rounded-full -z-10" />

            <div className="max-w-5xl mx-auto w-full space-y-12 relative z-10 pt-20">
                <nav className="flex items-center space-x-3 text-xs font-bold text-zinc-600 mb-10">
                    <Link href="/onboarding" className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                    <span className="text-zinc-800">/</span>
                    <span className="text-[#4f46e5] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#4f46e5]/10 border border-[#4f46e5]/20">Workspace Build</span>
                </nav>

                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex py-1.5 px-4 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/20 text-[#4f46e5] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        Operation Initialize
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">Initiate your mission.</h1>
                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
                        Provision your production environment and establish your team's command center.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    <div className="lg:col-span-2">
                        <div className="bg-[#121214] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/0 via-[#4f46e5]/0 to-[#4f46e5]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <form onSubmit={handleSubmit} className="flex flex-col relative z-20">
                                <div className="p-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-[#4f46e5]/10 border border-[#4f46e5]/20 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-[#4f46e5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl text-white font-bold tracking-tight">Identity Profile</h2>
                                        <p className="text-zinc-500 text-sm font-medium mt-0.5">Core registry for your hackathon deployment.</p>
                                    </div>
                                </div>

                                <div className="p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-[#4f46e5]" /> Team name
                                            </label>
                                            <Input
                                                name="teamName"
                                                placeholder="e.g. Cyber Squad"
                                                required
                                                className="bg-black border-white/5 h-14 focus:border-[#4f46e5]/50 focus:ring-0 text-white rounded-2xl placeholder:text-zinc-800 transition-all font-semibold text-base px-6 shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Rocket className="w-3.5 h-3.5 text-[#4f46e5]" /> Project Title
                                            </label>
                                            <Input
                                                name="projectName"
                                                placeholder="e.g. Quantum Neural Bridge"
                                                required
                                                className="bg-black border-white/5 h-14 focus:border-[#4f46e5]/50 focus:ring-0 text-white rounded-2xl placeholder:text-zinc-800 transition-all font-semibold text-base px-6 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Trophy className="w-3.5 h-3.5 text-zinc-600" /> Target Event
                                            </label>
                                            <Input
                                                name="hackathonName"
                                                placeholder="e.g. Eth Global 2026"
                                                required
                                                className="bg-black border-white/5 h-14 focus:border-[#4f46e5]/50 focus:ring-0 text-white rounded-2xl placeholder:text-zinc-800 transition-all font-semibold text-base px-6 shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-zinc-600" /> Squad capacity
                                            </label>
                                            <Input
                                                name="teamSize"
                                                type="number"
                                                placeholder="4"
                                                required
                                                min="1"
                                                max="10"
                                                className="bg-black border-white/5 h-14 focus:border-[#4f46e5]/50 focus:ring-0 text-white rounded-2xl placeholder:text-zinc-800 transition-all font-semibold text-base px-6 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <ClipboardList className="w-3.5 h-3.5 text-[#4f46e5]" /> Mission Statement
                                        </label>
                                        <Textarea
                                            name="description"
                                            placeholder="Outline your project vision and technical objectives..."
                                            className="bg-black border-white/5 min-h-[160px] focus:border-[#4f46e5]/50 focus:ring-0 text-white rounded-[2rem] p-8 placeholder:text-zinc-800 transition-all font-medium text-sm leading-relaxed resize-none shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-black/20 border-t border-white/5 flex justify-end gap-4 mt-auto">
                                    <Link href="/onboarding" className="px-8 flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                                        Cancel
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black hover:bg-[#4f46e5] hover:text-white px-12 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-indigo-500/10 group/btn"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Initialize Hub
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-10 rounded-[2.5rem] bg-[#121214] border border-white/5 space-y-8 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4f46e5]/5 blur-3xl -z-0" />

                            <h3 className="text-xl font-bold text-white tracking-tight relative z-10 flex items-center gap-4">
                                <span className="w-1.5 h-6 bg-[#4f46e5] rounded-full" />
                                Hub Provisions
                            </h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-5 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0 text-xs font-black text-zinc-600 group-hover/item:border-[#4f46e5]/50 group-hover/item:text-[#4f46e5] transition-all">01</div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">Lead Credentials</p>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Automatic assignment of lead status and admin privileges.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0 text-xs font-black text-zinc-600 group-hover/item:border-[#4f46e5]/50 group-hover/item:text-[#4f46e5] transition-all">02</div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">Invite Relay</p>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Unique cryptographic invite code generated for squad sync.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0 text-xs font-black text-zinc-600 group-hover/item:border-[#4f46e5]/50 group-hover/item:text-[#4f46e5] transition-all">03</div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white">Live Telemetry</p>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Instant connection to global event rankings and dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 space-y-4 relative group">
                            <Sparkles className="absolute top-8 right-8 w-5 h-5 text-[#4f46e5] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                            <h3 className="text-lg font-bold text-white tracking-tight">Pro Tip</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed italic border-l-2 border-[#4f46e5]/30 pl-4">
                                "Synchronizing your team name with your registration ensures seamless telemetry sync."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
