import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";


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

        return NextResponse.json(team);
    } catch (error: any) {
        console.error("Fetch team error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
