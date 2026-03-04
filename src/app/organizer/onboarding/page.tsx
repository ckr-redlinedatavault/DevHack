"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Globe, Loader2, Rocket, Clock, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function OrganizerOnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data = {
                name: formData.get("name"),
                description: formData.get("description"),
                startDate: formData.get("startDate"),
                endDate: formData.get("endDate"),
            };

            const res = await fetch("/api/organizer/events/create", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const json = await res.json();
                router.push("/organizer/dashboard");
            } else {
                console.error("Failed to create hackathon");
            }
        } catch (error) {
            console.error("error submitting:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-rose-500/30 relative overflow-hidden">
            <div className="absolute top-8 left-8 z-50">
                <Link href="/" className="transition-transform hover:scale-105 duration-300">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-04_at_20.33.46-removebg-preview.png"
                        alt="DevHack Logo"
                        className="h-16 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 relative z-10 pt-16 mt-8">
                <div className="space-y-4">
                    <div className="inline-flex py-1 px-3 rounded-full bg-[#121214] border border-white/5 text-rose-400 text-xs font-bold tracking-wide uppercase">
                        Onboarding Form
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-outfit">Deploy your Hackathon.</h1>
                    <p className="text-zinc-500 text-lg font-medium">Define the core metadata of your event. We will automatically generate your live public registration page instantly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 relative z-10">
                    <div className="lg:col-span-2">
                        <div className="bg-[#121214] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                                    <h2 className="text-xl text-white font-bold tracking-tight">Event Configuration</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                            <Rocket className="w-4 h-4 text-rose-400" /> Hackathon Name
                                        </label>
                                        <Input
                                            name="name"
                                            placeholder="Global AI Challenge 2026"
                                            required
                                            className="bg-black border-white/5 h-12 focus:border-rose-500/50 text-white rounded-xl placeholder:text-zinc-800 transition-all font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-emerald-400" /> Start Date & Time
                                            </label>
                                            <Input
                                                name="startDate"
                                                type="datetime-local"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-rose-500/50 text-white rounded-xl placeholder:text-zinc-800 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-indigo-400" /> End Date & Time
                                            </label>
                                            <Input
                                                name="endDate"
                                                type="datetime-local"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-rose-500/50 text-white rounded-xl placeholder:text-zinc-800 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-sky-400" /> Public Description
                                        </label>
                                        <Textarea
                                            name="description"
                                            placeholder="Describe the rules, objectives, and prizes. Team leads will see this on the public registration page..."
                                            className="bg-black border-white/5 min-h-[140px] focus:border-rose-500/50 text-white rounded-2xl p-4 placeholder:text-zinc-800 transition-all font-medium resize-y"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-black/20 border-t border-white/5 flex justify-end gap-4 mt-auto">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black hover:bg-zinc-200 px-8 h-12 rounded-xl font-bold shadow-lg shadow-white/5 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Instantiate Event</>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-[2rem] bg-[#121214] border border-white/5 space-y-5 shadow-xl shadow-black/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-lg font-bold text-white tracking-tight relative z-10 flex items-center gap-2">Admin Engine</h3>
                            <ul className="space-y-4 text-zinc-500 text-sm font-medium relative z-10">
                                <li><strong>1. Create:</strong> Fill out metadata</li>
                                <li><strong>2. Share:</strong> Get public URL instantly</li>
                                <li><strong>3. Accept:</strong> Mail invites to team leads</li>
                                <li><strong>4. Launch:</strong> Global Live timer starts</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
