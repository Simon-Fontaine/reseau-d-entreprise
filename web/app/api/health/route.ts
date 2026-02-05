import { db } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: "unknown",
    },
  };

  try {
    await db.execute(sql`SELECT 1`);
    health.checks.database = "healthy";
  } catch (error) {
    health.status = "unhealthy";
    health.checks.database = "unhealthy";

    return NextResponse.json(health, { status: 503 });
  }

  return NextResponse.json(health, { status: 200 });
}
