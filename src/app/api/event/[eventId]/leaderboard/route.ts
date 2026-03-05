import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        const { eventId } = await params;

        const event = await prisma.hackathonEvent.findUnique({
            where: { id: eventId },
            include: {
                registrations: {
                    where: { status: "INVITED" } // Only show approved leads on scoreboard
                }
            }
        });

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const leaderboard = await Promise.all(event.registrations.map(async (reg) => {
            // Find the actual workspace team linked to this lead's email
            // We search for a team where the registered lead is a direct member
            const actualTeam = await prisma.team.findFirst({
                where: {
                    members: {
                        some: {
                            user: {
                                email: reg.leadEmail
                            }
                        }
                    }
                },
                include: {
                    tasks: true,
                    submission: true
                }
            });

            let dynamicScore = 0;
            let tasksCompleted = 0;
            let hasSubmission = false;

            if (actualTeam) {
                // 10 points per DONE task
                const doneTasks = actualTeam.tasks.filter(t => t.status === "DONE").length;
                tasksCompleted = doneTasks;
                dynamicScore += doneTasks * 10;

                // 100 points for project submission (higher reward for completion)
                if (actualTeam.submission) {
                    hasSubmission = true;
                    dynamicScore += 100;
                }
            }

            // Inject organizer reward points natively into the dynamic score
            dynamicScore += reg.totalScore;

            return {
                id: reg.id,
                teamName: reg.teamName, // Display the registration name, but scores come from linked workspace
                dynamicScore,
                judgeScore: reg.totalScore, // Average from judges
                tasksCompleted,
                hasSubmission,
                handRaised: reg.handRaised,
                joinedAt: reg.createdAt,
            };
        }));

        // Scoring hierarchy: 
        // 1. If judging is LIVE/ENDED, judgeScore (avg) takes priority
        // 2. Otherwise, dynamicScore (tasks + submission) takes priority
        const isJudgingLive = event.status === "JUDGING" || event.status === "ENDED";

        leaderboard.sort((a, b) => {
            if (isJudgingLive) {
                if (b.judgeScore !== a.judgeScore) return b.judgeScore - a.judgeScore;
            }
            if (b.dynamicScore !== a.dynamicScore) return b.dynamicScore - a.dynamicScore;
            return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        });

        const rankedLeaderboard = leaderboard.map((team, index) => ({
            ...team,
            rank: index + 1
        }));

        return NextResponse.json({
            leaderboard: rankedLeaderboard,
            status: event.status,
            isRevealing: event.isRevealing,
            currentPhase: event.currentPhase
        }, { status: 200 });

    } catch (error) {
        console.error("Leaderboard analytics error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
