export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Risk Disclosure</h1>

        <div className="mt-8 space-y-8 text-white/60 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">Market risk</h2>
            <p className="mt-3">
              Financial markets can change rapidly. The value of investments
              may rise or fall depending on the product and market conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">CFD and leveraged products</h2>
            <p className="mt-3">
              Contracts for difference and leveraged products can involve
              significant risk and may not be suitable for every investor.
              Product-specific disclosures must be provided before trading.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">No guaranteed returns</h2>
            <p className="mt-3">
              Investment performance should never be represented as guaranteed
              unless a specific legally valid guarantee actually applies.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
