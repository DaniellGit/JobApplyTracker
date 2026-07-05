import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const authorization = request.headers.get("authorization");

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase is not configured yet.");
  }

  if (!authorization) {
    return null;
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient(request);
    if (!supabase) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load applications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient(request);

    if (!supabase) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const payload = {
      user_id: user.id,
      company: body.company,
      role: body.role,
      status: body.status || "Applied",
      applied_date: body.appliedDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      next_step: body.nextStep || "Keep going",
      priority: body.priority || "Medium",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("applications").insert(payload).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
