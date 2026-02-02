import { Router } from "express";
import Site from "../models/siteModel.js";

const router = Router();

const normalizeRating = (site) => {
  if (site.ratingCount > 0) {
    return Number((site.ratingSum / site.ratingCount).toFixed(2));
  }
  return 0;
};

const attachRating = (site) => ({
  ...site.toObject(),
  rating: normalizeRating(site),
});

router.get("/", async (req, res, next) => {
  try {
    const sites = await Site.find();
    sites.sort((a, b) => {
      const aRating = a.ratingCount ? a.ratingSum / a.ratingCount : 0;
      const bRating = b.ratingCount ? b.ratingSum / b.ratingCount : 0;
      return bRating - aRating;
    });
    res.json(sites.map((site) => attachRating(site)));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, url, description, tags = [], categories = [], pricing = "free", openSource = false, cnAvailable = false, tagline = "" } =
      req.body ?? {};

    if (!name || !url || !description) {
      return res.status(400).json({ error: "name, url, and description are required" });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Please provide a valid URL" });
    }

    const site = await Site.create({
      name,
      tagline,
      description,
      url,
      tags: Array.isArray(tags) ? tags : [],
      categories: Array.isArray(categories) ? categories : [],
      pricing,
      openSource,
      cnAvailable,
    });

    res.status(201).json(attachRating(site));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/vote", async (req, res, next) => {
  try {
    const { id } = req.params;
    const rating = Number(req.body?.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
    }

    const site = await Site.findByIdAndUpdate(
      id,
      { $inc: { ratingSum: rating, ratingCount: 1 }, updatedAt: new Date() },
      { new: true },
    );

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    res.json(attachRating(site));
  } catch (error) {
    next(error);
  }
});

export default router;
