"use client";

import Link from "next/link";
import { PlusCircle, Users, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();

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

            {/* Premium Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.02] blur-[150px] rounded-full -z-10" />

            <div className="w-full max-w-[800px] space-y-12 relative z-10">
                <div className="flex flex-col items-center space-y-4">
                    <div className="inline-flex py-1.5 px-4 rounded-full bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        Registration Success
                    </div>
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Step into your workspace.</h1>
                        <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
                            Finalize your landing by setting up your project workspace or joining an existing squad.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Team Card */}
                    <button
                        onClick={() => router.push("/create-team")}
                        className="group relative flex flex-col p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-rose-500/30 transition-all text-left overflow-hidden shadow-2xl backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-500 group-hover:border-rose-500 transition-all duration-500 shadow-xl shadow-rose-500/0 group-hover:shadow-rose-500/20">
                            <PlusCircle className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors duration-500" />
                        </div>

                        <div className="space-y-4 relative z-10 flex-grow">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Initiate Mission</h2>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Create a blank canvas for your innovation. Setup your team goals and invite collaborators.
                            </p>
                        </div>

                        <div className="mt-10 flex items-center gap-2 text-rose-500 text-xs font-bold transition-all pt-6 border-t border-white/5 w-full uppercase tracking-widest">
                            Continue creation
                            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Join Team Card */}
                    <button
                        onClick={() => router.push("/join-team-preview")}
                        className="group relative flex flex-col p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-white/20 transition-all text-left overflow-hidden shadow-2xl backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-xl shadow-white/0">
                            <Users className="w-6 h-6 text-zinc-500 group-hover:text-black transition-colors duration-500" />
                        </div>

                        <div className="space-y-4 relative z-10 flex-grow">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Sync Existing</h2>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Received a join code? Enter the relay portal to access your existing project dashboard.
                            </p>
                        </div>

                        <div className="mt-10 flex items-center gap-2 text-white/50 text-xs font-bold transition-all pt-6 border-t border-white/5 w-full uppercase tracking-widest hover:text-white">
                            Enter code
                            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

                <p className="text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.4em] pt-12 opacity-30">
                    Operation Engine v2.0
                </p>
            </div>
        </div>
    );
}
