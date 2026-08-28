export default function FAQPage() {
  const faqs = [
    {
      question: "What is B-Rock?",
      answer:
        "B-Rock is a digital platform designed to organize investment plans, investment activity, deposits, portfolio information, and account communications in one place.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Select the registration option on the platform and provide the information requested by the account creation process. After registration, you can access the areas available to your account.",
    },
    {
      question: "How do investment plans work?",
      answer:
        "Investment plans displayed on B-Rock can include a minimum amount, maximum amount, duration, status, and simulated daily ROI. Users should review the stated terms before selecting a plan.",
    },
    {
      question: "What is shown on my dashboard?",
      answer:
        "The dashboard can display your account information, investment activity, portfolio figures, deposit activity, and other information associated with your account.",
    },
    {
      question: "What does an investment status mean?",
      answer:
        "An investment may be displayed as pending, active, completed, or cancelled. These statuses describe the current state recorded by the platform.",
    },
    {
      question: "How are deposits recorded?",
      answer:
        "Deposit requests can be associated with a user and an investment. Depending on the platform workflow, a request may remain pending until it is reviewed and its status is updated.",
    },
    {
      question: "Are the displayed returns guaranteed?",
      answer:
        "No. The current B-Rock environment contains simulated investment activity and performance information for demonstration and platform-development purposes. Simulated figures are not guaranteed financial returns.",
    },
    {
      question: "What is the source of funds?",
      answer:
        "For the current simulated B-Rock environment, displayed balances and investment activity are part of the platform demonstration. A real-money investment service must provide accurate disclosures regarding the origin, custody, movement, and use of client funds.",
    },
    {
      question: "Does B-Rock hold client funds?",
      answer:
        "The current demonstration environment should not be interpreted as evidence of real-money custody or asset management. Any live financial service must clearly disclose its custody arrangements and the regulated entities responsible for client assets.",
    },
    {
      question: "Are investment profits guaranteed?",
      answer:
        "No. Investment returns are inherently subject to risk. Any figures currently displayed by the B-Rock demonstration platform are simulated and should not be treated as a promise of future performance.",
    },
    {
      question: "Can I withdraw my funds?",
      answer:
        "Withdrawal availability depends on the actual service and its applicable terms. The current B-Rock demonstration environment should not be interpreted as confirmation that real funds are held or that a withdrawal is available.",
    },
    {
      question: "Is B-Rock regulated?",
      answer:
        "Regulatory status must always be stated accurately for the legal entity operating a financial service. The current B-Rock demonstration environment does not by itself establish regulatory authorization.",
    },
    {
      question: "What risks should I consider?",
      answer:
        "Investments can lose value and returns are not guaranteed. Users should consider market risk, liquidity risk, operational risk, counterparty risk, fees, and the regulatory and legal status of any real investment service before committing funds.",
    },
    {
      question: "How can I contact B-Rock?",
      answer:
        "Use the contact or support channel provided by the platform for account-related questions. Never share passwords, authentication codes, private keys, or other sensitive credentials through an unverified communication channel.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-bold text-yellow-400">
            B-Rock
          </a>

          <div className="flex flex-wrap gap-5 text-sm">
            <a href="/" className="text-white/70 hover:text-yellow-400">
              Home
            </a>

            <a href="/about" className="text-white/70 hover:text-yellow-400">
              About
            </a>

            <a
              href="/how-it-works"
              className="text-white/70 hover:text-yellow-400"
            >
              How It Works
            </a>

            <a
              href="/investments"
              className="text-white/70 hover:text-yellow-400"
            >
              Plans
            </a>

            <a
              href="/source-of-funds"
              className="text-white/70 hover:text-yellow-400"
            >
              Source of Funds
            </a>

            <a href="/faq" className="text-yellow-400">
              FAQ
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
          Frequently Asked Questions
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Questions, answered clearly.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          Find answers about B-Rock accounts, investment plans, deposits,
          portfolio information, risk, transparency, and the current
          platform environment.
        </p>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <summary className="cursor-pointer list-none pr-8 text-lg font-bold">
                <div className="flex items-center justify-between gap-4">
                  <span>{faq.question}</span>

                  <span className="text-2xl text-yellow-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>

              <p className="mt-4 max-w-4xl leading-7 text-white/60">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-8">
          <h2 className="text-2xl font-bold text-yellow-400">
            Important Information
          </h2>

          <p className="mt-4 leading-7 text-white/70">
            The current B-Rock environment is a simulated platform
            experience. Displayed balances, investment activity, ROI
            figures, and other performance information should not be
            interpreted as guaranteed financial returns or proof of
            real-world investment performance.
          </p>

          <p className="mt-4 leading-7 text-white/70">
            Before operating a real-money financial service, the
            responsible legal entity should ensure that all regulatory,
            risk, fee, custody, client-asset, and source-of-funds
            disclosures are accurate and appropriate for the jurisdictions
            in which the service operates.
          </p>
        </section>
      </section>
    </main>
  );
}
