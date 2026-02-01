import { Link, useLocation } from "react-router-dom";
import { Heart, Star, ExternalLink } from "lucide-react";
import { Tool } from "@/types/models";
import { highlightTerm } from "@/utils/highlight";
import { useAppState } from "@/app/AppStateContext";

interface ToolCardProps {
  tool: Tool;
  searchTerm?: string;
}

const ToolCard = ({ tool, searchTerm }: ToolCardProps) => {
  const { favorites, toggleFavorite } = useAppState();
  const location = useLocation();
  const parts = highlightTerm(tool.name, searchTerm);

  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#010409] px-5 py-6 shadow-[0_25px_50px_rgba(2,6,23,0.6)] transition hover:-translate-y-1 hover:border-primary">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/tools/${tool.id}`} className="text-xl font-semibold text-white">
            {parts.map((segment, index) =>
              typeof segment === "string" ? (
                segment
              ) : (
                <span key={index} className="text-primary">
                  {segment.match}
                </span>
              ),
            )}
          </Link>
          <p className="text-sm text-slate-400">{tool.tagline}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(tool.id)}
          className="group flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-200 transition hover:border-white hover:text-white"
          aria-pressed={favorites.includes(tool.id)}
          aria-label="Toggle favorite"
        >
          <Heart size={14} className={favorites.includes(tool.id) ? "text-rose-400" : "text-slate-300"} />
          {favorites.includes(tool.id) ? "Saved" : "Save"}
        </button>
      </div>
      <p className="text-sm text-slate-300">{tool.description}</p>
      <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span>{tool.pricing}</span>
        <span>{tool.openSource ? "open-source" : "closed"}</span>
        <span>{tool.cnAvailable ? "cn ready" : "global only"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
        <span className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400" />
          {tool.rating.toFixed(1)}
        </span>
        <Link
          to={`/tools/${tool.id}`}
          state={{ from: location.pathname + location.search }}
          className="flex items-center gap-2 text-primary"
        >
          View Tool
          <ExternalLink size={14} />
        </Link>
      </div>
    </article>
  );
};

export default ToolCard;
