"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectOption } from "@/models/project";
import { useInterestViewModel } from "@/viewmodels/useInterestViewModel";

interface InterestFormProps {
  projectOptions: ProjectOption[];
  defaultProject?: string;
}

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  full?: boolean;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}

function Field({ name, label, error, full = false, children }: FieldProps) {
  const id = `interest-${name}`;
  const errorId = `${id}-error`;
  return (
    <div className={`form-field${full ? " form-field--full" : ""}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p className="form-field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function InterestForm({ projectOptions, defaultProject = "" }: InterestFormProps) {
  const vm = useInterestViewModel(defaultProject);

  if (vm.submitted) {
    return (
      <div className="form-success" role="status">
        <p className="form-success__title">Thank you.</p>
        <p>{vm.message}</p>
        <button type="button" className="text-link" onClick={vm.reset}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={vm.onSubmit} noValidate>
      {vm.status === "error" && vm.message ? (
        <p className="form-alert" role="alert">
          {vm.message}
        </p>
      ) : null}

      <Field name="firstName" label="First Name *" error={vm.errors.firstName}>
        {(props) => (
          <input
            {...props}
            className="form-field__control"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
          />
        )}
      </Field>
      <Field name="lastName" label="Last Name *" error={vm.errors.lastName}>
        {(props) => (
          <input
            {...props}
            className="form-field__control"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
          />
        )}
      </Field>
      <Field name="email" label="Email *" error={vm.errors.email}>
        {(props) => (
          <input
            {...props}
            className="form-field__control"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        )}
      </Field>
      <Field name="phone" label="Phone *" error={vm.errors.phone}>
        {(props) => (
          <input
            {...props}
            className="form-field__control"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+92"
            required
          />
        )}
      </Field>
      <Field name="whatsapp" label="WhatsApp *" error={vm.errors.whatsapp}>
        {(props) => (
          <input
            {...props}
            className="form-field__control"
            name="whatsapp"
            type="tel"
            placeholder="+92"
            required
          />
        )}
      </Field>
      <Field name="unitType" label="Unit Type *" error={vm.errors.unitType}>
        {(props) => (
          <select
            {...props}
            className="form-field__control"
            name="unitType"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select unit type
            </option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        )}
      </Field>
      <Field name="project" label="Interested Project *" error={vm.errors.project} full>
        {(props) => (
          <select
            {...props}
            className="form-field__control"
            name="project"
            defaultValue={vm.defaultProject}
            required
          >
            <option value="" disabled>
              Select a development
            </option>
            {projectOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
            <option value="other">Other / Not sure</option>
          </select>
        )}
      </Field>
      <Field name="message" label="Message" error={vm.errors.message} full>
        {(props) => <textarea {...props} className="form-field__control" name="message" rows={3} />}
      </Field>

      <label className="form-check">
        <input type="checkbox" name="consent" required aria-invalid={Boolean(vm.errors.consent)} />
        <span>
          I agree to be contacted by ABS Developers regarding my enquiry. See our{" "}
          <Link href="/privacy-policy">privacy policy</Link>.
          {vm.errors.consent ? (
            <span className="form-field__error"> {vm.errors.consent}</span>
          ) : null}
        </span>
      </label>

      <button type="submit" className="btn btn--gold" disabled={vm.submitting}>
        {vm.submitting ? "Sending…" : "Submit Interest →"}
      </button>
    </form>
  );
}
