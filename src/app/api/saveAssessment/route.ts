import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseService";

// Required shape:
// {
//   email: "...",
//   assessment: { bodyRegion, painLevel, symptoms, medicalHistory }
// }

export async function POST(req: Request) {
  try {
    const { email, assessment, forceUpdate } = await req.json();

    if (!email || !assessment) {
      return NextResponse.json(
        { error: "Missing email or assessment data" },
        { status: 400 }
      );
    }

    // 1. Check if the email already exists
    const { data: existing, error: findError } = await supabaseService
      .from("assessments")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    // 2. If exists and user has NOT confirmed, return "exists"
    if (existing && !forceUpdate) {
      return NextResponse.json({
        exists: true,
        message: "Record already exists. Confirm update?"
      });
    }

    let result;

    // 3A. UPDATE
    if (existing && forceUpdate) {
      result = await supabaseService
        .from("assessments")
        .update({ assessment })
        .eq("email", email);
    }

    // 3B. INSERT
    if (!existing) {
      result = await supabaseService.from("assessments").insert({
        email,
        assessment,
      });
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: !!existing,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
