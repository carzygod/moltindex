import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Daily News", to: "/news" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#020617]/95 px-4 py-4 backdrop-blur-lg shadow-[0_10px_30px_rgba(2,6,23,0.6)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/" className="text-lg font-semibold tracking-[0.3em] text-white">
          <span className="text-primary">MOLT</span>
          <span className="text-slate-400 ml-1">INDEX</span>
        </Link>
        <div className="hidden flex-1 items-center justify-center md:flex">
          <SearchBar />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex gap-3 text-xs font-semibold tracking-[0.3em] text-slate-400">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive
                    ? "bg-white/10 text-slate-100 shadow-[0_0_15px_rgba(88,166,255,0.25)]"
                    : "hover:bg-white/5 hover:text-white/80"
                }`
              }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <a
            href="/skill.md"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/20"
          >
            Agent Skill
          </a>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          className="text-white md:hidden"
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
                    isActive ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-2">
            <a
              href="/skill.md"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/20"
            >
              Agent Skill
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
