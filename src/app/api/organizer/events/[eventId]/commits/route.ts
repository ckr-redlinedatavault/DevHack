import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;

        const updates = await prisma.teamUpdate.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' },
            include: {
                team: {
                    select: { name: true }
                }
            }
        });

        const formattedUpdates = updates.map(update => ({
            id: update.id,
            teamId: update.teamId,
            teamName: update.team.name,
            comment: update.comment,
            research: update.research,
            createdAt: update.createdAt
        }));

        return NextResponse.json({ updates: formattedUpdates }, { status: 200 });
    } catch (error) {
        console.error("Error fetching event commits:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
