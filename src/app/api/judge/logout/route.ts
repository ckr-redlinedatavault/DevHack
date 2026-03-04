import { NextResponse } from "next/server";
import { clearJudgeSession } from "@/lib/judge-auth-utils";

export async function POST() {
    await clearJudgeSession();
    return NextResponse.json({ message: "Logged out" });
}
