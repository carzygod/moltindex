import { Tool, ToolSortKey } from "@/types/models";

export const sortToolsBy = (items: Tool[], key: ToolSortKey): Tool[] => {
  return [...items].sort((a, b) => {
    if (key === "popularity") {
      return b.popularity - a.popularity;
    }
    if (key === "rating") {
      return b.rating - a.rating;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
