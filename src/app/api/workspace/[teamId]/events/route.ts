import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;

        // Fetch ALL hackathon events in the system so teams can freely commit updates to any active event
        const events = await prisma.hackathonEvent.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Add 'status' or other fields if needed for display in the dropdown.
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
