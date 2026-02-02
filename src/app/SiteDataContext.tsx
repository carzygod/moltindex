import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchSites, ApiSitePayload } from "@/services/api";
import { Tool, Pricing } from "@/types/models";

interface SiteDataValue {
  tools: Tool[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataValue | undefined>(undefined);

const normalizeRating = (site: ApiSitePayload): number => {
  if (typeof site.rating === "number") {
    return Math.min(5, Math.max(0, Number(site.rating.toFixed(1))));
  }
  if (site.ratingCount && site.ratingSum) {
    const average = site.ratingSum / site.ratingCount;
    return Math.min(5, Math.max(0, Number(average.toFixed(1))));
  }
  return 0;
};

const toTool = (site: ApiSitePayload): Tool => ({
  id: site.id,
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  url: site.url,
  categories: site.categories ?? [],
  tags: site.tags ?? [],
  pricing: (site.pricing ?? "free") as Pricing,
  openSource: site.openSource ?? false,
  cnAvailable: site.cnAvailable ?? false,
  popularity: site.popularity ?? 0,
  rating: normalizeRating(site),
  createdAt: site.createdAt ?? new Date().toISOString(),
  updatedAt: site.updatedAt ?? site.createdAt ?? new Date().toISOString(),
  coverImage: site.coverImage,
});

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sites = await fetchSites();
      const normalizedSites = Array.isArray(sites) ? sites : [];
      if (!Array.isArray(sites)) {
        console.warn("Site data was not an array; defaulting to empty list", sites);
      }
      setTools(normalizedSites.map(toTool));
    } catch (err) {
      console.error("Failed to load Moltindex API data", err);
      setError((err as Error).message || "Unable to reach Moltindex API");
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const refresh = useCallback(async () => {
    await loadSites();
  }, [loadSites]);

  return (
    <SiteDataContext.Provider value={{ tools, loading, error, refresh }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return context;
};
