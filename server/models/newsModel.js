import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    source: { type: String, required: true },
    url: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;
