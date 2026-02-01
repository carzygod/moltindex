import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Daily News", to: "/news" },
  { label: "Submit Tool", to: "/submit" },
  { label: "About", to: "/about" },
];

interface NavbarProps {
  themeMode: "light" | "dark" | "system";
  setThemeMode: (value: "light" | "dark" | "system") => void;
}

const Navbar = ({ themeMode, setThemeMode }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900 bg-slate-950/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-semibold tracking-[0.3em] text-slate-50">
            MOLTINDEX
          </Link>
          <span className="text-xs uppercase tracking-[0.5em] text-slate-500">Toolnav</span>
        </div>
        <div className="hidden flex-1 items-center justify-center md:flex">
          <SearchBar />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex gap-3 text-xs uppercase text-slate-400">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? "text-white" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle mode={themeMode} setMode={setThemeMode} />
          <a
            href="/skill.md"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.3em]"
          >
            Skill
          </a>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="mt-4 flex flex-col gap-4 px-2 md:hidden">
          <SearchBar />
          <nav className="flex flex-col gap-2 text-sm uppercase text-slate-400">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive ? "bg-slate-800 text-white" : "hover:bg-slate-900"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle mode={themeMode} setMode={setThemeMode} />
            <a
              href="/skill.md"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.3em]"
            >
              Skill
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
