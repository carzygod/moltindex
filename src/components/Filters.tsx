import { ChangeEvent } from "react";

interface FiltersProps {
  tags: string[];
  selectedTags: string[];
  pricing: string[];
  openSource?: boolean;
  cnAvailable?: boolean;
  onTagToggle: (tag: string) => void;
  onPricingChange: (value: string[]) => void;
  onToggleOption: (field: "openSource" | "cnAvailable", value: boolean) => void;
}

const pricingOptions = ["free", "freemium", "paid"];

const Filters = ({
  tags,
  selectedTags,
  pricing,
  openSource,
  cnAvailable,
  onTagToggle,
  onPricingChange,
  onToggleOption,
}: FiltersProps) => {
  const handlePricing = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (event.target.checked) {
      onPricingChange([...pricing, value]);
    } else {
      onPricingChange(pricing.filter((entry) => entry !== value));
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 shadow-lg shadow-black/40 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Tags</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                selectedTags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Pricing</p>
        <div className="mt-2 flex gap-3">
          {pricingOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
              <input
                type="checkbox"
                value={option}
                checked={pricing.includes(option)}
                onChange={handlePricing}
                className="accent-primary"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-slate-500">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={openSource ?? false}
            onChange={(event) => onToggleOption("openSource", event.target.checked)}
          />
          Open source
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={cnAvailable ?? false}
            onChange={(event) => onToggleOption("cnAvailable", event.target.checked)}
          />
          CN available
        </label>
      </div>
    </div>
  );
};

export default Filters;
