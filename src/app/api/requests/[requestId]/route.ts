import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

import { invalidateCache } from "@/lib/redis";

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
            include: {
                team: {
                    include: { members: true }
                },
                user: true
            }
        });

        if (!joinRequest) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        // Verify acting user is a member (ideally LEAD, but any member can approve for now in this v2)
        const isTeamMember = joinRequest.team.members.some(m => m.userId === actingUserId);
        if (!isTeamMember) {
            return NextResponse.json({ message: "Forbidden. Only team members can manage requests." }, { status: 403 });
        }

        if (action === "APPROVE") {
            // Check if already a member to avoid unique constraint crash
            const existing = await prisma.teamMember.findUnique({
                where: {
                    teamId_userId: {
                        teamId: joinRequest.teamId,
                        userId: joinRequest.userId
                    }
                }
            });

            if (!existing) {
                await prisma.teamMember.create({
                    data: {
                        teamId: joinRequest.teamId,
                        userId: joinRequest.userId,
                        role: "MEMBER"
                    }
                });
            }

            // Update request status
            await prisma.joinRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" }
            });

            // CLEAR CACHE for all members so they see the new person immediately
            const memberIds = joinRequest.team.members.map(m => m.userId);
            memberIds.push(joinRequest.userId); // Also clear for the new person

            for (const uid of memberIds) {
                const cacheKey = `user:${uid}:team:${joinRequest.teamId}`;
                await invalidateCache(cacheKey);
            }

            return NextResponse.json({ message: "Request approved and member added" });
        } else if (action === "REJECT") {
            await prisma.joinRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" }
            });

            // Clear cache for the lead so the request list updates
            const cacheKey = `user:${actingUserId}:team:${joinRequest.teamId}`;
            await invalidateCache(cacheKey);

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
