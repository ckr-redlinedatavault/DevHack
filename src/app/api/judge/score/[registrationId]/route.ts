import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJudgeSession } from "@/lib/judge-auth-utils";

export async function POST(req: Request, { params }: { params: Promise<{ registrationId: string }> }) {
    try {
        const session = await getJudgeSession();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { registrationId } = await params;
        const { innovation, implementation, design, impact, comment } = await req.json();

        // Check if judge has already scored this team. If so, update.
        const score = await prisma.score.upsert({
            where: {
                registrationId_judgeId: {
                    registrationId,
                    judgeId: session.judgeId
                }
            },
            update: {
                innovation,
                implementation,
                design,
                impact,
                comment
            },
            create: {
                registrationId,
                judgeId: session.judgeId,
                innovation,
                implementation,
                design,
                impact,
                comment
            },
            include: {
                registration: true
            }
        });

        // Calculate new total score for the registration
        const allScores = await prisma.score.findMany({
            where: { registrationId }
        });

        const totalAverage = allScores.reduce((acc, s) => {
            return acc + (s.innovation + s.implementation + s.design + s.impact);
        }, 0) / allScores.length;

        // Update the registration's total score for the leaderboard
        await prisma.eventRegistration.update({
            where: { id: registrationId },
            data: { totalScore: totalAverage }
        });

        return NextResponse.json({ message: "Score submitted", score });
    } catch (error) {
        console.error("Scoring error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
