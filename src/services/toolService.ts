import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";
import { Tool, Category, Pricing } from "@/types/models";
import { sortToolsBy } from "@/utils/sort";
import { searchTools } from "@/utils/search";

export const getTools = (): Tool[] => toolsData;

export const getCategories = (): Category[] => categoriesData;

export const getCategoryById = (id: string): Category | undefined =>
  categoriesData.find((category) => category.id === id);

export type ToolFilterOptions = {
  query?: string;
  tags?: string[];
  pricing?: Pricing[];
  openSource?: boolean;
  cnAvailable?: boolean;
  categoryId?: string;
};

export type ToolSortKey = "popularity" | "createdAt" | "rating";

export const filterTools = (
  tools: Tool[],
  options: ToolFilterOptions = {},
  sortKey: ToolSortKey = "popularity",
): Tool[] => {
  let items = [...tools];

  if (options.categoryId) {
    items = items.filter((tool) => tool.categories.includes(options.categoryId!));
  }

  if (options.openSource !== undefined) {
    items = items.filter((tool) => tool.openSource === options.openSource);
  }

  if (options.cnAvailable !== undefined) {
    items = items.filter((tool) => tool.cnAvailable === options.cnAvailable);
  }

  if (options.pricing && options.pricing.length > 0) {
    items = items.filter((tool) => options.pricing!.includes(tool.pricing));
  }

  if (options.query) {
    items = searchTools(items, options.query);
  }

  if (options.tags && options.tags.length > 0) {
    items = items.filter((tool) => options.tags!.every((tag) => tool.tags.includes(tag)));
  }

  return sortToolsBy(items, sortKey);
};

export const getToolById = (tools: Tool[], id: string): Tool | undefined =>
  tools.find((tool) => tool.id === id);

export const getRelatedTools = (tools: Tool[], tool: Tool, limit = 6): Tool[] => {
  const sharedCategory = tool.categories[0];
  const pipelines = tools
    .filter((candidate) => candidate.id !== tool.id)
    .sort((a, b) => {
      const score = (tagTool: Tool) =>
        tagTool.tags.filter((tag) => tool.tags.includes(tag)).length +
        (tagTool.categories.includes(sharedCategory) ? 2 : 0);
      return score(b) - score(a);
    });
  return pipelines.slice(0, limit);
};

export const extractTags = (toolList: Tool[]): string[] =>
  Array.from(new Set(toolList.flatMap((tool) => tool.tags))).sort();
