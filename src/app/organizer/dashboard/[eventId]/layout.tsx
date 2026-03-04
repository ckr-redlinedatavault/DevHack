import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrganizerSidebar from "./OrganizerSidebar";

export default async function EventLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) {
        redirect("/organizer/login");
    }

    const event = await prisma.hackathonEvent.findUnique({
        where: { id: eventId, organizerId },
        select: { name: true, id: true }
    });

    if (!event) {
        redirect("/organizer/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-black text-rose-50 selection:bg-rose-500/20">
            {/* Event Specific Sidebar (Pinned to left-20 rail) */}
            <OrganizerSidebar eventId={event.id} eventName={event.name} />

            {/* Main Content Area (Shifted by 64px for this Sidebar) */}
            <div className="flex-1 ml-64 min-h-screen overflow-x-hidden">
                <main className="p-8 md:p-14 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                    {children}
                </main>
            </div>
        </div>
    );
}
