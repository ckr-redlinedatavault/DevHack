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
                router.refresh(); // Refresh RSC component to show updated lists
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
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 group disabled:opacity-50"
        >
            {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Invite All Pending</>}
        </button>
    );
}
