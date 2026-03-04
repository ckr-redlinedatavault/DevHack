import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, CheckCircle2, Mail } from "lucide-react";
import InviteActions from "../InviteActions";

export default async function TeamsManagementPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) redirect("/organizer/login");

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId, organizerId },
        include: { registrations: true },
    });

    if (!event) redirect("/organizer/dashboard");

    const pendingLeads = event.registrations.filter((r) => r.status === "PENDING");
    const invitedLeads = event.registrations.filter((r) => r.status === "INVITED");

    return (
        <div className="space-y-12">
            <div className="space-y-3 pb-8 border-b border-white/5">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-4">
                    Team Management
                    <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[11px] font-bold rounded-full border border-rose-500/20 shadow-lg shadow-rose-500/5">
                        Registration Center
                    </span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium max-w-2xl px-1">Manage registration requests and approve team leads for the event portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Pending Leads */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-3 text-zinc-100">
                            <Users className="w-5 h-5 text-zinc-600" /> Pending Requests
                            <span className="bg-zinc-900 border border-white/10 text-zinc-500 px-2.5 py-0.5 rounded-lg text-xs font-bold leading-none">{pendingLeads.length}</span>
                        </h2>
                        <InviteActions eventId={event.id} count={pendingLeads.length} />
                    </div>

                    <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                        {pendingLeads.length === 0 ? (
                            <div className="p-20 text-center text-zinc-700 font-bold text-xs opacity-40">All requests processed</div>
                        ) : (
                            <ul className="divide-y divide-white/5">
                                {pendingLeads.map((reg) => (
                                    <li key={reg.id} className="p-7 hover:bg-white/[0.02] flex items-center justify-between transition-all group">
                                        <div className="space-y-1">
                                            <p className="font-bold text-zinc-100 text-base tracking-tight truncate leading-none">{reg.teamName}</p>
                                            <p className="text-zinc-500 text-sm flex items-center gap-1.5 font-medium opacity-60 mt-1">
                                                <Mail className="w-4 h-4" /> {reg.leadEmail}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                            Awaiting Approval
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Invited Leads */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-3 text-zinc-100">
                            <CheckCircle2 className="w-5 h-5 text-zinc-600" /> Authorized Leads
                            <span className="bg-zinc-900 border border-white/10 text-zinc-500 px-2.5 py-0.5 rounded-lg text-xs font-bold leading-none">{invitedLeads.length}</span>
                        </h2>
                    </div>

                    <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                        {invitedLeads.length === 0 ? (
                            <div className="p-20 text-center text-zinc-700 font-bold text-xs opacity-40">No invitations sent yet</div>
                        ) : (
                            <ul className="divide-y divide-white/5 bg-zinc-950/40">
                                {invitedLeads.map((reg) => (
                                    <li key={reg.id} className="p-7 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-bold text-zinc-400 text-base tracking-tight leading-none truncate">{reg.teamName}</p>
                                            <p className="text-zinc-600 text-sm font-medium opacity-60 mt-1">{reg.leadEmail}</p>
                                        </div>
                                        <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                            Active Status
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
