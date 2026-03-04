import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PlusCircle, Calendar, Activity, Users } from "lucide-react";

export default async function OrganizerDashboard() {
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) redirect("/organizer/login");

    const events = await prisma.hackathonEvent.findMany({
        where: { organizerId },
        include: { _count: { select: { registrations: { where: { status: "INVITED" } } } } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-12 max-w-7xl mx-auto p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
                        Events Archive
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium max-w-xl">
                        Manage your active hackathons and mission control portals.
                    </p>
                </div>

                <Link
                    href="/organizer/onboarding"
                    className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold text-xs hover:bg-rose-400 transition-all flex items-center gap-2.5 shadow-lg shadow-rose-500/10"
                >
                    <PlusCircle className="w-4 h-4" /> Start New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/organizer/dashboard/${event.id}`}
                        className="bg-zinc-950 border border-white/5 hover:border-rose-500/20 rounded-2xl p-7 flex flex-col group relative overflow-hidden transition-all"
                    >
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-rose-500/5 border border-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[9px] font-bold">
                            <Activity className="w-2.5 h-2.5" /> {event.status.toLowerCase()}
                        </div>

                        <div className="mb-6 w-10 h-10 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                            <Calendar className="w-4 h-4 text-zinc-600 group-hover:text-rose-500 transition-colors" />
                        </div>

                        <div className="space-y-2 flex-grow">
                            <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-rose-100 transition-colors leading-tight">{event.name}</h2>
                            <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-zinc-600 font-bold text-[10px] leading-none">
                                <Users className="w-3 h-3" /> {event._count.registrations} Active Teams
                            </div>
                            <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-rose-500/10 transition-all text-zinc-600 group-hover:text-rose-500 border border-white/5">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </Link>
                ))}

                {events.length === 0 && (
                    <div className="col-span-full py-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-5 bg-white/[0.01]">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 opacity-40">
                            <PlusCircle className="w-7 h-7 text-zinc-600" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">No Events Found</h3>
                            <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">Create your first event to start accepting registrations.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
