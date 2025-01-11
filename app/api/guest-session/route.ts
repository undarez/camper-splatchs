import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const requestData = await request.json();
    const userAgent = requestData.userAgent;
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { data, error } = await supabase
      .from("guest_sessions")
      .insert([
        {
          ip_address: ip,
          user_agent: userAgent,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating guest session:", error);
    return NextResponse.json(
      { error: "Failed to create guest session" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("is_valid_guest_session", {
      session_id: sessionId,
    });

    if (error) throw error;

    return NextResponse.json({ isValid: data });
  } catch (error) {
    console.error("Error checking guest session:", error);
    return NextResponse.json(
      { error: "Failed to check guest session" },
      { status: 500 }
    );
  }
}
