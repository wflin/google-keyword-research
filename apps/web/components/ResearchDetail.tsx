"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ApiError,
  getResearch,
  getResearchJobs,
  runResearch,
  type Research,
  type ResearchJob,
} from "@/lib/api";

const RESEARCH_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

const JOB_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

function formatDate(value: string | null): string {
  if (value === null) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toLoadError(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return "Research not found.";
  }
  if (!(error instanceof ApiError)) {
    return "Unable to connect to the API.";
  }
  return "Failed to load research. Please try again.";
}

function toRunError(error: unknown): string {
  if (error instanceof ApiError && typeof error.detail === "string") {
    return error.detail;
  }
  return "Failed to run research. Please try again.";
}

async function fetchResearchData(researchId: string) {
  const [researchData, jobsData] = await Promise.all([
    getResearch(researchId),
    getResearchJobs(researchId),
  ]);
  return { research: researchData, jobs: jobsData };
}

export default function ResearchDetail({
  researchId,
}: {
  researchId: string;
}) {
  const [research, setResearch] = useState<Research | null>(null);
  const [jobs, setJobs] = useState<ResearchJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const data = await fetchResearchData(researchId);
        if (ignore) {
          return;
        }
        setResearch(data.research);
        setJobs(data.jobs.items);
      } catch (error) {
        if (ignore) {
          return;
        }
        setResearch(null);
        setJobs([]);
        setLoadError(toLoadError(error));
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    void loadInitial();
    return () => {
      ignore = true;
    };
  }, [researchId]);

  async function reload() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchResearchData(researchId);
      setResearch(data.research);
      setJobs(data.jobs.items);
    } catch (error) {
      setResearch(null);
      setJobs([]);
      setLoadError(toLoadError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleRun() {
    setRunning(true);
    setRunError(null);
    try {
      await runResearch(researchId);
      await reload();
    } catch (error) {
      setRunError(toRunError(error));
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <p className="detail-status" role="status">
        Loading research...
      </p>
    );
  }

  if (loadError !== null || research === null) {
    const notFound = loadError === "Research not found.";
    return (
      <div className="detail-state">
        <h2>{notFound ? "Research not found" : "Something went wrong"}</h2>
        <p className="detail-state-message">{loadError}</p>
        <div className="detail-actions">
          <Link className="btn" href="/">
            Back to Home
          </Link>
          <Link className="btn btn-secondary" href="/researches/new">
            Create Research
          </Link>
          {notFound ? null : (
            <button className="btn btn-secondary" onClick={() => void reload()}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="detail-header" aria-labelledby="detail-title">
        <div className="container">
          <div className="detail-title-row">
            <h1 id="detail-title">{research.name}</h1>
            <span
              className={`status-badge status-${research.status}`}
              data-status={research.status}
            >
              {RESEARCH_STATUS_LABELS[research.status] ?? research.status}
            </span>
          </div>
          <dl className="detail-facts">
            <div>
              <dt>Seed Keyword</dt>
              <dd>{research.seed_keyword}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{research.country_code}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{research.language_code}</dd>
            </div>
            <div>
              <dt>Created At</dt>
              <dd>{formatDate(research.created_at)}</dd>
            </div>
            <div>
              <dt>Updated At</dt>
              <dd>{formatDate(research.updated_at)}</dd>
            </div>
          </dl>
          {research.description ? (
            <div className="detail-description">
              <h2>Description</h2>
              <p>{research.description}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="detail-jobs" aria-labelledby="jobs-heading">
        <div className="container">
          <div className="detail-section-head">
            <h2 id="jobs-heading">Jobs</h2>
            {research.status === "draft" ? (
              <button
                className="btn"
                type="button"
                onClick={() => void handleRun()}
                disabled={running}
              >
                {running ? "Running..." : "Run Research"}
              </button>
            ) : null}
          </div>

          {running ? (
            <p className="detail-status" role="status">
              Running research...
            </p>
          ) : null}
          {runError ? (
            <p className="form-error" role="alert">
              {runError}
            </p>
          ) : null}

          {jobs.length === 0 ? (
            <p className="detail-empty">
              No jobs yet. Run the research to create one.
            </p>
          ) : (
            <ul className="job-list">
              {jobs.map((job) => (
                <li className="job-card" key={job.id}>
                  <div className="job-card-head">
                    <span className="job-id">Job {job.id}</span>
                    <span
                      className={`status-badge job-status-${job.status}`}
                      data-status={job.status}
                    >
                      {JOB_STATUS_LABELS[job.status] ?? job.status}
                    </span>
                  </div>
                  <dl className="job-facts">
                    <div>
                      <dt>Started At</dt>
                      <dd>{formatDate(job.started_at)}</dd>
                    </div>
                    <div>
                      <dt>Finished At</dt>
                      <dd>{formatDate(job.finished_at)}</dd>
                    </div>
                    <div>
                      <dt>Created At</dt>
                      <dd>{formatDate(job.created_at)}</dd>
                    </div>
                  </dl>
                  {job.error_message ? (
                    <p className="job-error" role="alert">
                      {job.error_message}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
