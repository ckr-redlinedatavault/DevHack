"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";

export default function InviteActions({ eventId, count }: { eventId: string, count: number }) {
    const [isInviting, setIsInviting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    const handleInviteAll = async () => {
        if (!confirm(`Are you sure you want to authorize all ${count} pending team leads? They will receive the arena entry link immediately.`)) return;

        setIsInviting(true);
        setStatus(null);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/invite`, {
                method: "POST"
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: `Successfully authorized ${count} teams!` });
                setTimeout(() => {
                    router.refresh();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: data.message || "Failed to send invitations." });
            }
        } catch (error) {
            console.error("error inviting:", error);
            setStatus({ type: 'error', message: "Network error. Please try again." });
        } finally {
            setIsInviting(false);
        }
    };

    if (count === 0 && !status) return null;

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleInviteAll}
                disabled={isInviting || count === 0}
                className="bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-lg shadow-rose-500/10"
            >
                {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                AUTHORIZE ALL PENDING ({count})
            </button>
            {status && (
                <p className={`text-[10px] font-bold uppercase tracking-wider ${status.type === 'success' ? 'text-emerald-500' : 'text-rose-500'} animate-in fade-in slide-in-from-top-1`}>
                    {status.message}
                </p>
            )}
        </div>
    );
}
