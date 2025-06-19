import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const history = await db
    .select()
    .from(AIOutput)
    .orderBy(desc(AIOutput.createdAt));
  return Response.json(history);
}
