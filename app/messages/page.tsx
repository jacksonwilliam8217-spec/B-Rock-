import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
    .eq("recipient_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  async function markAsRead(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const messageId = String(
      formData.get("message_id") || ""
    );

    if (!messageId) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("id", messageId)
      .eq("recipient_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/messages");
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
              href="/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Investment Plans
            </a>

            <a
              href="/messages"
              className="text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-sm text-white/50">
          Communication
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Messages
        </h1>

        <p className="mt-2 text-white/50">
          Messages from the B-Rock administration.
        </p>

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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Subject
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {message.subject}
                  </h2>
                </div>

                <span
                  className={
                    message.is_read
                      ? "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/50"
                      : "rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400"
                  }
                >
                  {message.is_read ? "Read" : "Unread"}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap text-white/70">
                {message.body}
              </p>

              <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/40">
                  {new Date(
                    message.created_at
                  ).toLocaleString()}
                </p>

                {!message.is_read && (
                  <form action={markAsRead}>
                    <input
                      type="hidden"
                      name="message_id"
                      value={message.id}
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-300"
                    >
                      Mark as Read
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
