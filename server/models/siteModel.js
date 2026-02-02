import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    pricing: { type: String, enum: ["free", "freemium", "paid"], default: "free" },
    openSource: { type: Boolean, default: false },
    cnAvailable: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    coverImage: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

siteSchema.virtual("rating").get(function () {
  if (!this.ratingCount) {
    return 0;
  }
  const avg = this.ratingSum / this.ratingCount;
  return Number(avg.toFixed(2));
});

const Site = mongoose.models.Site || mongoose.model("Site", siteSchema);

export default Site;
