import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PlusCircle, Settings, Users } from "lucide-react";

export default async function OrganizerDashboard() {
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) {
        redirect("/organizer/login");
    }

    const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
        include: { events: true },
    });

    if (!organizer) {
        redirect("/organizer/login");
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12 selection:bg-rose-500/30">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Admin Dashboard</h1>
                        <p className="text-zinc-500 font-medium">Welcome back, {organizer.name}</p>
                    </div>
                    <Link
                        href="/organizer/onboarding"
                        className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold font-sm shadow-xl shadow-rose-600/20 transition-all flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> New Event
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizer.events.map((event) => (
                        <Link
                            key={event.id}
                            href={`/organizer/dashboard/${event.id}`}
                            className="bg-[#121214] border border-white/5 hover:border-rose-500/30 rounded-3xl p-8 flex flex-col group relative overflow-hidden transition-all shadow-xl shadow-black/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="mb-6 w-12 h-12 bg-[#18181b] border border-white/5 rounded-xl flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                                <Settings className="w-5 h-5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{event.name}</h2>
                            <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed flex-grow">
                                {event.description}
                            </p>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between font-bold text-sm text-zinc-400 group-hover:text-rose-400 transition-colors">
                                Manage Event <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                        </Link>
                    ))}

                    {organizer.events.length === 0 && (
                        <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                                <Users className="w-8 h-8 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">No Hackathons yet</h3>
                                <p className="text-zinc-500">Deploy your first event to start accepting team leads.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
