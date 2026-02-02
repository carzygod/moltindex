import { Router } from "express";
import Category from "../models/categoryModel.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

export default router;
