"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinTeamPage({ params: paramsPromise }: { params: Promise<{ inviteCode: string }> }) {
    const params = use(paramsPromise);
    const inviteCode = params.inviteCode;

    const [status, setStatus] = useState<"loading" | "success" | "error" | "requested">("loading");
    const [teamInfo, setTeamInfo] = useState<{ id: string, name: string, projectName: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkInvite = async () => {
            try {
                const res = await fetch(`/api/join/${inviteCode}`);
                if (res.ok) {
                    const data = await res.json();
                    setTeamInfo(data);

                    // If user is already a member, redirect to workspace immediately
                    if (data.alreadyMember) {
                        router.push(`/workspace/${data.id}`);
                        return;
                    }

                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (err) {
                setStatus("error");
            }
        };
        checkInvite();
    }, [inviteCode, router]);


    const handleJoinRequest = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/join/${inviteCode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("requested");
            } else if (res.status === 400 && data.message === "You are already a member of this team") {
                // Already a member → go directly to workspace
                router.push(`/workspace/${teamInfo?.id}`);
            } else if (res.status === 400 && data.message?.includes("pending request")) {
                // Already requested → show pending state
                setStatus("requested");
            } else {
                console.error("Join request failed:", data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-indigo-500/30 font-sans">
            <div className="max-w-md w-full space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">D</div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Joining Team</h1>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">{inviteCode}</p>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-xl space-y-8">
                    {status === "loading" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <p className="text-zinc-500 animate-pulse">Searching for team...</p>
                        </div>
                    )}

                    {status === "success" && teamInfo && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold">{teamInfo.name} Found!</h2>
                                <p className="text-zinc-500">Working on <span className="text-zinc-300 font-bold underline decoration-indigo-500 underline-offset-4">{teamInfo.projectName}</span></p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-600/10 text-xs text-indigo-400 leading-relaxed">
                                    This team requires approval. Once you request to join, the team lead will review your request.
                                </div>
                                <Button
                                    onClick={handleJoinRequest}
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 text-lg flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request to Join"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === "requested" && (
                        <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full mx-auto flex items-center justify-center">
                                <Clock className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">Request Sent!</h2>
                                <p className="text-zinc-500">Your request to join <span className="text-white font-bold">{teamInfo?.name}</span> is pending approval from the team leader.</p>
                            </div>
                            <Button
                                onClick={() => router.push("/dashboard")}
                                variant="outline"
                                className="w-full h-12 border-zinc-800 rounded-xl"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-full mx-auto flex items-center justify-center mb-2">
                                    <XCircle className="w-6 h-6 text-rose-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Invalid Invite</h2>
                                <p className="text-zinc-500">This invite code is expired or does not exist.</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStatus("loading")}
                                    className="w-full h-12 border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-xl"
                                >
                                    Try Again
                                </Button>
                                <Link href="/onboarding" className="text-center text-sm text-indigo-400 hover:underline">
                                    Go back to Onboarding
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-zinc-600 text-xs flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Secure Access Verified
                    </p>
                </div>
            </div>
        </div>
    );
}
