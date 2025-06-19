import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userInterests, contentHistory } = await req.json();

    if (!userInterests) {
      return NextResponse.json(
        { error: "User interests are required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content recommendations
    const prompt = `Based on the following user interests and content history, provide 5 personalized content recommendations.
    For each recommendation, include:
    1. Title
    2. Brief description
    3. Relevance score (0-100)
    4. Why it's recommended
    
    User Interests: ${userInterests}
    Content History: ${contentHistory || "No previous content history"}
    
    Format the response as a JSON array of recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    return NextResponse.json({ recommendations: JSON.parse(recommendations) });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
