export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
          <a href="/login" className="rounded-lg bg-yellow-400 px-5 py-2.5 font-bold text-slate-950">
            Account
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Contact Us
        </p>
        <h1 className="mt-4 text-5xl font-bold">How can we help?</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          Contact B-Rock for questions about your account, investment
          opportunities, platform features or general enquiries.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-bold">Customer Support</h2>
            <p className="mt-3 text-white/50">
              For account and platform-related enquiries.
            </p>
            <div className="mt-5 text-yellow-400">support@b-rock.example</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-xl font-bold">General Enquiries</h2>
            <p className="mt-3 text-white/50">
              For general questions about B-Rock and its services.
            </p>
            <div className="mt-5 text-yellow-400">info@b-rock.example</div>
          </div>
        </div>

        <p className="mt-8 text-sm leading-6 text-white/40">
          Replace these placeholder addresses with the verified official
          B-Rock contact details before publishing the website.
        </p>
      </section>
    </main>
  );
}
