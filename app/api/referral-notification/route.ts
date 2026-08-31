import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      recipientEmail,
      recipientUsername,
      downlineUsername,
      rewardAmount,
      depositAmount,
    } = body;

    if (
      !recipientEmail ||
      !recipientUsername ||
      !downlineUsername ||
      rewardAmount === undefined ||
      depositAmount === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required notification data." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "B-Rock <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "Referral Reward Credited",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Referral Reward Credited</h2>

          <p>Hello ${recipientUsername},</p>

          <p>
            Your referral reward has been successfully credited.
          </p>

          <p>
            <strong>Referred user:</strong> ${downlineUsername}<br>
            <strong>Qualifying deposit:</strong> $${Number(depositAmount).toFixed(2)}<br>
            <strong>Referral reward:</strong> $${Number(rewardAmount).toFixed(2)}
          </p>

          <p>
            You can log in to your B-Rock dashboard to view your updated
            referral rewards balance.
          </p>

          <p>
            Regards,<br>
            B-Rock Support
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);

      return NextResponse.json(
        { error: "Unable to send referral notification email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id ?? null,
    });
  } catch (error) {
    console.error("Referral notification error:", error);

    return NextResponse.json(
      { error: "Invalid notification request." },
      { status: 500 }
    );
  }
}
