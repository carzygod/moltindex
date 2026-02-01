import { Tool } from "@/types/models";

export const searchTools = (items: Tool[], query: string): Tool[] => {
  const lowered = query.toLowerCase().trim();
  return items
    .map((tool) => {
      const score =
        (tool.name.toLowerCase().includes(lowered) ? 3 : 0) +
        (tool.tagline.toLowerCase().includes(lowered) ? 2 : 0) +
        (tool.description.toLowerCase().includes(lowered) ? 1 : 0) +
        (tool.tags.some((tag) => tag.toLowerCase().includes(lowered)) ? 1 : 0);
      return { tool, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.tool);
};
