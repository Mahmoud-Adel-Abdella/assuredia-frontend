/* Signal Atelier: API boundary stays quiet and explicit so the dashboard can show the real backend signal. */
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/dashboard-api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("assuredia_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("assuredia_token");
      localStorage.removeItem("assuredia_email");
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

export type Status = "PASS" | "FAIL" | null;

export interface ClientSummary {
  id: number;
  client_name: string;
  base_url: string;
  browser: "chrome" | "firefox" | "edge" | string;
  headless: boolean;
  is_active: boolean;
  ai_active: boolean;
  chat_id: string | null;
  notify_policy: "always" | "on_failure" | "never" | string;
  timeout_seconds: number;
  retry_count: number;
  run_timeout_minutes: number;
  last_run_status: Status;
  last_run_timestamp: string | null;
}

export interface Flow {
  id: number;
  flow_name: string;
  is_active: boolean;
  config_flow_id: number | null;
  scheduler_id: number | null;
  cron_expression: string | null;
  scheduler_active: boolean | null;
  webhook_url: string | null;
  next_run_at: string | null;
  last_run_at: string | null;
  is_running: boolean;
  tests?: string[];
}

export interface ClientRecord extends ClientSummary {
  created_at: string;
  site_username: string | null;
  role: string | null;
  config_client_id: number | null;
  username: string | null;
  telegram_username: string | null;
  email: string | null;
  onboarding_token: string | null;
}

export interface RunRecord {
  id: number;
  flow_id: number;
  flow_name: string;
  status: "PASS" | "FAIL";
  browser: string;
  env: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_seconds: number;
  timestamp: string;
  run_id: string;
  ai_report: string | null;
  error_message: string | null;
}

export interface FailureRecord {
  id: number;
  run_id: number;
  test_name: string;
  error_message: string;
  screenshot_path: string | null;
}

export function getApiError(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) return error.response?.data?.error || error.message || fallback;
  return fallback;
}

export const authApi = {
  login: (email: string, password: string) => api.post<{ token: string; email: string }>("/auth/login", { email, password }),
};

export const clientApi = {
  list: () => api.get<ClientSummary[]>("/clients"),
  detail: (id: number) => api.get<{ client: ClientRecord; flows: Flow[] }>(`/clients/${id}`),
  update: (id: number, payload: Record<string, unknown>) => api.put(`/clients/${id}`, payload),
  create: (payload: Record<string, unknown>) => api.post<{ clientId: number; message: string }>("/clients", payload),
  remove: (id: number) => api.delete(`/clients/${id}`),
  runs: (id: number, limit = 50) => api.get<RunRecord[]>(`/clients/${id}/runs?limit=${limit}`),
  failures: (runId: string | number) => api.get<FailureRecord[]>(`/runs/${runId}/failures`),
  runFlow: (clientId: number, flowId: number, payload?: Record<string, unknown>) => api.post(`/clients/${clientId}/flows/${flowId}/run`, payload || {}),
  addFlow: (clientId: number, payload: { flowName: string; tests: string[] }) => api.post(`/clients/${clientId}/flows`, payload),
  updateTests: (flowId: number, tests: string[]) => api.put(`/flows/${flowId}/tests`, { tests }),
  updateSchedule: (flowId: number, payload: { cronExpression: string; isActive: boolean; webhookUrl: string }) => api.patch(`/flows/${flowId}/schedule`, payload),
  deleteSchedule: (flowId: number) => api.delete(`/flows/${flowId}/schedule`),
  deleteFlow: (flowId: number) => api.delete(`/flows/${flowId}`),
};
