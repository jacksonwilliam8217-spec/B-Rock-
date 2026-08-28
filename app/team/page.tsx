export default function TeamPage() {
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Our Team
        </p>
        <h1 className="mt-4 text-5xl font-bold">People behind B-Rock.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          B-Rock is designed around a professional, transparent and
          customer-focused digital investment experience.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["Investment Strategy", "Focused on providing clear information about available investment opportunities."],
            ["Technology", "Building a secure and accessible digital platform for managing account activity."],
            ["Client Experience", "Focused on making investment information easier to understand and navigate."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-7">
          <h2 className="text-xl font-bold">Our commitment</h2>
          <p className="mt-3 leading-7 text-white/60">
            B-Rock aims to provide clear product information, appropriate
            disclosures and a straightforward customer experience.
          </p>
        </div>
      </section>
    </main>
  );
}
