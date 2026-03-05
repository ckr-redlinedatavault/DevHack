"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowRight, ShieldCheck, Search } from "lucide-react";

export default function JoinTeamPreviewPage() {
    const [inviteCode, setInviteCode] = useState("");
    const router = useRouter();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        let code = inviteCode.trim();

        // Extract code if user pasted a full URL link (e.g. https://website.com/join/XYZ)
        if (code.includes("/join/")) {
            code = code.split("/join/").pop() || code;
        }

        if (code) {
            router.push(`/join/${code.toUpperCase()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-emerald-500/30 relative overflow-hidden flex flex-col pt-32 md:pt-40">
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

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-xl mx-auto w-full space-y-10 relative z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500 mb-8 max-w-xl mx-auto">
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <span className="text-zinc-700">/</span>
                    <Link href="/onboarding" className="hover:text-white transition-colors">
                        Onboarding
                    </Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-emerald-400">Join Team</span>
                </nav>

                <div className="space-y-4 max-w-xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-outfit">Join a workspace.</h1>
                    <p className="text-zinc-500 text-lg font-medium">
                        Enter the unique invite code shared by your project lead to access the workspace.
                    </p>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 group max-w-xl mx-auto relative">
                    {/* Subtle hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                            <Users className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300" />
                        </div>
                        <div>
                            <h2 className="text-xl text-white font-bold tracking-tight">Access portal</h2>
                            <p className="text-zinc-500 text-sm font-medium mt-1">Provide your workspace credentials.</p>
                        </div>
                    </div>

                    <form onSubmit={handleJoin} className="flex flex-col relative z-10">
                        <div className="p-8 space-y-4">
                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                <Search className="w-4 h-4 text-emerald-400" /> Invite code
                            </label>
                            <input
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="e.g. ABCD123"
                                className="w-full h-14 bg-black border border-white/5 focus:border-emerald-500/50 rounded-xl px-6 text-lg font-mono tracking-widest uppercase transition-all placeholder:text-zinc-800 text-white outline-none"
                                required
                            />
                        </div>

                        <div className="p-6 bg-black/20 border-t border-white/5 flex flex-col gap-4">
                            <button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-xl font-bold shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Enter Workspace <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                            </button>
                            <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" /> Secure end-to-end encrypted project access
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
