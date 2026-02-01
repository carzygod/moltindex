import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { extractTags, filterTools, getTools } from "@/services/toolService";
import Filters from "@/components/Filters";
import ToolCard from "@/components/ToolCard";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const createParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    return params;
  };

  const query = searchParams.get("q") ?? "";
  const tagParams = searchParams.getAll("tag");
  const pricingParams = searchParams.getAll("pricing");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const sortKey = (searchParams.get("sort") as "popularity" | "createdAt" | "rating") ?? "popularity";
  const openSourceParam = searchParams.get("openSource");
  const cnAvailableParam = searchParams.get("cnAvailable");

  const tagPool = useMemo(() => extractTags(getTools()), []);

  const filteredTools = useMemo(
    () =>
      filterTools(
        {
          query,
          tags: tagParams,
          pricing: pricingParams as any,
          openSource: openSourceParam ? openSourceParam === "true" : undefined,
          cnAvailable: cnAvailableParam ? cnAvailableParam === "true" : undefined,
        },
        sortKey,
      ),
    [query, tagParams.join(","), pricingParams.join(","), openSourceParam, cnAvailableParam, sortKey],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, pageParam));
  const slice = filteredTools.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateParam = (key: string, value?: string) => {
    const params = createParam(key, value ?? "");
    if (!value) {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>Categories · Moltindex</title>
      </Helmet>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Explore Categories</h1>
          <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
                navigate("/categories");
              }}
              className="rounded-full border border-slate-700 px-3 py-1"
            >
              Reset
            </button>
            <span>Sort</span>
          </div>
        </div>
        <Filters
          tags={tagPool}
          selectedTags={tagParams}
          pricing={pricingParams}
          openSource={openSourceParam === "true"}
          cnAvailable={cnAvailableParam === "true"}
          onTagToggle={(tag) => {
            const params = new URLSearchParams(searchParams);
            const existing = params.getAll("tag").filter((entry) => entry !== tag);
            if (!tagParams.includes(tag)) {
              existing.push(tag);
            }
            params.delete("tag");
            existing.forEach((entry) => params.append("tag", entry));
            setSearchParams(params);
          }}
          onPricingChange={(values) => {
            const params = new URLSearchParams(searchParams);
            params.delete("pricing");
            values.forEach((value) => params.append("pricing", value));
            setSearchParams(params);
          }}
          onToggleOption={(field, value) => {
            const params = new URLSearchParams(searchParams);
            params.set(field, value.toString());
            setSearchParams(params);
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {slice.map((tool) => (
            <ToolCard key={tool.id} tool={tool} searchTerm={query} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={(page) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", page.toString());
            setSearchParams(params);
          }}
        />
      </div>
    </>
  );
};

export default CategoriesPage;
