export default function LegalPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Legal & Regulatory</h1>

        <p className="mt-6 text-lg leading-8 text-white/60">
          B-Rock should identify the legal entity responsible for each service,
          the jurisdictions in which the service is offered, and the relevant
          regulatory status and investor protections.
        </p>

        <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-7">
          <h2 className="text-xl font-bold">Before real-money launch</h2>
          <p className="mt-3 leading-7 text-white/60">
            Regulatory authorisation, licensing, custody, client-money,
            disclosure and jurisdictional requirements must be verified for
            the actual B-Rock business before accepting customer funds.
          </p>
        </div>
      </div>
    </main>
  );
}
