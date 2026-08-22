import Link from "next/link";
import type { Metadata } from "next";

import CreateResearchForm from "@/components/CreateResearchForm";

export const metadata: Metadata = {
  title: "Create Research Project — Google Keyword Research",
};

export default function NewResearchPage() {
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
            <Link
              className="nav-link nav-link-active"
              href="/researches/new"
              aria-current="page"
            >
              New Research
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="create-page" aria-labelledby="create-heading">
          <div className="container">
            <h1 id="create-heading">Create Research Project</h1>
            <p className="section-lead">
              Start a new keyword research project.
            </p>
            <div className="create-panel">
              <CreateResearchForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Google Keyword Research</span>
          <span>
            Keyword research tool for discovering and analyzing keywords.
          </span>
        </div>
      </footer>
    </div>
  );
}
