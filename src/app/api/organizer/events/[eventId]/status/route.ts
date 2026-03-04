import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizerId } from "@/lib/organizer-auth-utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        const organizerId = await getOrganizerId();
        if (!organizerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { eventId } = await params;
        const { status, currentPhase, isRevealing } = await req.json();

        const event = await prisma.hackathonEvent.update({
            where: { id: eventId, organizerId },
            data: {
                status: status || undefined,
                currentPhase: currentPhase || undefined,
                isRevealing: isRevealing !== undefined ? isRevealing : undefined
            }
        });

        return NextResponse.json({ message: "Event updated", event });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
