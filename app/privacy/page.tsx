export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-2xl font-bold text-yellow-400">B-Rock</a>
        <h1 className="mt-10 text-4xl font-bold">Privacy Policy</h1>

        <div className="mt-8 space-y-8 text-white/60 leading-7">
          <section>
            <h2 className="text-xl font-bold text-white">Information we collect</h2>
            <p className="mt-3">
              The final policy should explain what account, identity,
              transaction, technical and communication information is
              collected and why it is required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">How information is used</h2>
            <p className="mt-3">
              Information may be used to provide account services, security,
              compliance, customer support and platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Your rights</h2>
            <p className="mt-3">
              The final published policy should describe applicable privacy
              rights, retention periods, data-sharing practices and contact
              procedures.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
