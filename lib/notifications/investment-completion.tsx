import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;

  const value = email.trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function notifyInvestmentCompleted(
  investmentId: string
) {
  const supabase = await createClient();

  const { data: investment, error: investmentError } = await supabase
    .from("user_investments")
    .select(`
      id,
      user_id,
      amount,
      status,
      daily_roi,
      duration_days,
      started_at,
      created_at,
      investment_plans (
        name
      )
    `)
    .eq("id", investmentId)
    .maybeSingle();

  if (investmentError) {
    throw new Error(investmentError.message);
  }

  if (!investment) {
    throw new Error("Investment not found.");
  }

  if (investment.status !== "completed") {
    return {
      success: false,
      skipped: true,
      reason: "Investment is not completed.",
    };
  }

  /*
   * Claim this completion notification.
   *
   * The unique constraint prevents duplicate notifications
   * if the dashboard/admin code reaches this function more than once.
   */
  const { data: notification, error: claimError } = await supabase
    .from("investment_notifications")
    .insert({
      investment_id: investment.id,
      user_id: investment.user_id,
      notification_type: "investment_completed",
    })
    .select("id")
    .maybeSingle();

  if (claimError) {
    /*
     * A duplicate completion notification means another request
     * already handled this investment.
     */
    if (
      claimError.code === "23505" ||
      claimError.message.toLowerCase().includes("duplicate")
    ) {
      return {
        success: true,
        skipped: true,
        reason: "Completion notification already sent.",
      };
    }

    throw new Error(claimError.message);
  }

  if (!notification) {
    return {
      success: true,
      skipped: true,
      reason: "Completion notification already processed.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, full_name, email")
    .eq("id", investment.user_id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const amount = Number(investment.amount || 0);
  const dailyRoi = Number(investment.daily_roi || 0);
  const durationDays = Number(investment.duration_days || 0);

  let profit = 0;

  if (investment.started_at && durationDays > 0) {
    const startedAt = new Date(investment.started_at).getTime();
    const elapsedDays = Math.min(
      Math.max(
        Math.floor((Date.now() - startedAt) / 86400000),
        0
      ),
      durationDays
    );

    profit = Number(
      (
        amount *
        (dailyRoi / 100) *
        elapsedDays
      ).toFixed(2)
    );
  }

  const planName =
    Array.isArray(investment.investment_plans)
      ? investment.investment_plans[0]?.name
      : investment.investment_plans?.name;

  const username =
    profile?.username ||
    profile?.full_name ||
    "Valued Client";

  /*
   * Dashboard notification
   */
  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      sender_id: null,
      recipient_id: investment.user_id,
      subject: "Investment Completed",
      body:
        `Your ${planName || "investment"} has completed successfully.\n\n` +
        `Investment amount: $${amount.toFixed(2)}\n` +
        `Daily ROI: ${dailyRoi}%\n` +
        `Duration: ${durationDays} days\n` +
        `Profit calculated: $${profit.toFixed(2)}\n` +
        `Status: Completed\n\n` +
        `Please review your portfolio and consider your next investment decision based on your financial goals and risk tolerance.`,
      is_read: false,
    });

  if (messageError) {
    console.error(
      "Investment dashboard notification error:",
      messageError
    );
  }

  /*
   * Email is optional.
   *
   * Missing/invalid email = dashboard notification only.
   */
  if (
    profile?.email &&
    isValidEmail(profile.email) &&
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM_EMAIL
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: `B-Rock <${process.env.RESEND_FROM_EMAIL}>`,
      to: [profile.email.trim()],
      subject: "Your Investment Has Completed",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;">
          <h2>Your Investment Has Completed</h2>

          <p>Hello ${username},</p>

          <p>
            Your investment has reached its scheduled completion.
          </p>

          <h3>Investment Summary</h3>

          <p>
            <strong>Plan:</strong> ${planName || "Investment Plan"}<br>
            <strong>Investment amount:</strong> $${amount.toFixed(2)}<br>
            <strong>Daily ROI:</strong> ${dailyRoi}%<br>
            <strong>Duration:</strong> ${durationDays} days<br>
            <strong>Calculated profit:</strong> $${profit.toFixed(2)}<br>
            <strong>Status:</strong> Completed
          </p>

          <p>
            We encourage you to review your portfolio, assess your
            financial objectives and consider diversification carefully
            before making your next investment decision.
          </p>

          <p>
            Regards,<br>
            B-Rock Support
          </p>
        </div>
      `,
    });

    if (emailError) {
      /*
       * Do not fail the dashboard notification because an email failed.
       */
      console.error(
        "Investment completion email error:",
        emailError
      );
    }
  }

  return {
    success: true,
    notificationId: notification.id,
    emailSent:
      Boolean(
        profile?.email &&
        isValidEmail(profile.email) &&
        process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL
      ),
  };
}
