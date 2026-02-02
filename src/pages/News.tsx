import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { fetchNews } from "@/services/api";
import { groupByDate } from "@/services/newsService";
import { NewsItem } from "@/types/models";
import { relativeDateLabel } from "@/utils/date";

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("q") ?? "";
  const source = searchParams.get("source") ?? "";

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchNews({ q: query, source }, controller.signal)
      .then((items) => {
        setNews(items);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError((err as Error).message || "Unable to fetch news");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [query, source]);

  const grouped = useMemo(() => groupByDate(news), [news]);
  const sources = useMemo(() => {
    const set = new Set(news.map((entry) => entry.source));
    if (source && !set.has(source)) {
      set.add(source);
    }
    return Array.from(set);
  }, [news, source]);

  return (
    <>
      <Helmet>
        <title>Daily AI News 路 Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Daily AI News</h1>
          <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <label>
              Source
              <select
                value={source}
                onChange={(event) => {
                  const params = new URLSearchParams(searchParams);
                  if (event.target.value) {
                    params.set("source", event.target.value);
                  } else {
                    params.delete("source");
                  }
                  setSearchParams(params);
                }}
                className="ml-1 rounded bg-slate-900/50 px-2 py-1 text-xs text-white"
              >
                <option value="">All</option>
                {sources.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-slate-800/70 bg-slate-900/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([label, entries]) => (
              <div key={label} className="space-y-3">
                <h2 className="text-xs uppercase tracking-[0.4em] text-slate-500">{label}</h2>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <article key={entry.id} className="rounded-2xl border border-slate-800 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{entry.title}</h3>
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-500">{entry.source}</span>
                      </div>
                      <p className="text-sm text-slate-400">{entry.summary}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>{new Date(entry.publishedAt).toLocaleTimeString()}</span>
                        <a href={entry.url} target="_blank" rel="noreferrer" className="text-primary">
                          Read source
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default NewsPage;
