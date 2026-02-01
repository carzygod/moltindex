import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { getNews } from "@/services/newsService";
import { relativeDateLabel } from "@/utils/date";

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const source = searchParams.get("source") ?? "";

  const news = useMemo(() => {
    const base = getNews();
    return base
      .filter((item) => (source ? item.source === source : true))
      .filter((item) => {
        if (!query) return true;
        const lowered = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(lowered) ||
          item.summary.toLowerCase().includes(lowered) ||
          item.source.toLowerCase().includes(lowered)
        );
      });
  }, [query, source]);

  const grouped = useMemo(() => {
    const days: Record<string, typeof news> = {};
    news.forEach((item) => {
      const label = relativeDateLabel(item.publishedAt);
      if (!days[label]) {
        days[label] = [];
      }
      days[label].push(item);
    });
    return days;
  }, [news]);

  const sources = Array.from(new Set(getNews().map((item) => item.source)));

  return (
    <>
      <Helmet>
        <title>Daily AI News · Moltindex</title>
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
      </section>
    </>
  );
};

export default NewsPage;
