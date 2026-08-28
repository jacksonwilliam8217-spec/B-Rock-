import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminMessagesPage() {
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

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, username, email")
    .order("full_name", { ascending: true });

  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      id,
      sender_id,
      recipient_id,
      subject,
      body,
      is_read,
      created_at
    `)
    .order("created_at", { ascending: false });

  async function sendMessage(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfile?.role !== "admin") {
      redirect("/dashboard");
    }

    const recipientId = String(
      formData.get("recipient_id") || ""
    );

    const subject = String(
      formData.get("subject") || ""
    ).trim();

    const body = String(
      formData.get("body") || ""
    ).trim();

    if (!recipientId || !subject || !body) {
      throw new Error(
        "Recipient, subject, and message are required."
      );
    }

    const { error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        subject,
        body,
        is_read: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/messages");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-yellow-400"
          >
            B-Rock
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a
              href="/dashboard"
              className="text-white/70 hover:text-yellow-400"
            >
              Dashboard
            </a>

            <a
              href="/admin/plans"
              className="text-white/70 hover:text-yellow-400"
            >
              Plans
            </a>

            <a
              href="/admin/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/admin/deposits"
              className="text-white/70 hover:text-yellow-400"
            >
              Deposits
            </a>

            <a
              href="/admin/messages"
              className="text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-white/50">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Message Management
        </h1>

        <p className="mt-2 text-white/50">
          Send and manage platform messages.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">
            Compose Message
          </h2>

          <form
            action={sendMessage}
            className="mt-5 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Recipient
              </label>

              <select
                name="recipient_id"
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              >
                <option value="">
                  Select a user
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
                Subject
              </label>

              <input
                name="subject"
                type="text"
                required
                placeholder="Message subject"
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Message
              </label>

              <textarea
                name="body"
                required
                rows={6}
                placeholder="Write your message..."
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Database Error
            </p>

            <p className="mt-2 text-sm">
              {error.message}
            </p>
          </div>
        )}

        {!error && (!messages || messages.length === 0) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
            No messages found.
          </div>
        )}

        <div className="mt-8 space-y-5">
          {messages?.map((message) => (
            <div
              key={message.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Subject
                  </p>

                  <h2 className="mt-1 text-lg font-bold">
                    {message.subject}
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                  {message.is_read ? "Read" : "Unread"}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap text-sm text-white/70">
                {message.body}
              </p>

              <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Sender ID
                  </p>

                  <p className="mt-1 break-all text-sm">
                    {message.sender_id || "System"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Recipient ID
                  </p>

                  <p className="mt-1 break-all text-sm">
                    {message.recipient_id || "System"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs text-white/40">
                {new Date(
                  message.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

