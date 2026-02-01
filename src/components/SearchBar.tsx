import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routeMap = ["/", "/categories", "/news"];

const buildSearchPath = (pathname: string, query: string) => {
  const base = routeMap.includes(pathname) ? pathname : "/";
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.set("q", query.trim());
  }
  return `${base}?${searchParams.toString()}`;
};

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(() => new URLSearchParams(location.search).get("q") ?? "");

  useEffect(() => {
    const current = new URLSearchParams(location.search).get("q") ?? "";
    setValue(current);
  }, [location.search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    const path = buildSearchPath(location.pathname, next);
    navigate(path, { replace: true });
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-800 bg-[#0d1117]/80 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Search tools
      </label>
      <input
        id="global-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search tools, tags, categories..."
        className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
