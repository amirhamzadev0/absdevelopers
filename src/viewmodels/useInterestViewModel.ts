"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { SubmissionResult } from "@/models/submission";
import { ApiError, apiRequest } from "@/utils/http-client";

type Status = "idle" | "submitting" | "success" | "error";

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

export function useInterestViewModel(defaultProject = "") {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("submitting");
    setErrors({});
    setMessage("");
    try {
      const result = await apiRequest<SubmissionResult>("submitInterest", {
        method: "POST",
        body: JSON.stringify({
          firstName: field(form, "firstName"),
          lastName: field(form, "lastName"),
          email: field(form, "email"),
          phone: field(form, "phone"),
          whatsapp: field(form, "whatsapp"),
          unitType: field(form, "unitType"),
          project: field(form, "project"),
          message: field(form, "message") || undefined,
          consent: form.get("consent") === "on",
          path: window.location.pathname,
        }),
      });
      setStatus("success");
      setMessage(result.message);
    } catch (error) {
      setStatus("error");
      if (error instanceof ApiError) {
        setErrors(error.fields);
        setMessage(
          Object.keys(error.fields).length ? "Please check the highlighted fields." : error.message,
        );
      } else {
        setMessage("We couldn’t send your details. Please try again or call us.");
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setErrors({});
  }, []);

  return {
    defaultProject,
    status,
    message,
    errors,
    submitting: status === "submitting",
    submitted: status === "success",
    onSubmit,
    reset,
  };
}
