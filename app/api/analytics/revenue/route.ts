import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { transactions } from "@/lib/schema";

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

    const [revenueStats, dailyRevenue, topCustomers] = await Promise.all([
      // Get overall revenue statistics
      db.execute(sql`
        SELECT 
          COUNT(*) as total_transactions,
          SUM(amount) as total_revenue,
          AVG(amount) as average_transaction,
          COUNT(DISTINCT user_id) as unique_customers
        FROM transactions
        WHERE created_at >= ${startDate}
          AND status = 'completed'
      `),
      // Get daily revenue breakdown
      db.execute(sql`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as transaction_count,
          SUM(amount) as daily_revenue,
          COUNT(DISTINCT user_id) as unique_customers
        FROM transactions
        WHERE created_at >= ${startDate}
          AND status = 'completed'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date ASC
      `),
      // Get top customers by revenue
      db.execute(sql`
        SELECT 
          user_id,
          COUNT(*) as transaction_count,
          SUM(amount) as total_spent,
          MAX(created_at) as last_transaction
        FROM transactions
        WHERE created_at >= ${startDate}
          AND status = 'completed'
        GROUP BY user_id
        ORDER BY total_spent DESC
        LIMIT 10
      `),
    ]);

    // Calculate revenue growth
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(
      previousStartDate.getDate() - (now.getDate() - startDate.getDate())
    );

    const [currentPeriodRevenue, previousPeriodRevenue] = await Promise.all([
      db.execute(sql`
        SELECT SUM(amount) as revenue
        FROM transactions
        WHERE created_at >= ${startDate}
          AND status = 'completed'
      `),
      db.execute(sql`
        SELECT SUM(amount) as revenue
        FROM transactions
        WHERE created_at >= ${previousStartDate}
          AND created_at < ${startDate}
          AND status = 'completed'
      `),
    ]);

    const currentRevenue = currentPeriodRevenue[0]?.revenue || 0;
    const previousRevenue = previousPeriodRevenue[0]?.revenue || 0;
    const revenueGrowth =
      previousRevenue === 0
        ? 100
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    return NextResponse.json({
      overview: {
        ...revenueStats[0],
        revenueGrowth,
      },
      dailyRevenue,
      topCustomers,
    });
  } catch (error) {
    console.error("Error in revenue analytics API:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue analytics" },
      { status: 500 }
    );
  }
}
