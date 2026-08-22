import Link from "next/link";
import type { Metadata } from "next";

import ResearchDetail from "@/components/ResearchDetail";

export const metadata: Metadata = {
  title: "Research — Google Keyword Research",
};

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ researchId: string }>;
}) {
  const { researchId } = await params;

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
            <Link className="nav-link" href="/researches/new">
              New Research
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <ResearchDetail researchId={researchId} />
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
