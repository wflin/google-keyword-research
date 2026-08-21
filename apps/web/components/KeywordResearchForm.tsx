"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function KeywordResearchForm() {
  const [keyword, setKeyword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (keyword.trim().length === 0) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <form className="research-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="keyword-input">
        Enter a keyword to research
      </label>
      <input
        id="keyword-input"
        type="search"
        placeholder="Enter a keyword..."
        autoComplete="off"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setSubmitted(false);
        }}
      />
      <button type="submit" disabled={keyword.trim().length === 0}>
        Research
      </button>
      {submitted ? (
        <p className="research-status" role="status">
          Keyword research is not available yet. This entry point will connect
          to real search data in a future release.
        </p>
      ) : null}
    </form>
  );
}
