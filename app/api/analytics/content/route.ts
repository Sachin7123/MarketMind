import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql, eq, SQL } from "drizzle-orm";
import { content, views, userInteractions } from "@/lib/schema";
import type { InferSelectModel } from "drizzle-orm";

type ContentType = InferSelectModel<typeof content>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    const contentId = searchParams.get("contentId");

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case "24h":
        startDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // If contentId is provided, get analytics for specific content
    if (contentId) {
      const [contentData, viewStats, interactionStats] = await Promise.all([
        // Get content details
        db.query.content.findFirst({
          where: (
            content: ContentType,
            { eq }: { eq: typeof import("drizzle-orm").eq }
          ) => eq(content.id, parseInt(contentId)),
        }),
        // Get view statistics
        db.execute(sql`
          SELECT 
            COUNT(*) as total_views,
            COUNT(DISTINCT user_id) as unique_viewers,
            DATE_TRUNC('day', created_at) as date
          FROM views
          WHERE content_id = ${contentId}
            AND created_at >= ${startDate}
          GROUP BY DATE_TRUNC('day', created_at)
          ORDER BY date ASC
        `),
        // Get interaction statistics
        db.execute(sql`
          SELECT 
            interaction_type,
            COUNT(*) as count,
            DATE_TRUNC('day', created_at) as date
          FROM user_interactions
          WHERE content_id = ${contentId}
            AND created_at >= ${startDate}
          GROUP BY interaction_type, DATE_TRUNC('day', created_at)
          ORDER BY date ASC
        `),
      ]);

      return NextResponse.json({
        content: contentData,
        viewStats,
        interactionStats,
      });
    }

    // If no contentId, get analytics for all content
    const [topContent, recentActivity] = await Promise.all([
      // Get top performing content
      db.execute(sql`
        SELECT 
          c.id,
          c.title,
          COUNT(v.id) as view_count,
          COUNT(DISTINCT v.user_id) as unique_viewers,
          COUNT(ui.id) as interaction_count
        FROM content c
        LEFT JOIN views v ON c.id = v.content_id
        LEFT JOIN user_interactions ui ON c.id = ui.content_id
        WHERE v.created_at >= ${startDate}
        GROUP BY c.id, c.title
        ORDER BY view_count DESC
        LIMIT 10
      `),
      // Get recent activity
      db.execute(sql`
        SELECT 
          c.id,
          c.title,
          v.created_at,
          ui.interaction_type
        FROM content c
        JOIN views v ON c.id = v.content_id
        LEFT JOIN user_interactions ui ON c.id = ui.content_id
        WHERE v.created_at >= ${startDate}
        ORDER BY v.created_at DESC
        LIMIT 50
      `),
    ]);

    return NextResponse.json({
      topContent,
      recentActivity,
    });
  } catch (error) {
    console.error("Error in content analytics API:", error);
    return NextResponse.json(
      { error: "Failed to fetch content analytics" },
      { status: 500 }
    );
  }
}
