import { NextResponse } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getOrganizerId } from "@/lib/organizer-auth-utils";

export async function POST(req: Request) {
    try {
        const organizerId = await getOrganizerId();

        if (!organizerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, description, startDate, endDate } = await req.json();

        if (!name || !description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.hackathonEvent.create({
            data: {
                organizerId,
                name,
                description,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return NextResponse.json({ event, message: "Event created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Event creation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
