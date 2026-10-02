export type UnitTypePreference = "residential" | "commercial" | "not-sure";

export interface InterestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  unitType: UnitTypePreference;
  /** Project slug, or "other". */
  project: string;
  message?: string;
  consent: true;
  path?: string;
}

export interface SubmissionRecord<T> {
  id: string;
  kind: "interest";
  payload: T;
  createdAt: string;
}

export interface SubmissionResult {
  id: string;
  message: string;
}
