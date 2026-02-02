import { Router } from "express";
import News from "../models/newsModel.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const q =
      typeof req.query.q === "string" && req.query.q.trim()
        ? req.query.q.trim().toLowerCase()
        : "";
    const source = typeof req.query.source === "string" ? req.query.source : "";
    let query = News.find();

    if (source) {
      query = query.where("source").equals(source);
    }

    const items = await query.sort({ publishedAt: -1 }).lean();

    const filtered = items.filter((item) => {
      if (!q) {
        return true;
      }
      const text = `${item.title} ${item.summary} ${item.source} ${item.tags?.join(" ") ?? ""}`.toLowerCase();
      return text.includes(q);
    });

    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

export default router;
