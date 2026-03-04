import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    systemInstruction: "You are an elite AI co-pilot for hackathons. Your goal is to extract every detailed content, provide deep technical analysis, and assist with complex python modeling, code debugging, and project structuring. Be concise but extremely detailed when explaining technical concepts. Prioritize accuracy and depth."
});

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: unknown) {
        console.error("Gemini AI Error:", error);
        return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
    }
}
