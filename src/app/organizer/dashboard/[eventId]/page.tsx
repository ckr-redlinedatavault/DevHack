import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Users, CheckCircle2, Copy } from "lucide-react";
import InviteActions from "./InviteActions";

export default async function EventDashboard({ params }: { params: { eventId: string } }) {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) {
        redirect("/organizer/login");
    }

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId, organizerId },
        include: { registrations: true },
    });

    if (!event) {
        redirect("/organizer/dashboard");
    }

    const pendingLeads = event.registrations.filter((r) => r.status === "PENDING");
    const invitedLeads = event.registrations.filter((r) => r.status === "INVITED");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const publicLink = `${appUrl}/event/${event.id}`;

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-rose-500/30 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">
                <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500 mb-8">
                    <Link href="/organizer/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Admin Hub
                    </Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-rose-400">{event.name}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-outfit">{event.name} Overview</h1>
                        <p className="text-zinc-500 text-lg font-medium">{event.description}</p>
                    </div>

                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col gap-2 min-w-[300px] shadow-2xl shadow-black/50">
                        <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Public Registration Link</label>
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={publicLink}
                                className="bg-black border border-white/5 rounded-xl px-4 py-2 text-sm text-zinc-400 flex-grow font-mono overflow-hidden whitespace-nowrap outline-none"
                            />
                            {/* Ideally handled via client component "Copy to Clipboard" but for now link placeholder */}
                            <Link href={publicLink} target="_blank" className="p-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    {/* Pending Leads */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-amber-500" /> Pending Approval ({pendingLeads.length})
                            </h2>
                            <InviteActions eventId={event.id} count={pendingLeads.length} />
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                            {pendingLeads.length === 0 ? (
                                <div className="p-12 text-center text-zinc-600 font-medium">No pending teams.</div>
                            ) : (
                                <ul className="divide-y divide-white/5">
                                    {pendingLeads.map((reg) => (
                                        <li key={reg.id} className="p-6 hover:bg-white/[0.02] flex items-center justify-between transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-bold text-white text-lg">{reg.teamName}</p>
                                                <p className="text-zinc-500 text-sm font-mono flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5" /> {reg.leadEmail}
                                                </p>
                                            </div>
                                            <div className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                                Pending
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Invited Leads */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Invited Teams ({invitedLeads.length})
                        </h2>

                        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 opacity-75">
                            {invitedLeads.length === 0 ? (
                                <div className="p-12 text-center text-zinc-600 font-medium">No invitations sent yet.</div>
                            ) : (
                                <ul className="divide-y divide-white/5">
                                    {invitedLeads.map((reg) => (
                                        <li key={reg.id} className="p-6 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-bold text-zinc-300 text-lg">{reg.teamName}</p>
                                                <p className="text-zinc-600 text-sm font-mono">{reg.leadEmail}</p>
                                            </div>
                                            <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                                Sent
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
