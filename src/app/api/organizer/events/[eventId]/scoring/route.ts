import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const organizerId = await getOrganizerId();
        const { eventId } = await params;
        const { scores } = await req.json(); // Array of { registrationId, score }

        if (!organizerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId, organizerId },
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // Batch update scores
        await Promise.all(
            scores.map((item: { registrationId: string, score: number }) =>
                prisma.eventRegistration.update({
                    where: { id: item.registrationId },
                    data: { totalScore: item.score }
                })
            )
        );

        return NextResponse.json({ message: "Leaderboard updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Scoring update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const organizerId = await getOrganizerId();
        const { eventId } = await params;

        if (!organizerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const teams = await prisma.eventRegistration.findMany({
            where: {
                eventId,
                status: "INVITED"
            },
            select: {
                id: true,
                teamName: true,
                leadEmail: true,
                totalScore: true
            },
            orderBy: {
                totalScore: 'desc'
            }
        });

        return NextResponse.json(teams);
    } catch (error: any) {
        console.error("Fetch scoring teams error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
