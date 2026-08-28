import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const description = String(
      formData.get("description") || ""
    );
    const minAmount = Number(formData.get("min_amount"));
    const maxAmount = Number(formData.get("max_amount"));
    const durationDays = Number(
      formData.get("duration_days")
    );
    const dailyRoi = Number(formData.get("daily_roi"));
    const status = String(formData.get("status") || "");

    if (
      !id ||
      !name ||
      !Number.isFinite(minAmount) ||
      !Number.isFinite(maxAmount) ||
      !Number.isFinite(durationDays) ||
      !Number.isFinite(dailyRoi)
    ) {
      return NextResponse.json(
        { error: "Invalid plan data" },
        { status: 400 }
      );
    }

    if (minAmount < 0 || maxAmount < minAmount) {
      return NextResponse.json(
        { error: "Invalid amount range" },
        { status: 400 }
      );
    }

    if (durationDays < 1 || dailyRoi < 0) {
      return NextResponse.json(
        { error: "Invalid duration or ROI" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("investment_plans")
      .update({
        name,
        description,
        min_amount: minAmount,
        max_amount: maxAmount,
        duration_days: durationDays,
        daily_roi: dailyRoi,
        status,
      })
      .eq("id", id);

    if (error) {
      console.error("Plan update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL("/admin/plans", request.url)
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

