import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, username, role")
    .eq("id", user.id)
    .maybeSingle();

  async function updateProfile(formData: FormData) {
    "use server";

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    const fullName = String(
      formData.get("full_name") || ""
    ).trim();

    const username = String(
      formData.get("username") || ""
    ).trim();

    if (!fullName || !username) {
      throw new Error(
        "Full name and username are required."
      );
    }

    const { error } = await client
      .from("profiles")
      .update({
        full_name: fullName,
        username,
      })
      .eq("id", currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/profile");
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
              Plans
            </a>

            <a
              href="/profile"
              className="text-yellow-400"
            >
              Profile
            </a>

            <a
              href="/messages"
              className="text-white/70 hover:text-yellow-400"
            >
              Messages
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-white/50">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Profile
        </h1>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            Unable to load your profile.
          </div>
        )}

        {profile && (
          <form
            action={updateProfile}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div>
              <label
                htmlFor="full_name"
                className="mb-2 block text-sm text-white/60"
              >
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10 outline-none focus:ring-yellow-400"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="username"
                className="mb-2 block text-sm text-white/60"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                defaultValue={profile.username ?? ""}
                required
                className="w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-white/10 outline-none focus:ring-yellow-400"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-white/60"
              >
                Email
              </label>

              <input
                id="email"
                value={profile.email ?? user.email ?? ""}
                disabled
                className="w-full rounded-xl bg-slate-900/60 p-3 text-white/50 ring-1 ring-white/10"
              />
            </div>

            <div className="mt-5">
              <p className="text-sm text-white/50">
                Account Role
              </p>

              <p className="mt-1 capitalize text-white">
                {profile.role}
              </p>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
            >
              Save Profile
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

