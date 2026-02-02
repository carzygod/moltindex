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

router.get("/", async (_req, res, next) => {
  try {
    const sites = await Site.find().sort({ popularity: -1 });
    res.json(
      sites.map((site) => ({
        ...site.toObject(),
        rating: normalizeRating(site),
      })),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
