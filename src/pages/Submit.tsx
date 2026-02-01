import { FormEvent, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getCategories } from "@/services/toolService";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const SubmitPage = () => {
  const categories = useMemo(() => getCategories(), []);
  const [formState, setFormState] = useState({
    name: "",
    url: "",
    category: categories[0]?.id ?? "",
    tags: "",
    description: "",
    pricing: "free",
    openSource: false,
    cnAvailable: false,
  });
  const [pendingSubmissions, setPendingSubmissions] = useLocalStorage("pendingSubmissions", []);
  const [status, setStatus] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    const payload = { ...formState, tags };
    setPendingSubmissions((prev) => [...prev, payload]);
    setStatus("Tool queued for review (demo mode).");
    setFormState({
      name: "",
      url: "",
      category: categories[0]?.id ?? "",
      tags: "",
      description: "",
      pricing: "free",
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
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending submissions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {pendingSubmissions.map((entry: any, index: number) => (
                <li key={index}>{entry.name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
};

export default SubmitPage;
