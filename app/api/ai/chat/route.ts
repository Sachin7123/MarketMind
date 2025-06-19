import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Store chat history in memory (in production, you'd want to use a database)
const chatHistory = new Map<string, any[]>();

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Get or initialize chat history for this session
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, []);
    }
    const history = chatHistory.get(sessionId)!;

    // Add user message to history
    history.push({ role: "user", content: message });

    // Generate chat response
    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: msg.content,
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const reply = response.text();

    // Add assistant response to history
    history.push({ role: "assistant", content: reply });

    // Keep only last 10 messages to prevent context window issues
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
