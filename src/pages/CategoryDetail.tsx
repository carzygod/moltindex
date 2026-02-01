import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { filterTools, getCategoryById } from "@/services/toolService";
import ToolCard from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/Skeletons";
import { useSiteData } from "@/app/SiteDataContext";

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();

  const sortKey = (searchParams.get("sort") as "popularity" | "createdAt" | "rating") ?? "popularity";
  const query = searchParams.get("q") ?? "";

  const { tools: availableTools, loading } = useSiteData();
  const category = useMemo(() => (categoryId ? getCategoryById(categoryId) : undefined), [categoryId]);
  const categoryTools = useMemo(() => {
    if (!categoryId) {
      return [];
    }
    return filterTools(availableTools, { categoryId, query }, sortKey);
  }, [categoryId, sortKey, query, availableTools]);

  if (!category) {
    return (
      <div className="rounded-2xl border border-red-500 p-4 text-red-400">
        Category not found.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} · Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        <p className="text-slate-400">{category.description}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => <ToolCardSkeleton key={`category-${index}`} />)
            : categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} searchTerm={query} />
              ))}
        </div>
      </section>
    </>
  );
};

export default CategoryDetailPage;
