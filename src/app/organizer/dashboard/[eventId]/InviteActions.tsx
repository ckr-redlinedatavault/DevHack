"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";

export default function InviteActions({ eventId, count }: { eventId: string, count: number }) {
    const [isInviting, setIsInviting] = useState(false);
    const router = useRouter();

    const handleInviteAll = async () => {
        if (!confirm(`Are you sure you want to send email invitations to ${count} pending team leads?`)) return;

        setIsInviting(true);
        try {
            const res = await fetch(`/api/organizer/events/${eventId}/invite`, {
                method: "POST"
            });
            if (res.ok) {
                alert("Invitations sent successfully!");
                router.refresh();
            } else {
                alert("Failed to send invitations.");
            }
        } catch (error) {
            console.error("error inviting:", error);
        } finally {
            setIsInviting(false);
        }
    };

    if (count === 0) return null;

    return (
        <button
            onClick={handleInviteAll}
            disabled={isInviting}
            className="bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-lg shadow-rose-500/10"
        >
            {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            Invite Queue
        </button>
    );
}
