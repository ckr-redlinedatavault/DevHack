import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ requestId: string }> }
) {
    try {
        const actingUserId = await getUserId();
        if (!actingUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { requestId } = await params;
        const { action } = await req.json();

        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id: requestId },
            include: { team: true, user: true }
        });

        if (!joinRequest) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        if (action === "APPROVE") {
            // Create team member
            await prisma.teamMember.create({
                data: {
                    teamId: joinRequest.teamId,
                    userId: joinRequest.userId,
                    role: "MEMBER"
                }
            });

            // Update request status
            await prisma.joinRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" }
            });

            return NextResponse.json({ message: "Request approved and member added" });
        } else if (action === "REJECT") {
            await prisma.joinRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" }
            });
            return NextResponse.json({ message: "Request rejected" });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Request action error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
