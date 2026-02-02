import fs from "node:fs";
import path from "node:path";
import Category from "../models/categoryModel.js";
import News from "../models/newsModel.js";

const loadJson = (fileName) => {
  const filePath = path.resolve(process.cwd(), "src", "data", fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

const ensureCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) {
    return;
  }
  const categories = loadJson("categories.json");
  await Category.insertMany(categories);
  console.log("Seeded categories collection.");
};

const ensureNews = async () => {
  const count = await News.countDocuments();
  if (count > 0) {
    return;
  }
  const news = loadJson("news.json");
  const normalized = news.map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt),
  }));
  await News.insertMany(normalized);
  console.log("Seeded news collection.");
};

export const seedCollections = async () => {
  await ensureCategories();
  await ensureNews();
};
