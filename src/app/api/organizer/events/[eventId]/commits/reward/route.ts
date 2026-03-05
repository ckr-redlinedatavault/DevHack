import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const { teamName, points } = await request.json();

        if (!teamName || typeof points !== "number") {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        const registration = await prisma.eventRegistration.findFirst({
            where: { eventId, teamName }
        });

        if (!registration) {
            return NextResponse.json({ message: "Team is not registered for this event" }, { status: 404 });
        }

        await prisma.eventRegistration.update({
            where: { id: registration.id },
            data: { totalScore: { increment: points } }
        });

        return NextResponse.json({ message: "Points awarded successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error rewarding points:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
