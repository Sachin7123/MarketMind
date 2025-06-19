import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "7d";

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

    // Fetch analytics data
    const [totalViews, activeUsers, revenue, engagementRate] =
      await Promise.all([
        // Total Views
        db.execute(sql`
        SELECT COUNT(*) as count
        FROM views
        WHERE created_at >= ${startDate}
      `),
        // Active Users
        db.execute(sql`
        SELECT COUNT(DISTINCT user_id) as count
        FROM user_activity
        WHERE created_at >= ${startDate}
      `),
        // Revenue
        db.execute(sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE created_at >= ${startDate}
      `),
        // Engagement Rate
        db.execute(sql`
        SELECT 
          (COUNT(*) * 100.0 / NULLIF((
            SELECT COUNT(*)
            FROM views
            WHERE created_at >= ${startDate}
          ), 0)) as rate
        FROM user_interactions
        WHERE created_at >= ${startDate}
      `),
      ]);

    // Fetch performance data over time
    const performanceData = await db.execute(sql`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT user_id) as users,
        SUM(amount) as revenue
      FROM analytics_daily
      WHERE created_at >= ${startDate}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);

    return NextResponse.json({
      metrics: {
        totalViews: totalViews[0]?.count || 0,
        activeUsers: activeUsers[0]?.count || 0,
        revenue: revenue[0]?.total || 0,
        engagementRate: engagementRate[0]?.rate || 0,
      },
      performanceData,
    });
  } catch (error) {
    console.error("Error in overview analytics API:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
