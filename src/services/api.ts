import { Category, NewsItem } from "@/types/models";

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000").replace(/\/+$/, "");

const parseResponse = async (response: Response) => {
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = (data as { message?: string })?.message ?? response.statusText;
    throw new Error(errorMessage);
  }

  return data;
};

export interface ApiSitePayload {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  categories?: string[];
  tags?: string[];
  pricing?: Pricing;
  openSource?: boolean;
  cnAvailable?: boolean;
  popularity?: number;
  rating?: number;
  ratingSum?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
  coverImage?: string;
}

export interface SiteStatus {
  status: "ok" | "warning" | "offline";
  timestamp: string;
}

const apiFetch = (path: string, options?: RequestInit) =>
  fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

export const fetchStatus = async (): Promise<SiteStatus> => {
  const response = await apiFetch("/api/status");
  return parseResponse(response);
};

export interface SitesQuery {
  q?: string;
  category?: string;
  tags?: string[];
  random?: number;
}

const buildQueryString = (params?: SitesQuery) => {
  if (!params) {
    return "";
  }
  const query = new URLSearchParams();
  if (params.q) {
    query.set("q", params.q);
  }
  if (params.category) {
    query.set("category", params.category);
  }
  if (params.tags && params.tags.length > 0) {
    query.set("tags", params.tags.join(","));
  }
  if (params.random !== undefined) {
    query.set("random", params.random.toString());
  }
  const str = query.toString();
  return str ? `?${str}` : "";
};

export const fetchSites = async (params?: SitesQuery): Promise<ApiSitePayload[]> => {
  const response = await apiFetch(`/api/sites${buildQueryString(params)}`);
  return parseResponse(response);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiFetch("/api/categories");
  return parseResponse(response);
};

export interface NewsQuery {
  q?: string;
  source?: string;
}

export const fetchNews = async (params?: NewsQuery, signal?: AbortSignal): Promise<NewsItem[]> => {
  const queryString = params
    ? `?${Object.entries(params)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`)
        .join("&")}`
    : "";
  const response = await apiFetch(`/api/news${queryString}`, { signal });
  return parseResponse(response);
};
