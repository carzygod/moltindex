import { FormEvent, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getCategories } from "@/services/toolService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { submitSite, SubmitSitePayload } from "@/services/api";
import { useSiteData } from "@/app/SiteDataContext";
import { Pricing } from "@/types/models";

const SubmitPage = () => {
  const categories = useMemo(() => getCategories(), []);
  const [formState, setFormState] = useState({
    name: "",
    url: "",
    category: categories[0]?.id ?? "",
    tags: "",
    description: "",
    pricing: "free" as Pricing,
    openSource: false,
    cnAvailable: false,
  });
  const [pendingSubmissions, setPendingSubmissions] = useLocalStorage<
    { name: string; timestamp: string; status: "synced" | "offline"; message?: string }[]
  >("pendingSubmissions", []);
  const [status, setStatus] = useState<string>("");
  const { refresh } = useSiteData();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, url, description } = formState;
    if (!name || !url || !description) {
      setStatus("Name, URL, and description are required.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setStatus("Please enter a valid URL.");
      return;
    }
    const tags = formState.tags
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 6);

    const payload: SubmitSitePayload = {
      name,
      url,
      description,
      tags,
      categories: [formState.category],
      pricing: formState.pricing,
      openSource: formState.openSource,
      cnAvailable: formState.cnAvailable,
    };
    try {
      await submitSite(payload);
      setStatus("Tool submitted to Moltindex API. Awaiting review.");
      setPendingSubmissions((prev) =>
        [{ name, timestamp: new Date().toISOString(), status: "synced" }, ...prev].slice(0, 5),
      );
      void refresh();
    } catch (error) {
      const message = (error as Error).message ?? "Network error";
      setStatus(`Submission saved locally (API unreachable). ${message}`);
      setPendingSubmissions((prev) =>
        [{ name, timestamp: new Date().toISOString(), status: "offline", message }, ...prev].slice(0, 5),
      );
    }
    setFormState({
      name: "",
      url: "",
      category: categories[0]?.id ?? "",
      tags: "",
      description: "",
      pricing: "free" as Pricing,
      openSource: false,
      cnAvailable: false,
    });
  };

  return (
    <>
      <Helmet>
        <title>Submit Tool · Moltindex</title>
      </Helmet>
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h1 className="text-2xl font-semibold">Submit a tool</h1>
        <p className="text-sm text-slate-400">Your submission is saved locally for demo review.</p>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400">
            Tool name
            <input
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
              required
            />
          </label>
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400">
            Tool URL
            <input
              type="url"
              value={formState.url}
              onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
              required
            />
          </label>
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400">
            Category
            <select
              value={formState.category}
              onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400">
            Pricing
            <select
              value={formState.pricing}
              onChange={(event) => setFormState((prev) => ({ ...prev, pricing: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
            >
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400 md:col-span-2">
            Description
            <textarea
              rows={4}
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
              required
            />
          </label>
          <label className="flex flex-col text-xs uppercase tracking-[0.3em] text-slate-400 md:col-span-2">
            Tags (comma separated, limit 6)
            <input
              value={formState.tags}
              onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
              className="mt-2 rounded bg-slate-900/60 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <input
              type="checkbox"
              checked={formState.openSource}
              onChange={(event) => setFormState((prev) => ({ ...prev, openSource: event.target.checked }))}
            />
            Open source
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <input
              type="checkbox"
              checked={formState.cnAvailable}
              onChange={(event) => setFormState((prev) => ({ ...prev, cnAvailable: event.target.checked }))}
            />
            CN available
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black"
            >
              Submit (demo)
            </button>
          </div>
        </form>
        {status && <p className="text-sm text-slate-300">{status}</p>}
        {pendingSubmissions.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recent submissions</p>
            <ul className="mt-2 space-y-1">
              {pendingSubmissions.map((entry, index) => (
                <li key={`${entry.name}-${index}`} className="flex items-center justify-between text-sm">
                  <span>{entry.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] ${
                      entry.status === "synced" ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {entry.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
};

export default SubmitPage;
