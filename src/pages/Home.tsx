import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getCategories, getTools } from "@/services/toolService";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import { ToolCardSkeleton } from "@/components/Skeletons";
import { useAppState } from "@/app/AppStateContext";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const tools = useMemo(() => getTools(), []);
  const categories = useMemo(() => getCategories(), []);
  const { recentlyViewed } = useAppState();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const hotTools = useMemo(() => [...tools].sort((a, b) => b.popularity - a.popularity).slice(0, 6), [tools]);
  const newestTools = useMemo(() => [...tools].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 8), [tools]);

  const lastVisitedTools = useMemo(
    () => recentlyViewed.map((id) => tools.find((tool) => tool.id === id)).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool)),
    [recentlyViewed, tools],
  );

  return (
    <>
      <Helmet>
        <title>Moltindex · Agent Tool Atlas</title>
        <meta name="description" content="Browse agent tools curated by Moltbook explorers." />
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/40">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Hot picks</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Moltindex Tool Atlas</h1>
        <p className="text-slate-400">Curated AI agent tools, updated daily with local data.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {loading
            ? [1, 2, 3].map((id) => <div key={id} className="h-24 rounded-2xl bg-slate-800/60" />)
            : hotTools.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-slate-200"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{tool.pricing}</p>
                  <p className="mt-2 text-lg font-semibold">{tool.name}</p>
                  <p className="text-sm text-slate-400">{tool.tagline}</p>
                </div>
              ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Latest recordings</p>
          <span className="text-slate-400 text-sm">Newly added in the last days</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? [1, 2].map((id) => <ToolCardSkeleton key={id} />)
            : newestTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.4em] text-slate-500">Categories</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} toolCount={tools.filter((tool) => tool.categories.includes(category.id)).length} />
          ))}
        </div>
      </section>

      {lastVisitedTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.4em] text-slate-500">Recently viewed</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {lastVisitedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;
