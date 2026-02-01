import newsData from "@/data/news.json";
import { NewsItem } from "@/types/models";

export const getNews = (): NewsItem[] => newsData;

export const groupByDate = (items: NewsItem[]) => {
  const groups: Record<string, NewsItem[]> = {};
  items.forEach((entry) => {
    const key = new Date(entry.publishedAt).toISOString().split("T")[0];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
  });
  return groups;
};
