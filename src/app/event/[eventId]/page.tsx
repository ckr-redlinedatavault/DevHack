import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegistrationForm from "./RegistrationForm";
import Link from "next/link";
import { Calendar, Globe, Zap } from "lucide-react";

export default async function PublicEventPage({ params }: { params: Promise<{ eventId: string }> }) {
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
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 font-sans relative overflow-hidden">
            {/* Ambient Background FX */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.01] blur-[150px] rounded-full -z-10" />

            <header className={`fixed top-0 w-full z-[100] transition-all duration-500 py-6 bg-black/50 backdrop-blur-md border-b border-white/5`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-all">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tighter">DevHack</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Verified Partner Mission
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-40 pb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Event Info Left Column */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex gap-2 items-center text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">
                                <span className="w-1 h-1 rounded-full bg-rose-500" />
                                Operational Call
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-white">
                                {event.name}
                            </h1>
                            <p className="text-lg text-rose-500 font-bold uppercase tracking-widest opacity-80 pt-2">
                                Hosted by {event.organizer.name}
                            </p>
                        </div>

                        <div className="prose prose-invert prose-zinc max-w-none text-zinc-500 text-lg font-medium leading-relaxed italic opacity-80">
                            <p>{event.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Activation Date</span>
                                </div>
                                <span className="text-white font-bold text-xl tracking-tight">{startDateStr}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Relay</span>
                                </div>
                                <span className="text-white font-bold text-xl tracking-tight">Virtual Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form Right Column */}
                    <div className="lg:pl-12">
                        <div className="sticky top-40 bg-zinc-950/40 border border-white/5 rounded-[3rem] p-4 backdrop-blur-sm shadow-2xl">
                            <RegistrationForm eventId={event.id} />
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em] opacity-40">
                                DevHack Event Engine v1.2
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
