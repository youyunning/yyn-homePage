// app/api/analytics/route.ts
// Fetch total GA4 sessions securely via service account
// Also supports fetching page views for specific paths

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { GoogleAuth } from "google-auth-library";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering since we use searchParams
export const dynamic = "force-dynamic";

// Cache duration: 1 hour (reduced from 24 hours for fresher data)
const CACHE_DURATION = 3600; // 1 hour in seconds

const propertyId = process.env.GA4_PROPERTY_ID!;
const clientEmail = process.env.GA4_CLIENT_EMAIL!;
const privateKey = (process.env.GA4_PRIVATE_KEY || "").replace(/\\n/g, "\n");
let analyticsClient: BetaAnalyticsDataClient | null = null;

// Initialize GA4 Data API client
function getAnalyticsClient() {
  if (analyticsClient) {
    return analyticsClient;
  }

  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  analyticsClient = new BetaAnalyticsDataClient({
    // Type assertion needed due to version mismatch between google-auth-library versions
    // @google-analytics/data uses 10.4.0, but we have 10.5.0 installed
    // Runtime compatibility is maintained, only TypeScript types differ
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth: auth as any,
  });

  return analyticsClient;
}

// Type for cached data with timestamp
interface CachedData<T> {
  value: T;
  cachedAt: string;
}

// Helper function to fetch page views for a specific path
async function fetchPageViews(path: string): Promise<CachedData<number>> {
  const analyticsDataClient = getAnalyticsClient();
  const pageViewsResponse = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "EXACT",
          value: path,
        },
      },
    },
  });

  const value = pageViewsResponse[0]?.rows?.[0]?.metricValues?.[0]?.value
    ? Number(pageViewsResponse[0].rows[0].metricValues[0].value)
    : 0;

  return {
    value,
    cachedAt: new Date().toISOString(),
  };
}

// Cached function to fetch page views for a specific path
// Uses CACHE_DURATION to cache results
// Each path gets its own cache entry via the key parameter
async function getCachedPageViews(path: string): Promise<CachedData<number>> {
  return unstable_cache(
    () => fetchPageViews(path),
    ["ga4-page-views", path], // Cache key includes path for separate cache entries
    {
      revalidate: CACHE_DURATION,
      tags: ["ga4-analytics", `ga4-page-${path}`],
    },
  )();
}

// Helper function to fetch total sessions
async function fetchTotalSessions(): Promise<CachedData<number>> {
  const analyticsDataClient = getAnalyticsClient();
  const sessionsResponse = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
    metrics: [{ name: "sessions" }],
  });

  const value = sessionsResponse[0]?.rows?.[0]?.metricValues?.[0]?.value
    ? Number(sessionsResponse[0].rows[0].metricValues[0].value)
    : 0;

  return {
    value,
    cachedAt: new Date().toISOString(),
  };
}

// Cached function to fetch total sessions
const getCachedTotalSessions = unstable_cache(
  fetchTotalSessions,
  ["ga4-total-sessions"],
  {
    revalidate: CACHE_DURATION,
    tags: ["ga4-analytics", "ga4-sessions"],
  },
);

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    if (!propertyId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: "Missing GA4 credentials" },
        { status: 500 },
      );
    }

    // Get parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get("path");

    // Add caching headers (edge + browser) - cache for 1 hour
    const headers = new Headers({
      "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=300`,
    });

    // If path is provided, query for specific page views
    if (path) {
      // Normalize path: ensure it starts with /
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;

      // Use cached function - Results are cached via unstable_cache
      const pageViewsData = await getCachedPageViews(normalizedPath);

      return NextResponse.json(
        {
          path: normalizedPath,
          views: pageViewsData.value,
          cachedAt: pageViewsData.cachedAt,
        },
        { headers },
      );
    }

    // Default: Query GA4 for total sessions only
    // Use cached function - Results are cached via unstable_cache
    const sessionsData = await getCachedTotalSessions();

    return NextResponse.json(
      {
        metric: "sessions",
        label: "Total Sessions",
        total: sessionsData.value,
        cachedAt: sessionsData.cachedAt,
      },
      { headers },
    );
  } catch (err: unknown) {
    console.error("GA4 API Error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch GA4 data",
        detail: String(err),
      },
      { status: 500 },
    );
  }
}

// POST handler for cache revalidation
// Usage: POST /api/analytics with optional body { "secret": "your-secret" }
export async function POST(request: NextRequest) {
  try {
    // Optional: Add a secret for security in production
    const body = await request.json().catch(() => ({}));
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    // If a secret is configured, verify it
    if (revalidateSecret && body.secret !== revalidateSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 },
      );
    }

    // Revalidate the analytics cache tags
    revalidateTag("ga4-analytics", "max");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "Analytics cache has been revalidated",
    });
  } catch (err: unknown) {
    console.error("Revalidation Error:", err);
    return NextResponse.json(
      {
        error: "Failed to revalidate cache",
        detail: String(err),
      },
      { status: 500 },
    );
  }
}
