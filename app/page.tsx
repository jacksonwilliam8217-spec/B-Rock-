import CoinTicker from "./components/CoinTicker";
import LiveBlockchainActivity from "./components/LiveBlockchainActivity";
export default function Home() {
  const opportunities = [
    {
      title: "Stocks & Shares",
      description:
        "Explore opportunities across listed companies and equity markets while keeping your investment activity organized in one place.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=85",
      href: "/investments",
    },
    {
      title: "Indices",
      description:
        "Explore major market indices and review available opportunities across different sectors and market categories.",
      image:
        "https://images.unsplash.com/photo-1642790551116-18e150f248e1?auto=format&fit=crop&w=900&q=85",
      href: "/markets",
    },
    {
      title: "Bonds",
      description:
        "Discover bond-related opportunities and review the terms, duration and information available on the platform.",
      image:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=900&q=85",
      href: "/investments",
    },
    {
      title: "Real Estate",
      description:
        "Explore property and real-estate focused opportunities designed around longer-term market participation.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
      href: "/investments",
    },
    {
      title: "Agriculture",
      description:
        "Explore opportunities connected to agriculture, food production and essential industries supporting global markets.",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
      href: "/investments",
    },
    {
      title: "Commodities",
      description:
        "Explore commodity markets including resources, energy and other globally traded market categories.",
      image:
        "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=85",
      href: "/markets",
    },
  ];

  const features = [
    {
      number: "01",
      title: "Multiple Markets",
      text: "Explore opportunities across different market categories from one platform.",
    },
    {
      number: "02",
      title: "Portfolio Control",
      text: "Keep your investment activity, transactions and account information organized.",
    },
    {
      number: "03",
      title: "Simple Account Access",
      text: "Access your dashboard, deposits, messages, profile and investment activity.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      text: "Register your B-Rock account and complete the required account information.",
      icon: "👤",
    },
    {
      number: "02",
      title: "Explore Opportunities",
      text: "Review available investment categories, plans and their stated terms.",
      icon: "🔎",
    },
    {
      number: "03",
      title: "Manage Your Portfolio",
      text: "Monitor your investment activity, transactions and account information from your dashboard.",
      icon: "📊",
    },
  ];

  const faqs = [
    {
      question: "What is B-Rock?",
      answer:
        "B-Rock is a digital investment platform designed to give customers one place to explore investment opportunities and manage their account activity.",
    },
    {
      question: "What investment categories are available?",
      answer:
        "Available categories can include stocks and shares, indices, bonds, real estate, agriculture and commodities.",
    },
    {
      question: "Where can I view my investments?",
      answer:
        "After signing in, your dashboard provides access to your portfolio information and investment activity.",
    },
    {
      question: "Can I manage my account online?",
      answer:
        "Yes. Customers can access their profile, deposits, transactions, messages and other available account features online.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <CoinTicker />
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="/"
            className="text-2xl font-black tracking-tight text-yellow-400"
          >
            B-Rock
          </a>

          <div className="hidden items-center gap-7 text-sm md:flex">
            <a
              href="/investments"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Investments
            </a>

            <a
              href="/markets"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Markets
            </a>

            <a
              href="/about"
              className="text-white/70 transition hover:text-yellow-400"
            >
              About Us
            </a>

            <a
              href="/faq"
              className="text-white/70 transition hover:text-yellow-400"
            >
              FAQ
            </a>

            <a
              href="/contact"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-xl border border-yellow-400/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-400/10"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              Create Account
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.10),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              B-Rock — Invest Beyond Markets
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              Smart Investments.
              <span className="block text-yellow-400">
                Limitless Opportunities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Explore investment opportunities across multiple markets,
              understand the available options and manage your portfolio from
              one modern digital platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/investments"
                className="rounded-xl bg-yellow-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-yellow-300"
              >
                Explore Investments
              </a>

              <a
                href="/register"
                className="rounded-xl border border-yellow-400 px-6 py-3.5 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-950"
              >
                Create Account
              </a>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.number}>
                  <div className="text-sm font-black text-yellow-400">
                    {feature.number}
                  </div>

                  <h3 className="mt-2 font-bold">{feature.title}</h3>

                  <p className="mt-1 text-sm leading-6 text-white/45">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
              <img
                src="/images/brock-hero.jpg"
                alt="Investment portfolio analytics dashboard"
                className="h-[420px] w-full object-cover"
              />

              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-slate-950/90 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40">
                      Portfolio Overview
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      Manage your investments
                    </p>
                  </div>

                  <div className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                    B-Rock
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-white/40">Markets</p>
                    <p className="mt-1 font-bold">Multiple</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-white/40">Portfolio</p>
                    <p className="mt-1 font-bold">Live View</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-white/40">Access</p>
                    <p className="mt-1 font-bold">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            Investment Opportunities
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Diverse Markets.
            <span className="block text-white/70">
              Endless Possibilities.
            </span>
          </h2>

          <p className="mt-5 text-white/50">
            Explore the categories available through the B-Rock platform and
            review the information and terms associated with each opportunity.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.06]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  {item.description}
                </p>

                <div className="mt-5 font-semibold text-yellow-400">
                  Explore Opportunities →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              How It Works
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Simple Steps to Get Started
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              B-Rock brings account management and investment information
              together in one straightforward digital experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-7"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/50 bg-yellow-400/10 text-2xl">
                    {step.icon}
                  </div>

                  <span className="text-sm font-black text-yellow-400">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 leading-7 text-white/50">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Why B-Rock?
            </p>

            <h2 className="mt-3 text-4xl font-black leading-tight">
              A Platform Built Around
              <span className="block text-yellow-400">
                Your Investment Journey
              </span>
            </h2>

            <p className="mt-5 leading-8 text-white/55">
              B-Rock combines investment discovery with practical account
              management tools, giving customers a central place to review
              opportunities and monitor their platform activity.
            </p>

            <div className="mt-8 space-y-5">
              {[
                [
                  "Portfolio Overview",
                  "View your investment activity and account information from your dashboard.",
                ],
                [
                  "Investment History",
                  "Keep track of investment activity and relevant account records.",
                ],
                [
                  "Deposits & Withdrawals",
                  "Access the available funding and withdrawal features associated with your account.",
                ],
                [
                  "Messages & Support",
                  "Stay connected with platform administration through the messaging system.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-slate-950">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/45">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/how-it-works"
              className="mt-8 inline-block font-bold text-yellow-400 hover:text-yellow-300"
            >
              Learn How B-Rock Works →
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="/images/financial-markets.jpg"
              alt="Global financial markets"
              className="h-64 w-full rounded-2xl object-cover"
            />

            <img
              src="/images/financial-analysis.jpg"
              alt="Financial planning and analysis"
              className="h-64 w-full rounded-2xl object-cover"
            />

            <img
              src="/images/professional-meeting.jpg"
              alt="Professional business meeting"
              className="h-64 w-full rounded-2xl object-cover"
            />

            <img
              src="/images/financial-markets.jpg"
              alt="Digital finance and technology"
              className="h-64 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <LiveBlockchainActivity />
      {/* MARKET ACCESS */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                Market Access
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Explore Different
                <span className="block text-yellow-400">
                  Market Categories
                </span>
              </h2>

              <p className="mt-5 leading-8 text-white/50">
                Browse available opportunities and choose the areas of the
                platform that match your interests and investment objectives.
              </p>

              <a
                href="/markets"
                className="mt-7 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-slate-950 hover:bg-yellow-300"
              >
                Explore Markets
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Equity Markets",
                "Global Indices",
                "Fixed Income",
                "Real Estate",
                "Agriculture",
                "Commodities",
              ].map((market, index) => (
                <a
                  href="/markets"
                  key={market}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-yellow-400/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/40">
                      0{index + 1}
                    </span>

                    <span className="text-yellow-400 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-bold">{market}</h3>

                  <p className="mt-2 text-sm text-white/40">
                    View available opportunities
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Questions? We've Got Answers.
          </h2>

          <p className="mt-4 text-white/50">
            Find quick answers about the B-Rock platform and its features.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <summary className="cursor-pointer list-none font-bold">
                <div className="flex items-center justify-between gap-5">
                  <span>{faq.question}</span>
                  <span className="text-xl text-yellow-400 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-white/50">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/faq"
            className="font-bold text-yellow-400 hover:text-yellow-300"
          >
            View All FAQs →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/15 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Start Your B-Rock Journey
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Explore Opportunities.
              <span className="block text-yellow-400">
                Manage Your Future.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">
              Create your B-Rock account and explore the platform's available
              investment categories, account tools and resources.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-slate-950 hover:bg-yellow-300"
              >
                Create Account
              </a>

              <a
                href="/investments"
                className="rounded-xl border border-white/20 px-7 py-3.5 font-bold text-white hover:bg-white/10"
              >
                View Investments
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <a
                href="/"
                className="text-2xl font-black text-yellow-400"
              >
                B-Rock
              </a>

              <p className="mt-4 max-w-xs text-sm leading-7 text-white/40">
                A modern digital platform for exploring investment
                opportunities and managing your account activity.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white">Platform</h3>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                <a
                  href="/investments"
                  className="block hover:text-yellow-400"
                >
                  Investments
                </a>

                <a
                  href="/markets"
                  className="block hover:text-yellow-400"
                >
                  Markets
                </a>

                <a
                  href="/about"
                  className="block hover:text-yellow-400"
                >
                  About Us
                </a>

                <a
                  href="/how-it-works"
                  className="block hover:text-yellow-400"
                >
                  How It Works
                </a>

                <a
                  href="/contact"
                  className="block hover:text-yellow-400"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">Account</h3>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                <a
                  href="/login"
                  className="block hover:text-yellow-400"
                >
                  Login
                </a>

                <a
                  href="/register"
                  className="block hover:text-yellow-400"
                >
                  Create Account
                </a>

                <a
                  href="/dashboard"
                  className="block hover:text-yellow-400"
                >
                  Dashboard
                </a>

                <a
                  href="/profile"
                  className="block hover:text-yellow-400"
                >
                  Profile
                </a>

                <a
                  href="/messages"
                  className="block hover:text-yellow-400"
                >
                  Messages
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">Resources</h3>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                <a
                  href="/faq"
                  className="block hover:text-yellow-400"
                >
                  FAQ
                </a>

                <a
                  href="/fees"
                  className="block hover:text-yellow-400"
                >
                  Fees
                </a>

                <a
                  href="/terms"
                  className="block hover:text-yellow-400"
                >
                  Terms
                </a>

                <a
                  href="/privacy"
                  className="block hover:text-yellow-400"
                >
                  Privacy
                </a>

                <a
                  href="/risk-disclosure"
                  className="block hover:text-yellow-400"
                >
                  Risk Disclosure
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
            <p>© 2026 B-Rock. All rights reserved.</p>

            <div className="flex flex-wrap gap-5">
              <a href="/legal" className="hover:text-yellow-400">
                Legal
              </a>

              <a href="/terms" className="hover:text-yellow-400">
                Terms
              </a>

              <a href="/privacy" className="hover:text-yellow-400">
                Privacy
              </a>

              <a href="/fees" className="hover:text-yellow-400">
                Fees
              </a>

              <a
                href="/risk-disclosure"
                className="hover:text-yellow-400"
              >
                Risk Disclosure
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
