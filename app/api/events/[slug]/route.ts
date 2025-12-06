import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/**
 * GET /api/events/[slug]
 * Fetches a single event by slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // Extract slug from route parameters
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        {
          message: "Invalid slug parameter",
          error: "Slug must be a non-empty string",
        },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase alphanumeric with hyphens)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug.trim())) {
      return NextResponse.json(
        {
          message: "Invalid slug format",
          error:
            "Slug must contain only lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event: IEvent | null = await Event.findOne({
      slug: slug.trim().toLowerCase(),
    }).lean<IEvent>();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {
          message: "Event not found",
          error: `No event exists with slug: ${slug}`,
        },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error("Error fetching event by slug:", error);

    // Handle database connection errors
    if (error instanceof Error && error.message.includes("connection")) {
      return NextResponse.json(
        {
          message: "Database connection failed",
          error: "Unable to connect to database",
        },
        { status: 503 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
