import Link from "next/link";

import KeywordResearchForm from "@/components/KeywordResearchForm";

const features = [
  {
    title: "Keyword Discovery",
    description: "Find keyword opportunities.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Keyword Analysis",
    description: "Understand keyword demand and competition.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m7 14 4-4 4 4 6-6" />
      </svg>
    ),
  },
  {
    title: "Keyword Organization",
    description: "Organize keywords for further research.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 7V5a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v2" />
        <path d="M4 17v2a1 1 0 0 0 1 1h4l2-2h8a1 1 0 0 0 1-1v-2" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            Google Keyword Research
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Google Keyword Research</h1>
            <p className="hero-subtitle">
              Discover better keywords for your business.
            </p>
            <p className="hero-description">
              Find, analyze and organize keywords to help you discover new
              opportunities.
            </p>
          </div>
        </section>

        <section className="research-entry" aria-labelledby="research-heading">
          <div className="container">
            <h2 id="research-heading" className="section-title">
              Start with a keyword
            </h2>
            <p className="section-lead">
              Enter a keyword below to begin your research.
            </p>
            <div className="research-panel">
              <KeywordResearchForm />
            </div>
            <p className="research-note">
              This is the product entry point only. No keyword data is
              generated or sent anywhere yet.
            </p>
          </div>
        </section>

        <section className="features" aria-labelledby="features-heading">
          <div className="container">
            <h2 id="features-heading" className="section-title">
              What the product will do
            </h2>
            <p className="section-lead">
              These are the product directions for keyword research, not live
              data results.
            </p>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <span className="feature-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Google Keyword Research</span>
          <span>Keyword research tool for discovering and analyzing keywords.</span>
        </div>
      </footer>
    </div>
  );
}
