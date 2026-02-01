import { Helmet } from "react-helmet-async";
import { getTools } from "@/services/toolService";
import ToolCard from "@/components/ToolCard";
import { useAppState } from "@/app/AppStateContext";

const FavoritesPage = () => {
  const { favorites } = useAppState();
  const tools = getTools().filter((tool) => favorites.includes(tool.id));

  return (
    <>
      <Helmet>
        <title>Favorites · Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        {tools.length === 0 ? (
          <p className="text-slate-400">No favorites yet. Save a tool to start collecting.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default FavoritesPage;
