import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { fetchNews } from "@/services/api";
import { NewsItem } from "@/types/models";
import { format } from "date-fns";

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchNews({ q: query }, controller.signal)
      .then((items) => setNews(items))
      .catch((err) => {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError((err as Error).message || "Unable to fetch news");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query]);

  const sorted = useMemo(
    () => [...news].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [news],
  );

  return (
    <>
      <Helmet>
        <title>Daily AI News 路 Moltindex</title>
      </Helmet>
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Daily AI News</h1>
          <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <label className="flex items-center gap-1">
              Filter
              <input
                type="search"
                placeholder="Search tools or tags"
                value={query}
                onChange={(event) => {
                  const params = new URLSearchParams(searchParams);
                  if (event.target.value) {
                    params.set("q", event.target.value);
                  } else {
                    params.delete("q");
                  }
                  setSearchParams(params);
                }}
                className="ml-1 w-36 rounded bg-slate-900/50 px-2 py-1 text-xs text-white placeholder:text-slate-500"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl border border-slate-800/50 bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-slate-800 p-4 transition hover:border-white/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{entry.name}</h2>
                    <p className="text-sm text-slate-400">{entry.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {format(new Date(entry.updatedAt), "yyyy-MM-dd HH:mm")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  <span>Rating: {entry.rating?.toFixed(1) ?? "0.0"}</span>
                  <span>Category: {entry.category ?? "uncategorized"}</span>
                  {entry.tags?.map((tag) => (
                    <span key={`${entry.id}-${tag}`} className="rounded-full border border-slate-700 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-primary">
                  <a href={`/tools/${entry.id}`} className="underline">
                    View in catalog
                  </a>
                  {entry.url && (
                    <a href={entry.url} target="_blank" rel="noreferrer" className="underline">
                      Visit site
                    </a>
                  )}
                  {entry.sourceUrl && (
                    <span className="text-slate-500">source: {new URL(entry.sourceUrl).host}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default NewsPage;
