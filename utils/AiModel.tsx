import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY ?? ""
);

const model = client.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
