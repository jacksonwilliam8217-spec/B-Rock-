export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Terms of Service</h1>

        <div className="mt-8 space-y-8 text-white/60 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">Use of the platform</h2>
            <p className="mt-3">
              These terms govern use of the B-Rock digital platform and its
              account, information and investment-related features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Investment products</h2>
            <p className="mt-3">
              Product availability, eligibility, fees, risks and applicable
              conditions must be reviewed before a customer uses a real-money
              investment service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Regulatory information</h2>
            <p className="mt-3">
              B-Rock must accurately identify the legal entity providing each
              service and the regulatory framework applicable to that service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
