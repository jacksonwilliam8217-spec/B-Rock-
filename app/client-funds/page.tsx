export default function ClientFundsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Client Funds</h1>

        <p className="mt-6 text-lg leading-8 text-white/60">
          Information about deposits, withdrawals, custody and safeguarding
          should accurately describe the arrangements applicable to the actual
          B-Rock service.
        </p>

        <div className="mt-10 space-y-5">
          {[
            "Deposits should be processed through approved payment arrangements.",
            "Withdrawals should follow the applicable account and verification requirements.",
            "Customer funds should be held according to the applicable legal and custody arrangements.",
            "Any segregation, compensation or investor-protection scheme should only be described where it actually applies.",
          ].map((text) => (
            <div key={text} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
