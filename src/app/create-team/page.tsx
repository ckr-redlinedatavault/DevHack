"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Rocket, Users, Trophy, ClipboardList, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-indigo-500/30 relative overflow-hidden">
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

            <div className="max-w-4xl mx-auto space-y-8 relative">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group mb-8 font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to onboarding
                </button>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Set up your workspace.</h1>
                    <p className="text-zinc-500 text-lg font-medium">Define the mission and rally your team members.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                    <div className="lg:col-span-2">
                        <Card className="bg-[#121214] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
                            <form onSubmit={handleSubmit}>
                                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                    <CardTitle className="text-2xl text-white font-bold">Project Details</CardTitle>
                                    <CardDescription className="text-zinc-500 font-medium">Provide the foundational information for your team.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Team Name
                                            </label>
                                            <Input
                                                name="teamName"
                                                placeholder="Team Alpha"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-indigo-500/50 text-white rounded-xl placeholder:text-zinc-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Rocket className="w-4 h-4" /> Project Name
                                            </label>
                                            <Input
                                                name="projectName"
                                                placeholder="Smart Waste Guard"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-indigo-500/50 text-white rounded-xl placeholder:text-zinc-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Trophy className="w-4 h-4" /> Hackathon Name
                                            </label>
                                            <Input
                                                name="hackathonName"
                                                placeholder="Global AI Summit 2026"
                                                required
                                                className="bg-black border-white/5 h-12 focus:border-indigo-500/50 text-white rounded-xl placeholder:text-zinc-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Team Size
                                            </label>
                                            <Input
                                                name="teamSize"
                                                type="number"
                                                max={10}
                                                defaultValue={4}
                                                className="bg-black border-white/5 h-12 focus:border-indigo-500/50 text-white rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1 flex items-center gap-2">
                                            <ClipboardList className="w-4 h-4" /> Project Description
                                        </label>
                                        <Textarea
                                            name="description"
                                            placeholder="Briefly describe what you are building during the hackathon..."
                                            className="bg-black border-white/5 min-h-[120px] focus:border-indigo-500/50 text-white rounded-2xl p-4 placeholder:text-zinc-800"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-end gap-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black hover:bg-zinc-200 px-8 h-12 rounded-xl font-bold shadow-lg shadow-white/5 transition-all flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Finalize & Create</>}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 space-y-4">
                            <h3 className="text-xl font-bold text-indigo-400">Team Lead Kit</h3>
                            <ul className="space-y-3 text-zinc-500 text-sm font-medium">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</div>
                                    <span>Invite link will be generated instantly.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</div>
                                    <span>You'll be assigned as the Team Lead.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</div>
                                    <span>Workspace modules will be initialized.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-[2rem] border border-white/5 space-y-4 bg-white/[0.01]">
                            <h3 className="text-xl font-bold text-zinc-300">Need Help?</h3>
                            <p className="text-zinc-500 text-sm font-medium">Check our hackathon strategy guide for tips on setting up your project roadmap.</p>
                            <a href="#" className="text-white text-sm font-bold hover:underline inline-block mt-2">View Strategy Guide →</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
