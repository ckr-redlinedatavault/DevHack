import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TimelineManager from "../TimelineManager";

export default async function TimelineManagementPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) redirect("/organizer/login");

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId, organizerId },
        include: { timelines: { orderBy: { time: 'asc' } } },
    });

    if (!event) redirect("/organizer/dashboard");

    return (
        <div className="space-y-12 max-w-5xl">
            <div className="space-y-3 pb-8 border-b border-white/5">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-4">
                    Event Roadmap
                    <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[11px] font-bold rounded-full border border-rose-500/20 shadow-lg shadow-rose-500/5">
                        Live Timeline
                    </span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium px-1">Plot event milestones and broadcast live announcements to all participating teams.</p>
            </div>

            <TimelineManager eventId={event.id} existingTimelines={event.timelines} />
        </div>
    );
}
