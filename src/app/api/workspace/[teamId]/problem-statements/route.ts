import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const problems = await prisma.problemStatement.findMany({ where: { teamId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(problems);
}

export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const { title, description } = await req.json();
    if (!title || !description) return NextResponse.json({ message: "Title and description required" }, { status: 400 });
    const problem = await prisma.problemStatement.create({ data: { teamId, title, description } });
    return NextResponse.json(problem, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id, title, description, status } = await req.json();
    if (!id) return NextResponse.json({ message: "Problem ID required" }, { status: 400 });
    const problem = await prisma.problemStatement.update({
        where: { id },
        data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status })
        }
    });
    return NextResponse.json(problem);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    await prisma.problemStatement.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
}
