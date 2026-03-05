import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;

        // Fetch team hackathon events based on registrations
        // Find registrations linked to this team's name (since EventRegistration uses teamName currently)
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: { name: true }
        });

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        const registeredEvents = await prisma.eventRegistration.findMany({
            where: {
                teamName: team.name, // Link hackathons they registered for
            },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        const events = registeredEvents.map(r => r.event);

        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error("Error fetching team registered events:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
