import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ inviteCode: string }> }
) {
    try {
        const { inviteCode } = await params;
        const team = await prisma.team.findUnique({
            where: { inviteCode },
            select: {
                id: true,
                name: true,
                projectName: true,
            }
        });

        if (!team) {
            return NextResponse.json(
                { message: "Team not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(team);
    } catch (error: any) {
        console.error("Join discovery error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ inviteCode: string }> }
) {
    try {
        const { inviteCode } = await params;

        // Get userId from cookie session (not from request body)
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const team = await prisma.team.findUnique({
            where: { inviteCode }
        });

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        // Check if already a member
        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId: team.id,
                    userId
                }
            }
        });

        if (existingMember) {
            return NextResponse.json({ message: "You are already a member of this team" }, { status: 400 });
        }

        // Check if already has a pending request
        const existingRequest = await prisma.joinRequest.findUnique({
            where: {
                teamId_userId: {
                    teamId: team.id,
                    userId
                }
            }
        });

        if (existingRequest) {
            return NextResponse.json({ message: "You already have a pending request for this team" }, { status: 400 });
        }

        // Create join request
        const request = await prisma.joinRequest.create({
            data: {
                teamId: team.id,
                userId,
                status: "PENDING"
            }
        });

        return NextResponse.json({ message: "Join request sent", requestId: request.id });
    } catch (error: any) {
        console.error("Join request error:", error.code, error.message);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
