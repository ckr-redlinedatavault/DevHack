"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Send, Loader2, Info, CheckCircle2, AlertCircle } from "lucide-react";

export default function BulkInvitePage() {
    const { eventId } = useParams();
    const router = useRouter();
    const [emails, setEmails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleBulkSend = async () => {
        if (!emails.trim()) {
            setStatus({ type: 'error', message: "Please enter at least one email address." });
            return;
        }

        const emailList = emails
            .split(/[\n,;]/)
            .map(row => {
                const parts = row.split('|');
                if (parts.length >= 2) {
                    return {
                        teamName: parts[0].trim(),
                        email: parts[1].replace(/['"]/g, "").trim().toLowerCase()
                    };
                } else if (row.includes('@')) {
                    const email = row.replace(/['"]/g, "").trim().toLowerCase();
                    return {
                        teamName: email.split('@')[0],
                        email: email
                    };
                }
                return null;
            })
            .filter(e => e && e.email && e.email.includes('@'));

        if (emailList.length === 0) {
            setStatus({ type: 'error', message: "No valid emails found in the input." });
            return;
        }

        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch(`/api/organizer/events/${eventId}/bulk-invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emails: emailList })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({
                    type: 'success',
                    message: `Dispatched ${data.results.length} invitations! ${data.errors ? `(Partially failed: ${data.errors.length})` : ''}`
                });
                setEmails("");
                setTimeout(() => router.refresh(), 3000);
            } else {
                const errorDetail = data.errors ? `: ${data.errors[0]}` : '';
                setStatus({ type: 'error', message: (data.message || "Failed to send.") + errorDetail });
            }
        } catch (error) {
            setStatus({ type: 'error', message: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3 pb-8 border-b border-white/5">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-4">
                    Bulk Invitations
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[11px] font-bold rounded-full border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                        High Priority
                    </span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium max-w-2xl px-1">
                    Directly authorize team leads by entering their email addresses. Each recipient will receive an official approval email and instant portal access.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-400 px-1 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-zinc-600" /> Recipient List
                            </label>
                            <textarea
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                placeholder="Team Alpha | lead1@example.com&#10;Team Beta | lead2@example.com"
                                className="w-full h-80 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono leading-relaxed"
                            />
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${status.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                                }`}>
                                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm font-bold">{status.message}</p>
                            </div>
                        )}

                        <button
                            onClick={handleBulkSend}
                            disabled={isSubmitting}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-indigo-600/10 group overflow-hidden relative"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    Launch Bulk Dispatch
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-500" />
                            Dispatch Protocol
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5 px-1">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Formatting</p>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Use 'Team Name | email@example.com' format per line. Vertical bar (|) is required to specify the team name.</p>
                            </div>
                            <div className="space-y-1.5 px-1">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Onboarding</p>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Recipient lead accounts are automatically created and granted exclusive event permissions upon dispatch.</p>
                            </div>
                            <div className="space-y-1.5 px-1 opacity-40">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">System ID</p>
                                <p className="text-xs text-zinc-500 leading-relaxed font-mono">NODE_DISPATCH_V2.4</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
