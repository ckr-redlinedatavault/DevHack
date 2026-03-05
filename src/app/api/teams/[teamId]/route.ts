import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";
import { getCachedData, setCachedData } from "@/lib/redis";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const userId = await getUserId();
        const { teamId } = await params;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 1. Try to get from Cache (Load Balancing / Performance)
        const cacheKey = `user:${userId}:team:${teamId}`;
        const cachedTeam = await getCachedData(cacheKey);

        if (cachedTeam) {
            console.log(`Cache HIT for ${cacheKey}`);
            return NextResponse.json(cachedTeam);
        }

        // 2. Cache MISS - Query Database
        console.log(`Cache MISS for ${cacheKey}`);
        const team = await prisma.team.findUnique({
            where: {
                id: teamId,
                members: {
                    some: { userId }
                }
            },
            include: {
                _count: {
                    select: { members: true }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                id: true
                            }
                        }
                    }
                },
                tasks: true,
                resources: true,
                notes: true,
                submission: true,
                problemStatements: true,
                joinRequests: {
                    where: { status: "PENDING" },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });

        if (!team) {
            return NextResponse.json(
                { message: "Team not found" },
                { status: 404 }
            );
        }

        // 3. Update Cache (TTL 60s for Balancing)
        await setCachedData(cacheKey, team, 60);

        // Include Hand Raise status for Workspace consumption
        const lead = team.members.find(m => m.role === 'LEAD');
        let handRaised = false;
        if (lead) {
            const registration = await prisma.eventRegistration.findFirst({
                where: { leadEmail: lead.user.email, status: "INVITED" }
            });
            handRaised = !!registration?.handRaised;
        }

        return NextResponse.json({ ...team, handRaised, currentUserId: userId });
    } catch (error: any) {
        console.error("Fetch team error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
