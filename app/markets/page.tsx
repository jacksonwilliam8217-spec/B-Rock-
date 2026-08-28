export default function MarketsPage() {
  const markets = [
    {
      title: "Stocks & Shares",
      description:
        "Explore equity markets and opportunities connected to publicly traded companies.",
      label: "Equities",
    },
    {
      title: "Indices",
      description:
        "Explore broad market benchmarks representing groups of securities.",
      label: "Market Indices",
    },
    {
      title: "Bonds",
      description:
        "Review fixed-income opportunities and their applicable terms.",
      label: "Fixed Income",
    },
    {
      title: "Real Estate",
      description:
        "Explore opportunities connected to property and real-estate assets.",
      label: "Property",
    },
    {
      title: "Agriculture",
      description:
        "Explore opportunities connected to agricultural production and assets.",
      label: "Agriculture",
    },
    {
      title: "Commodities",
      description:
        "Explore commodity-related markets and available opportunities.",
      label: "Commodities",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-950 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/investments"
              className="hidden text-sm text-white/70 hover:text-yellow-400 sm:block"
            >
              Investment Opportunities
            </a>

            <a
              href="/login"
              className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-950"
            >
              Account
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Markets
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            Explore multiple markets from one platform.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            B-Rock brings different market categories together so users can
            explore opportunities and review the information associated with
            each product.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <div
              key={market.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-yellow-400/30"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                  {market.label}
                </span>

                <span className="text-yellow-400">◆</span>
              </div>

              <h2 className="mt-6 text-2xl font-bold">{market.title}</h2>

              <p className="mt-3 text-sm leading-6 text-white/50">
                {market.description}
              </p>

              <a
                href="/investments"
                className="mt-7 inline-block text-sm font-semibold text-yellow-400 hover:text-yellow-300"
              >
                View opportunities →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-7">
          <h2 className="text-xl font-bold">Important information</h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/60">
            Availability of investment and trading products depends on the
            applicable product terms, customer eligibility, jurisdiction,
            regulatory requirements and other conditions. Product-specific
            fees and risk information should be reviewed before investing or
            trading.
          </p>
        </div>
      </section>
    </main>
  );
}
