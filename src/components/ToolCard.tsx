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
    <article className="group relative flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:border-primary">
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
          className="group flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400"
          aria-pressed={favorites.includes(tool.id)}
          aria-label="Toggle favorite"
        >
          <Heart size={14} className={favorites.includes(tool.id) ? "text-red-400" : ""} />
          {favorites.includes(tool.id) ? "Saved" : "Save"}
        </button>
      </div>
      <p className="text-sm text-slate-300">{tool.description}</p>
      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
        <span>{tool.pricing}</span>
        <span>{tool.openSource ? "open-source" : "closed"}</span>
        <span>{tool.cnAvailable ? "cn ready" : "global only"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-400"
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
