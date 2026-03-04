import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizerId } from "@/lib/organizer-auth-utils";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    try {
        const organizerId = await getOrganizerId();
        if (!organizerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { eventId } = await params;
        const { name, email, password } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const judge = await prisma.judge.create({
            data: {
                eventId,
                name,
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json({ message: "Judge created", judge });
    } catch (error) {
        return NextResponse.json({ message: "Error creating judge" }, { status: 500 });
    }
}
