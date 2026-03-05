"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, GitCommit, FileText, Search, Activity, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface HackathonEvent {
    id: string;
    name: string;
}

export default function TeamCommitPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [teamId, setTeamId] = useState<string>("");
    const [teamName, setTeamName] = useState("");
    const [events, setEvents] = useState<HackathonEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [comment, setComment] = useState("");
    const [research, setResearch] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        params.then(p => {
            setTeamId(p.teamId);
        });
    }, [params]);

    useEffect(() => {
        if (!teamId || status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        const fetchTeamData = async () => {
            try {
                // Fetch the team details to ensure access and get hackathon context
                const teamRes = await fetch(`/api/workspace/${teamId}`);
                if (!teamRes.ok) throw new Error("Failed to load team data");
                const teamData = await teamRes.json();
                setTeamName(teamData.team.name);

                // Fetch registered events for this team to populate the dropdown
                const eventsRes = await fetch(`/api/workspace/${teamId}/events`);
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    setEvents(eventsData.events || []);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load Data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!selectedEventId) {
            setError("Please select a target Hackathon Event");
            return;
        }
        if (!comment.trim() || !research.trim()) {
            setError("Please fill out both the commit comment and your research notes");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                eventId: selectedEventId,
                comment,
                research
            };

            const response = await fetch(`/api/workspace/${teamId}/commit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to push commit");
            }

            setSuccessMessage("Update committed to the organizer dashboard successfully!");
            setComment("");
            setResearch("");
            setSelectedEventId("");

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err: any) {
            console.error("Commit error:", err);
            setError(err.message || "Failed to commit update to organizer");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#050505] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#050505] text-white p-6 selection:bg-[#4f46e5]/30">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <GitCommit className="w-6 h-6 text-[#4f46e5]" />
                            Push Update
                        </h1>
                        <p className="text-sm font-medium text-zinc-500">
                            Commit your team's ({teamName}) latest progress directly to the active event organizer dashboard.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4" /> {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {successMessage}
                    </div>
                )}

                <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6 shadow-xl shadow-black/50">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Event Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Target Hackathon</label>
                            <div className="relative">
                                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <select
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                    className="w-full h-12 bg-black border border-[#27272a] focus:border-[#4f46e5]/50 rounded-xl pl-11 pr-4 text-sm font-medium text-white appearance-none outline-none transition-all"
                                >
                                    <option value="" disabled className="text-zinc-600">Select active event...</option>
                                    {events.map((evt) => (
                                        <option key={evt.id} value={evt.id}>
                                            {evt.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {events.length === 0 && (
                                <p className="text-[10px] text-zinc-500 font-medium pl-1 mt-1">
                                    No registered events found. You must be registered for an event to push updates.
                                </p>
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Commit Message</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-[#4f46e5] transition-colors" />
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you build? (e.g., 'Implemented core auth logic and database schema')"
                                    className="w-full bg-black border border-[#27272a] focus:border-[#4f46e5]/50 text-white rounded-xl pl-11 pr-4 py-3 min-h-[100px] resize-y outline-none transition-all placeholder:text-zinc-700 text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Research Notes Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Research & Findings</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-[#4f46e5] transition-colors" />
                                <textarea
                                    value={research}
                                    onChange={(e) => setResearch(e.target.value)}
                                    placeholder="Any major technical research, articles read, or bugs resolved during this phase..."
                                    className="w-full bg-black border border-[#27272a] focus:border-[#4f46e5]/50 text-white rounded-xl pl-11 pr-4 py-3 min-h-[150px] resize-y outline-none transition-all placeholder:text-zinc-700 text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#27272a]">
                            <button
                                type="submit"
                                disabled={isSubmitting || events.length === 0}
                                className="w-full h-11 bg-white hover:bg-zinc-200 text-black rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><GitCommit className="w-4 h-4" /> Push to Organizer Dashboard</>}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}
