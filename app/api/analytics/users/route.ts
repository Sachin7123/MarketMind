import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { userActivity, userInteractions, userPreferences } from "@/lib/schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    const userId = searchParams.get("userId");

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

    // If userId is provided, get analytics for specific user
    if (userId) {
      const [userData, activityStats, interactionStats] = await Promise.all([
        // Get user preferences
        db.query.userPreferences.findFirst({
          where: (preferences, { eq }) => eq(preferences.userId, userId),
        }),
        // Get activity statistics
        db.execute(sql`
          SELECT 
            action,
            COUNT(*) as count,
            DATE_TRUNC('day', created_at) as date
          FROM user_activity
          WHERE user_id = ${userId}
            AND created_at >= ${startDate}
          GROUP BY action, DATE_TRUNC('day', created_at)
          ORDER BY date ASC
        `),
        // Get interaction statistics
        db.execute(sql`
          SELECT 
            interaction_type,
            COUNT(*) as count,
            DATE_TRUNC('day', created_at) as date
          FROM user_interactions
          WHERE user_id = ${userId}
            AND created_at >= ${startDate}
          GROUP BY interaction_type, DATE_TRUNC('day', created_at)
          ORDER BY date ASC
        `),
      ]);

      return NextResponse.json({
        user: userData,
        activityStats,
        interactionStats,
      });
    }

    // If no userId, get analytics for all users
    const [userStats, activeUsers, userEngagement] = await Promise.all([
      // Get user statistics
      db.execute(sql`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(DISTINCT user_id) as new_users,
          COUNT(*) as total_actions
        FROM user_activity
        WHERE created_at >= ${startDate}
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date ASC
      `),
      // Get most active users
      db.execute(sql`
        SELECT 
          user_id,
          COUNT(*) as action_count,
          COUNT(DISTINCT action) as unique_actions
        FROM user_activity
        WHERE created_at >= ${startDate}
        GROUP BY user_id
        ORDER BY action_count DESC
        LIMIT 10
      `),
      // Get user engagement metrics
      db.execute(sql`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(DISTINCT user_id) as active_users,
          COUNT(*) as total_interactions,
          COUNT(*)::float / NULLIF(COUNT(DISTINCT user_id), 0) as avg_interactions_per_user
        FROM user_interactions
        WHERE created_at >= ${startDate}
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date ASC
      `),
    ]);

    return NextResponse.json({
      userStats,
      activeUsers,
      userEngagement,
    });
  } catch (error) {
    console.error("Error in user analytics API:", error);
    return NextResponse.json(
      { error: "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}
