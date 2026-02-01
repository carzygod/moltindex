import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getToolById, getRelatedTools } from "@/services/toolService";
import { formatDate } from "@/utils/date";
import ToolCard from "@/components/ToolCard";
import { useAppState } from "@/app/AppStateContext";

const ToolDetailPage = () => {
  const { toolId } = useParams();
  const tool = useMemo(() => (toolId ? getToolById(toolId) : undefined), [toolId]);
  const related = useMemo(() => (tool ? getRelatedTools(tool) : []), [tool]);
  const { recordVisit, favorites, toggleFavorite } = useAppState();

  useEffect(() => {
    if (tool) {
      recordVisit(tool.id);
    }
  }, [tool, recordVisit]);

  if (!tool) {
    return (
      <div className="rounded-2xl border border-red-500 p-4 text-red-400">
        Tool not found.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tool.name} · Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{tool.pricing}</p>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <p className="text-slate-400">{tool.tagline}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(tool.id)}
            className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.3em]"
          >
            {favorites.includes(tool.id) ? "Unfavorite" : "Save"}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm text-slate-400">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700/80 px-3 py-1 text-[11px] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>{tool.openSource ? "Open source" : "Closed"}</span>
              <span>{tool.cnAvailable ? "CN available" : "Global only"}</span>
              <span>Added {formatDate(tool.createdAt)}</span>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black"
            >
              Visit tool
            </a>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
            <div className="h-56 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-slate-500">
              <p className="pt-5 text-center text-sm">Screenshot placeholder</p>
            </div>
            <div className="mt-4 space-y-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <p>Rating: {tool.rating.toFixed(1)}</p>
              <p>Updated: {formatDate(tool.updatedAt)}</p>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.4em] text-slate-500">Related tools</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <ToolCard key={item.id} tool={item} searchTerm={tool.tagline} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ToolDetailPage;
