export default function FeesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Fees & Pricing</h1>

        <p className="mt-6 text-lg leading-8 text-white/60">
          B-Rock should display applicable charges clearly before a customer
          confirms a transaction.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            ["Trading Fees", "Displayed according to the applicable product and service."],
            ["Deposit Fees", "Any applicable payment-processing charges should be disclosed before confirmation."],
            ["Withdrawal Fees", "Applicable withdrawal charges should be displayed before the withdrawal is submitted."],
            ["Other Charges", "Any administration, custody or service charges should be disclosed where applicable."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
