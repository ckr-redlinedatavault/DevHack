import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are an elite AI co-pilot for hackathons. Your goal is to extract every detailed content, provide deep technical analysis, and assist with complex python modeling, code debugging, and project structuring. Be concise but extremely detailed when explaining technical concepts. Prioritize accuracy and depth."
});

export async function POST(req: Request) {
    try {
        const { message, history, context } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Prepare the chat sessions history
        // Gemini SDK expects history as [{ role: 'user'|'model', parts: [{ text: string }] }]
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        // We include context in the user message if it's the start or if it changed, 
        // but for simplicity here we prepend it to the current message to ensure the model stays grounded.
        const prompt = context
            ? `[WORKSPACE CONTEXT]: ${context}\n\n[USER]: ${message}`
            : message;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: unknown) {
        console.error("Gemini AI Error:", error);
        return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
    }
}
