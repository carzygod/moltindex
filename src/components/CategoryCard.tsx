import { Link } from "react-router-dom";
import { Category } from "@/types/models";

interface CategoryCardProps {
  category: Category;
  toolCount: number;
}

const CategoryCard = ({ category, toolCount }: CategoryCardProps) => (
  <Link
    to={`/categories/${category.id}`}
    className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 p-5 transition hover:border-primary"
  >
    <span className="text-xs uppercase tracking-[0.4em] text-slate-500">{category.id}</span>
    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
    <p className="text-sm text-slate-400">{category.description}</p>
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
      <span>{toolCount} tools</span>
      <span>{category.icon}</span>
    </div>
  </Link>
);

export default CategoryCard;
