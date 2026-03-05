import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;
        const body = await request.json();
        const { eventId, comment, research } = body;

        // Verify the team exists
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        // Verify the event exists
        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // Add the commit update record
        await prisma.teamUpdate.create({
            data: {
                teamId,
                eventId,
                comment,
                research
            }
        });

        // Optionally, if the organizer has tied scoring to updates, we could dynamically increment score here.
        // E.g.
        /*
        const registration = await prisma.eventRegistration.findFirst({
            where: { eventId, teamName: team.name }
        });
        if (registration) {
            await prisma.eventRegistration.update({
                where: { id: registration.id },
                data: { totalScore: { increment: 5 } } // +5 points per valid commit
            });
        }
        */

        return NextResponse.json({ message: "Update committed successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error committing team update:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
