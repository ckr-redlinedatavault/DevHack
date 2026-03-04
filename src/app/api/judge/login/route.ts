import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setJudgeSession } from "@/lib/judge-auth-utils";

export async function POST(req: Request) {
    try {
        const { email, password, eventId } = await req.json();

        const judge = await prisma.judge.findFirst({
            where: { email, eventId }
        });

        if (!judge || !(await bcrypt.compare(password, judge.password))) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        await setJudgeSession(judge.id, eventId);
        return NextResponse.json({ message: "Logged in", eventId });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
