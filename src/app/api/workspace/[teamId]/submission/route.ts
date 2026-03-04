import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const submission = await prisma.submission.findUnique({ where: { teamId } });
    return NextResponse.json(submission || {});
}

export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;

    // Using upsert to handle creation if it doesn't exist, or updating if it does
    const body = await req.json();
    const dataToSave = {
        problemStatement: body.problemStatement ?? undefined,
        solution: body.solution ?? undefined,
        techStack: body.techStack ?? undefined,
        videoUrl: body.videoUrl ?? undefined,
        deckUrl: body.deckUrl ?? undefined,
    };

    const submission = await prisma.submission.upsert({
        where: { teamId },
        update: dataToSave,
        create: {
            teamId,
            ...dataToSave
        }
    });

    return NextResponse.json(submission);
}
