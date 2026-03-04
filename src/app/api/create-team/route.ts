import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in first." },
                { status: 401 }
            );
        }

        const { teamName, projectName, hackathonName, teamSize, description } = await req.json();

        if (!teamName || !projectName || !hackathonName) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate a professional invite code like DEV-3F9A1
        const prefixes = ["DEV", "TEAM", "HACK"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
        const inviteCode = `${prefix}-${suffix}`;

        // Create team AND add creator as LEAD in one transaction
        const team = await prisma.team.create({
            data: {
                name: teamName,
                projectName,
                hackathonName,
                teamSize: parseInt(teamSize) || 1,
                description,
                inviteCode,
                members: {
                    create: {
                        userId,
                        role: "LEAD"
                    }
                }
            },
        });

        return NextResponse.json(
            {
                message: "Team created successfully",
                teamId: team.id,
                inviteCode: team.inviteCode
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Team creation error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
