"use client";

import { useState } from "react";
import { Loader2, Mail, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegistrationForm({ eventId }: { eventId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const formData = new FormData(e.currentTarget);
            const teamName = formData.get("teamName");
            const leadEmail = formData.get("leadEmail");

            const res = await fetch(`/api/event/${eventId}/register`, {
                method: "POST",
                body: JSON.stringify({ teamName, leadEmail }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "success") {
        return (
            <div className="bg-[#121214] border border-emerald-500/20 rounded-[2rem] p-12 text-center space-y-6 shadow-2xl shadow-emerald-500/10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Registration Request Sent!</h2>
                    <p className="text-zinc-500 mt-2 font-medium">Your team lead email has been recorded.</p>
                </div>
                <div className="p-4 bg-black border border-white/5 rounded-2xl text-sm text-zinc-400">
                    The hackathon organizer will review your request. If approved, you will receive an official invitation via email with access to the live event timer portal.
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#121214] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 pointer-events-none" />

            <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Team Name</label>
                    <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            name="teamName"
                            placeholder="Quantum Hackers"
                            required
                            className="w-full h-12 bg-black border border-white/5 focus:border-indigo-500/50 text-white rounded-xl pl-11 outline-none transition-all placeholder:text-zinc-800 text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Team Lead Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            name="leadEmail"
                            type="email"
                            placeholder="lead@example.com"
                            required
                            className="w-full h-12 bg-black border border-white/5 focus:border-indigo-500/50 text-white rounded-xl pl-11 outline-none transition-all placeholder:text-zinc-800 text-sm font-medium"
                        />
                    </div>
                </div>

                {status === "error" && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium text-center">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/5 disabled:opacity-50 mt-4"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Registration Request"}
                </button>
            </div>
        </form>
    );
}
