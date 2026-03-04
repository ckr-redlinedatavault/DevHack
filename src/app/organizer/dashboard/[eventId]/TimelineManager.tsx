"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Clock } from "lucide-react";

export default function TimelineManager({ eventId, existingTimelines }: { eventId: string, existingTimelines: any[] }) {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !time) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/timeline`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, time }),
            });

            if (res.ok) {
                setTitle("");
                setTime("");
                router.refresh();
            } else {
                alert("Failed to add timeline event");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-10">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <Clock className="w-5 h-5 text-zinc-500" />
                <h2 className="text-sm font-bold text-white tracking-tight">Timeline Chronicle</h2>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="E.g., Opening Ceremony"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="flex-1 bg-black border border-white/5 focus:border-rose-500/20 text-white rounded-xl px-5 py-3 text-sm outline-none transition-all placeholder:text-zinc-700 font-semibold"
                />
                <input
                    type="datetime-local"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="flex-1 bg-black border border-white/5 focus:border-rose-500/20 text-white rounded-xl px-5 py-3 text-sm outline-none transition-all md:max-w-xs font-semibold"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-rose-500 text-white hover:bg-rose-400 px-8 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 whitespace-nowrap shadow-lg shadow-rose-500/10"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Entry
                </button>
            </form>

            <div className="space-y-3 pt-6">
                {existingTimelines.length === 0 ? (
                    <div className="text-center py-20 text-zinc-700 font-bold text-xs bg-black/50 rounded-2xl border border-white/5 opacity-40">
                        Registry empty
                    </div>
                ) : (
                    <div className="space-y-2">
                        {existingTimelines.map((timeline) => (
                            <div key={timeline.id} className="flex items-center justify-between p-5 bg-zinc-900/40 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                                <div className="font-bold text-zinc-200 text-base tracking-tight leading-none">{timeline.title}</div>
                                <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/5 text-xs text-zinc-500 font-bold tracking-tight">
                                    {new Date(timeline.time).toLocaleString(undefined, {
                                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
