import { Link } from "react-router-dom";
import { Category } from "@/types/models";

interface CategoryCardProps {
  category: Category;
  toolCount: number;
}

const CategoryCard = ({ category, toolCount }: CategoryCardProps) => (
  <Link
    to={`/categories/${category.id}`}
    className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1117]/70 p-5 transition hover:border-primary hover:shadow-[0_15px_35px_rgba(2,6,23,0.8)]"
  >
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] uppercase tracking-[0.4em] text-slate-400">{category.id}</span>
      <span className="text-xs uppercase tracking-[0.3em] text-primary">{category.icon}</span>
    </div>
    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
    <p className="text-sm text-slate-400">{category.description}</p>
    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
      <span>{toolCount} tools</span>
      <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-slate-300">
        Browse
      </span>
    </div>
  </Link>
);

export default CategoryCard;
