import { Router } from "express";
import Site from "../models/siteModel.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const q =
      typeof req.query.q === "string" && req.query.q.trim()
        ? req.query.q.trim().toLowerCase()
        : "";

    const items = await Site.find().sort({ updatedAt: -1 }).lean();
    const filtered = items.filter((item) => {
      if (!q) {
        return true;
      }
      const text = `${item.name} ${item.description} ${item.tags?.join(" ") ?? ""}`.toLowerCase();
      return text.includes(q);
    });

    res.json(
      filtered.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        url: item.url,
        tags: item.tags || [],
        rating: item.ratingCount ? Number((item.ratingSum / item.ratingCount).toFixed(2)) : item.rating ?? 0,
        updatedAt: item.updatedAt,
        sourceUrl: item.sourceUrl,
        category: item.categories?.[0] ?? null,
      })),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
