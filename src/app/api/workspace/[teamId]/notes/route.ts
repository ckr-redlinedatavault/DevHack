import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const notes = await prisma.note.findMany({ where: { teamId }, orderBy: { id: "asc" } });
    return NextResponse.json(notes);
}

export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ message: "Title and content required" }, { status: 400 });
    const note = await prisma.note.create({ data: { teamId, title, content } });
    return NextResponse.json(note, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id, title, content } = await req.json();
    if (!id) return NextResponse.json({ message: "Note ID required" }, { status: 400 });
    const note = await prisma.note.update({ where: { id }, data: { ...(title && { title }), ...(content && { content }) } });
    return NextResponse.json(note);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
}
