import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegistrationForm from "./RegistrationForm";
import Link from "next/link";
import { Calendar, Globe, Users, Trophy } from "lucide-react";

export default async function PublicEventPage({ params }: { params: { eventId: string } }) {
    const { eventId } = await params;

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId },
        include: { organizer: true },
    });

    if (!event) {
        notFound();
    }

    const startDateStr = event.startDate ? new Date(event.startDate).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    }) : "TBA";

    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 font-sans">
            <div className="absolute top-0 inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)]" />

            <header className="fixed top-0 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-outfit font-bold text-xl tracking-tight">
                        DevHack
                    </Link>
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-3 py-1 bg-[#121214] border border-white/5 rounded-full">
                        Official Partner Event
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Event Info Left Column */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-outfit text-white leading-tight">
                                {event.name}
                            </h1>
                            <p className="text-xl text-indigo-400 font-medium tracking-tight">
                                Hosted by {event.organizer.name}
                            </p>
                        </div>

                        <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-medium leading-relaxed">
                            <p>{event.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                            <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Start Date</span>
                                <span className="text-white font-medium">{startDateStr}</span>
                            </div>
                            <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
                                <Globe className="w-5 h-5 text-sky-400" />
                                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Format</span>
                                <span className="text-white font-medium">Virtual Network</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form Right Column */}
                    <div className="lg:pl-8">
                        <div className="sticky top-32">
                            <RegistrationForm eventId={event.id} />

                            <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                <Trophy className="w-6 h-6 text-amber-500" />
                                <Users className="w-6 h-6 text-zinc-400" />
                                <Calendar className="w-6 h-6 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
