import { Helmet } from "react-helmet-async";
import ToolCard from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/Skeletons";
import { useAppState } from "@/app/AppStateContext";
import { useSiteData } from "@/app/SiteDataContext";

const FavoritesPage = () => {
  const { favorites } = useAppState();
  const { tools, loading } = useSiteData();
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

  return (
    <>
      <Helmet>
        <title>Favorites · Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <ToolCardSkeleton key={`favorites-loading-${index}`} />
            ))}
          </div>
        ) : favoriteTools.length === 0 ? (
          <p className="text-slate-400">No favorites yet. Save a tool to start collecting.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default FavoritesPage;
