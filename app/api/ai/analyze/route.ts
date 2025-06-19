import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Analyze content
    const prompt = `Please analyze the following content and provide insights about market trends, potential opportunities, and risks:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
