import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { timestamps: true },
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
