import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // grab first injury of user
  const { data: inj } = await supabase
    .from("injuries")
    .select("id")
    .eq("user_id", user.user!.id)
    .single();
  if (!inj) return NextResponse.json({ error: "No injury" }, { status: 400 });

  const { pain } = await req.json();
  await supabase.from("daily_logs").insert([{ injury_id: inj.id, pain_level: pain, user_id: user.user!.id }]);

  return NextResponse.json({ ok: true });
}