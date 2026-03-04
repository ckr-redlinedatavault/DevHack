import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

// GET /api/workspace/[teamId]/tasks
export async function GET(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const tasks = await prisma.task.findMany({ where: { teamId }, orderBy: { id: "asc" } });
    return NextResponse.json(tasks);
}

// POST /api/workspace/[teamId]/tasks
export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const { title, description, status } = await req.json();
    if (!title) return NextResponse.json({ message: "Title required" }, { status: 400 });
    const task = await prisma.task.create({ data: { teamId, title, description, status: status || "BACKLOG" } });
    return NextResponse.json(task, { status: 201 });
}

// PATCH /api/workspace/[teamId]/tasks  (update status)
export async function PATCH(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id, status, title } = await req.json();
    const task = await prisma.task.update({ where: { id }, data: { ...(status && { status }), ...(title && { title }) } });
    return NextResponse.json(task);
}

// DELETE /api/workspace/[teamId]/tasks
export async function DELETE(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
}
