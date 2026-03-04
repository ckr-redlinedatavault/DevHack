import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JUDGE_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function setJudgeSession(judgeId: string, eventId: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const token = await new SignJWT({ judgeId, eventId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JUDGE_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("judge_token", token, { expires, httpOnly: true, secure: true, sameSite: "lax" });
}

export async function getJudgeSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("judge_token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JUDGE_SECRET);
        return payload as { judgeId: string, eventId: string };
    } catch {
        return null;
    }
}

export async function clearJudgeSession() {
    const cookieStore = await cookies();
    cookieStore.set("judge_token", "", { expires: new Date(0) });
}
