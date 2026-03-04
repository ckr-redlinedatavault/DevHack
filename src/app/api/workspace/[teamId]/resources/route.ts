import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const resources = await prisma.resource.findMany({ where: { teamId } });
    return NextResponse.json(resources);
}

export async function POST(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { teamId } = await params;
    const { title, url } = await req.json();
    if (!title || !url) return NextResponse.json({ message: "Title and URL required" }, { status: 400 });
    const resource = await prisma.resource.create({ data: { teamId, title, url } });
    return NextResponse.json(resource, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
}
