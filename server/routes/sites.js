import { Router } from "express";
import Site from "../models/siteModel.js";

const router = Router();

const normalizeRating = (site) => {
  if (site.ratingCount > 0) {
    return Number((site.ratingSum / site.ratingCount).toFixed(2));
  }
  return site.rating ?? 0;
};

const transformSite = (site) => ({
  id: site._id,
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  url: site.url,
  categories: site.categories ?? [],
  tags: site.tags ?? [],
  pricing: site.pricing,
  openSource: site.openSource,
  cnAvailable: site.cnAvailable,
  popularity: site.popularity,
  rating: normalizeRating(site),
  createdAt: site.createdAt,
  updatedAt: site.updatedAt,
  coverImage: site.coverImage,
});

const buildFilter = (q?: string, category?: string, tags?: string[]) => {
  const filter: Record<string, unknown> = {};
  if (category) {
    filter.categories = category;
  }
  if (tags && tags.length > 0) {
    filter.tags = { $all: tags };
  }
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { name: regex },
      { description: regex },
      { tagline: regex },
      { tags: regex },
      { notes: regex },
    ];
  }
  return filter;
};

router.get("/", async (req, res, next) => {
  try {
    const { q, category, tags, random = "0" } = req.query;
    const tagList =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];
    const filter = buildFilter(typeof q === "string" ? q : undefined, typeof category === "string" ? category : undefined, tagList);

    const randomCount = Number(random);
    if (randomCount > 0) {
      const pipeline = [];
      if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
      }
      pipeline.push({ $sample: { size: Math.min(Math.max(randomCount, 1), 50) } });
      const samples = await Site.aggregate(pipeline);
      res.json(samples.map(transformSite));
      return;
    }

    const query = Object.keys(filter).length > 0 ? Site.find(filter) : Site.find();
    const sites = await query.sort({ popularity: -1 }).lean();

    res.json(sites.map(transformSite));
  } catch (error) {
    next(error);
  }
});

export default router;
