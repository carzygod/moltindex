import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeToggleProps {
  mode: "light" | "dark" | "system";
  setMode: (value: "light" | "dark" | "system") => void;
}

const ThemeToggle = ({ mode, setMode }: ThemeToggleProps) => {
  const nextMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";

  const icon = mode === "light" ? <Sun size={16} /> : mode === "dark" ? <Moon size={16} /> : <Laptop size={16} />;

  return (
    <button
      type="button"
      onClick={() => setMode(nextMode)}
      className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-1 text-xs uppercase tracking-[0.2em]"
      aria-label="Toggle theme"
    >
      {icon}
      {mode}
    </button>
  );
};

export default ThemeToggle;
