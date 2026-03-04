import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrganizerHubSidebar from "./OrganizerHubSidebar";

export default async function OrganizerHubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const organizerId = cookieStore.get("organizerId")?.value;

    if (!organizerId) {
        redirect("/organizer/login");
    }

    const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
        select: { name: true }
    });

    if (!organizer) {
        redirect("/organizer/login");
    }

    return (
        <div className="flex min-h-screen bg-black text-rose-50 selection:bg-rose-500/30 overflow-x-hidden">
            {/* Nav Sidebar Rail (Fixed w-20) */}
            <OrganizerHubSidebar organizerName={organizer.name} />

            {/* Hub Shift (Pinned to Sidebar) */}
            <div className="flex-1 ml-20 min-h-screen relative">
                <div className="h-full w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
