import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    try {
        const { teamId } = await params;
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch the team and check if the user is a lead
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                teamId,
                userId,
                role: "LEAD"
            },
            include: {
                user: true
            }
        });

        if (!teamMember) {
            return NextResponse.json({ message: "Forbidden: Only Leads can Raise Hands" }, { status: 403 });
        }

        const userEmail = teamMember.user.email;

        // 2. Find the EventRegistration linked to this lead email
        const registration = await prisma.eventRegistration.findFirst({
            where: { leadEmail: userEmail, status: "INVITED" }
        });

        if (!registration) {
            return NextResponse.json({ message: "No active event registration found for this lead." }, { status: 404 });
        }

        // 3. Toggle the handRaised status
        const updated = await prisma.eventRegistration.update({
            where: { id: registration.id },
            data: { handRaised: !registration.handRaised }
        });

        return NextResponse.json({
            message: updated.handRaised ? "Hand raised successfully" : "Hand lowered successfully",
            handRaised: updated.handRaised
        }, { status: 200 });

    } catch (error) {
        console.error("Hand Raise error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
