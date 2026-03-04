import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import LiveEventTimer from "./LiveEventTimer";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export default async function LiveEventStatusPage({ params }: { params: { eventId: string } }) {
    const { eventId } = await params;

    // In a real isolated env, we would verify their INVITED status token.
    // However, since it's just a live timer public page, we can show it to anyone with the exact secure link.

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId },
        include: { organizer: true },
    });

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 font-sans">
            <div className="absolute top-0 inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />

            <header className="fixed top-0 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-outfit font-bold text-xl tracking-tight">
                        DevHack <span className="text-zinc-500 font-medium">|</span> {event.organizer.name}
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Status
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-outfit text-white leading-tight">
                        {event.name}
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">
                        Mission Control Portal
                    </p>
                </div>

                <LiveEventTimer
                    startDate={event.startDate?.toISOString() || null}
                    endDate={event.endDate?.toISOString() || null}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-white/5 pt-16">
                    <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Innovation Started</h3>
                        <p className="text-zinc-500 text-sm font-medium">Your hackathon has officially begun. All repositories and resources are unlocked for your team.</p>
                    </div>

                    <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Real-time Metrics</h3>
                        <p className="text-zinc-500 text-sm font-medium">The organizer is tracking overall event progress. Keep pushing updates to stay on track.</p>
                    </div>

                    <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-sky-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Submission Lock</h3>
                        <p className="text-zinc-500 text-sm font-medium">When the central timer reaches zero, the event submission gates will automatically close. Finalize early.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
