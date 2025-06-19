import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Analyze sentiment
    const prompt = `Analyze the sentiment of the following text and provide a detailed response including:
    1. Overall sentiment (positive, negative, or neutral)
    2. Sentiment score (0-100)
    3. Key emotional indicators
    4. Confidence level
    
    Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in sentiment analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}
