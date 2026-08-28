import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, full_name, username, email")
    .order("full_name", { ascending: true });

  const { data: notifications, error: notificationsError } =
    await supabase
      .from("notifications")
      .select(
        "id, recipient_id, type, title, message, is_read, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

  async function sendNotification(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: adminUser },
    } = await client.auth.getUser();

    if (!adminUser) {
      redirect("/login");
    }

    const { data: adminProfile } = await client
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .maybeSingle();

    if (adminProfile?.role !== "admin") {
      redirect("/dashboard");
    }

    const recipientId = String(
      formData.get("recipient_id") || ""
    );

    const type = String(
      formData.get("type") || "general"
    ).trim();

    const title = String(
      formData.get("title") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (!recipientId || !title || !message) {
      throw new Error(
        "Recipient, title, and message are required."
      );
    }

    const { error } = await client
      .from("notifications")
      .insert({
        recipient_id: recipientId,
        type,
        title,
        message,
        is_read: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/notifications");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <a
            href="/admin"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock Admin
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="/admin"
              className="text-white/70 hover:text-yellow-400"
            >
              Overview
            </a>

            <a
              href="/admin/deposits"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposits
            </a>

            <a
              href="/admin/withdrawals"
              className="text-white/70 hover:text-yellow-400"
            >
              Withdrawals
            </a>

            <a
              href="/admin/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/admin/payment-methods"
              className="text-white/70 hover:text-yellow-400"
            >
              Payment Methods
            </a>

            <a
              href="/admin/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages
            </a>

            <a
              href="/admin/notifications"
              className="text-yellow-400"
            >
              Notifications
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm text-yellow-400">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 max-w-3xl text-white/50">
            Send notifications directly to customers and view
            previously sent notifications.
          </p>
        </div>

        {(usersError || notificationsError) && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Database Error
            </p>

            <p className="mt-2 text-sm">
              {usersError?.message ||
                notificationsError?.message}
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">
            Send Notification
          </h2>

          <form
            action={sendNotification}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Customer
              </label>

              <select
                name="recipient_id"
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              >
                <option value="">
                  Select a customer
                </option>

                {users?.map((recipient) => (
                  <option
                    key={recipient.id}
                    value={recipient.id}
                  >
                    {recipient.full_name ||
                      recipient.username ||
                      recipient.email ||
                      recipient.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Notification Type
              </label>

              <select
                name="type"
                defaultValue="general"
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              >
                <option value="general">
                  General
                </option>

                <option value="deposit">
                  Deposit
                </option>

                <option value="withdrawal">
                  Withdrawal
                </option>

                <option value="investment">
                  Investment
                </option>

                <option value="account">
                  Account
                </option>

                <option value="system">
                  System
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Title
              </label>

              <input
                name="title"
                type="text"
                required
                placeholder="Notification title"
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Message
              </label>

              <textarea
                name="message"
                required
                rows={6}
                placeholder="Write your notification..."
                className="w-full rounded-xl bg-slate-900 p-3 text-white placeholder:text-white/30 ring-1 ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Send Notification
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">
            Notification History
          </h2>

          {!notifications ||
            (notifications.length === 0 && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
                No notifications found.
              </div>
            ))}

          <div className="mt-5 space-y-4">
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-yellow-400">
                      {notification.type}
                    </span>

                    <h3 className="mt-1 text-lg font-bold">
                      {notification.title}
                    </h3>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      notification.is_read
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    {notification.is_read
                      ? "Read"
                      : "Unread"}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm text-white/70">
                  {notification.message}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="break-all text-xs text-white/40">
                    Recipient: {notification.recipient_id}
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
