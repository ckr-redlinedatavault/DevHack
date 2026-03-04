import { NextResponse } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
    try {
        const { eventId } = await params;
        const { teamName, leadEmail } = await req.json();

        if (!teamName || !leadEmail) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const existingRegistration = await prisma.eventRegistration.findFirst({
            where: { eventId, leadEmail },
        });

        if (existingRegistration) {
            return NextResponse.json({ message: "A team lead with this email is already registered." }, { status: 400 });
        }

        const registration = await prisma.eventRegistration.create({
            data: {
                eventId,
                teamName,
                leadEmail,
            },
        });

        return NextResponse.json({ message: "Registration pending approval", registration }, { status: 201 });
    } catch (error) {
        console.error("Public registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
