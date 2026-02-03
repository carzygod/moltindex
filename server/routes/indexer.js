import { Router } from "express";
import Site from "../models/siteModel.js";

const router = Router();

const parseBlock = (content) => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length || !lines[0].toLowerCase().startsWith("!moltindex")) {
    throw new Error("Content must begin with !moltindex");
  }

  const payload = {};
  for (const line of lines.slice(1)) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    payload[key.trim().toLowerCase()] = rest.join(":").trim();
  }

  if (!payload.name || !payload.url || !payload.description || !payload.tags || !payload.score) {
    throw new Error("Missing required fields (name, url, description, tags, score)");
  }

  return {
    name: payload.name,
    url: payload.url,
    description: payload.description,
    tags: payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    rating: Math.max(0, Math.min(5, Number.parseFloat(payload.score) || 0)),
    notes: payload.notes,
    pricing: payload.pricing,
    category: payload.category,
  };
};

const normalizeSite = (site) => ({
  ...site.toObject(),
  rating: site.ratingCount
    ? Number((site.ratingSum / site.ratingCount).toFixed(2))
    : site.rating ?? 0,
});

router.post("/", async (req, res, next) => {
  try {
    const { post_url, content, source } = req.body ?? {};
    if (!post_url || !content) {
      return res.status(400).json({ error: "post_url and content are required" });
    }

    const parsed = parseBlock(content);

    const existing = await Site.findOne({
      $or: [{ sourceUrl: post_url }, { url: parsed.url }],
    });

    const payload = {
      name: parsed.name,
      tagline: parsed.notes ?? "",
      description: parsed.description,
      url: parsed.url,
      tags: parsed.tags,
      categories: parsed.category ? [parsed.category] : [],
      pricing: parsed.pricing ?? "free",
      openSource: false,
      cnAvailable: true,
      popularity: existing ? existing.popularity : 100,
      ratingSum: parsed.rating,
      ratingCount: 1,
      sourceUrl: post_url,
      sourcePlatform: source ?? "unknown",
      sourcePostId: post_url.split("/").pop() ?? "",
    };

    const site = existing
      ? await Site.findByIdAndUpdate(existing.id, payload, { new: true })
      : await Site.create(payload);

    res.status(existing ? 200 : 201).json(normalizeSite(site));
  } catch (error) {
    next(error);
  }
});

export default router;
