import { NextResponse } from "next/server";
import { removeUserId } from "@/lib/auth-utils";

export async function POST() {
    try {
        await removeUserId();
        return NextResponse.json({ message: "Logged out successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error logging out" }, { status: 500 });
    }
}
