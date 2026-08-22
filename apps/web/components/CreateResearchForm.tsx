"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { ApiError, createResearch } from "@/lib/api";

const COUNTRY_CODES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

const LANGUAGE_CODES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

type FieldErrors = {
  name?: string;
  seed_keyword?: string;
};

function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (typeof error.detail === "string" && error.detail.trim().length > 0) {
      return error.detail;
    }
    if (error.status === 422) {
      return "Please check the form and try again.";
    }
    return "Failed to create research. Please try again.";
  }
  return "Unable to connect to the API.";
}

export default function CreateResearchForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [seedKeyword, setSeedKeyword] = useState("");
  const [description, setDescription] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [languageCode, setLanguageCode] = useState("en");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: FieldErrors = {};
    if (name.trim().length === 0) {
      errors.name = "Research Name is required.";
    } else if (name.trim().length > 200) {
      errors.name = "Research Name must be 200 characters or fewer.";
    }
    if (seedKeyword.trim().length === 0) {
      errors.seed_keyword = "Seed Keyword is required.";
    }

    setFieldErrors(errors);
    setFormError(null);
    if (errors.name !== undefined || errors.seed_keyword !== undefined) {
      return;
    }

    setSubmitting(true);
    try {
      const research = await createResearch({
        name: name.trim(),
        seed_keyword: seedKeyword.trim(),
        description: description.trim() || null,
        country_code: countryCode,
        language_code: languageCode,
      });
      router.push(`/researches/${research.id}`);
    } catch (error) {
      setFormError(toUserMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="research-name">Research Name</label>
        <input
          id="research-name"
          type="text"
          required
          maxLength={200}
          autoComplete="off"
          value={name}
          disabled={submitting}
          aria-invalid={fieldErrors.name !== undefined}
          aria-describedby={fieldErrors.name ? "research-name-error" : undefined}
          onChange={(event) => {
            setName(event.target.value);
            if (fieldErrors.name !== undefined) {
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }
          }}
        />
        {fieldErrors.name ? (
          <p className="field-error" id="research-name-error" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="seed-keyword">Seed Keyword</label>
        <input
          id="seed-keyword"
          type="text"
          required
          autoComplete="off"
          value={seedKeyword}
          disabled={submitting}
          aria-invalid={fieldErrors.seed_keyword !== undefined}
          aria-describedby={
            fieldErrors.seed_keyword ? "seed-keyword-error" : undefined
          }
          onChange={(event) => {
            setSeedKeyword(event.target.value);
            if (fieldErrors.seed_keyword !== undefined) {
              setFieldErrors((current) => ({
                ...current,
                seed_keyword: undefined,
              }));
            }
          }}
        />
        {fieldErrors.seed_keyword ? (
          <p className="field-error" id="seed-keyword-error" role="alert">
            {fieldErrors.seed_keyword}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="research-description">Description</label>
        <textarea
          id="research-description"
          rows={4}
          value={description}
          disabled={submitting}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="country-code">Country</label>
          <select
            id="country-code"
            value={countryCode}
            disabled={submitting}
            onChange={(event) => setCountryCode(event.target.value)}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="language-code">Language</label>
          <select
            id="language-code"
            value={languageCode}
            disabled={submitting}
            onChange={(event) => setLanguageCode(event.target.value)}
          >
            {LANGUAGE_CODES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Research"}
        </button>
        {submitting ? (
          <p className="form-status" role="status">
            Creating your research project...
          </p>
        ) : null}
      </div>
    </form>
  );
}
