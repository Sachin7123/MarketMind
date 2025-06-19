import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content based on type
    let systemPrompt = "";
    switch (type) {
      case "article":
        systemPrompt = "Write a detailed article about:";
        break;
      case "analysis":
        systemPrompt = "Provide a market analysis for:";
        break;
      case "news":
        systemPrompt = "Write a news report about:";
        break;
      default:
        systemPrompt = "Generate content about:";
    }

    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
    const response = await result.response;
    const generatedContent = response.text();

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error("Error in generate API:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
