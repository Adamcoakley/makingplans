"use server";

import { createHash, randomBytes } from "crypto";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createPlanSchema } from "@/lib/validation/plan";

function generateShareToken() {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function generateJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from({ length: 8 }, () => {
    const index = Math.floor(Math.random() * alphabet.length);
    return alphabet[index];
  }).join("");
}

export async function createPlanAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must have an active session to create a plan.");
  }

  const parsed = createPlanSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    durationMinutes: Number(formData.get("durationMinutes")),
    durationDays: null,
    responseDeadline: formData.get("responseDeadline"),
  });

  if (!parsed.success) {
    throw new Error("Invalid plan details.");
  }

  const shareToken = generateShareToken();
  const shareTokenHash = hashToken(shareToken);

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .insert({
      owner_user_id: user.id,
      share_token_hash: shareTokenHash,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      duration_minutes: parsed.data.durationMinutes,
      duration_days: null,
      response_deadline: parsed.data.responseDeadline,
    })
    .select("id")
    .single();

  if (planError) {
    throw new Error(`Unable to create plan: ${planError.message}`);
  }

  let joinCode: string | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateJoinCode();

    const { error } = await supabase.from("join_codes").insert({
      plan_id: plan.id,
      code: candidate,
    });

    if (!error) {
      joinCode = candidate;
      break;
    }
  }

  if (!joinCode) {
    await supabase.from("plans").delete().eq("id", plan.id);
    throw new Error("Unable to generate a join code.");
  }

  redirect(
    `/create/success?code=${encodeURIComponent(joinCode)}&token=${encodeURIComponent(
      shareToken
    )}`
  );
}