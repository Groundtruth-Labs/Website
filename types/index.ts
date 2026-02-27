export type DeliverableType =
  | "ndvi"
  | "orthomosaic"
  | "change_detection"
  | "report"
  | "site_progress";

export type ProjectStatus = "active" | "completed" | "pending";
export type ProjectType = "agriculture" | "construction";
export type Industry = "agriculture" | "construction" | "solar" | "golf";

export interface Client {
  id: string;
  user_id: string;
  company_name: string | null;
  industry: Industry | null;
  contact_name: string | null;
  contact_email: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  type: ProjectType | null;
  status: ProjectStatus;
  location: string | null;
  started_at: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  name: string;
  type: DeliverableType | null;
  file_url: string | null;
  captured_at: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  project_id: string;
  title: string;
  summary: string | null;
  recommendations: string | null;
  created_at: string;
}
