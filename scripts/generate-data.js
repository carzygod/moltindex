import fs from "node:fs";
import path from "node:path";

const categories = [
  { id: "comms", name: "Comms", description: "Tools powering agent communication", icon: "📡" },
  { id: "governance", name: "Governance", description: "Consent & rules for agents", icon: "⚖️" },
  { id: "monitoring", name: "Monitoring", description: "Persistent observability dashboards", icon: "👁️" },
  { id: "research", name: "Research", description: "Knowledge blasts for agents", icon: "🔬" },
  { id: "scripting", name: "Scripting", description: "Automation & sequencing shells", icon: "💻" },
  { id: "ethics", name: "Ethics", description: "Govern agent morals", icon: "🧭" },
  { id: "memes", name: "Memes", description: "Playful rituals & signal memetics", icon: "🧠" },
  { id: "art", name: "Art", description: "Creative studios for generative art", icon: "🖼️" },
  { id: "education", name: "Education", description: "Teach new agents and humans", icon: "🎓" },
  { id: "security", name: "Security", description: "Defend against misaligned inputs", icon: "🛡️" },
  { id: "finance", name: "Finance", description: "Manage agent budgets", icon: "💰" },
  { id: "infra", name: "Infrastructure", description: "Agent deployment layers", icon: "🧱" },
];

const tagPool = [
  "signal",
  "bot",
  "portal",
  "routines",
  "ops",
  "autonomy",
  "analytics",
  "payload",
  "sync",
  "ethos",
  "infra",
  "persona",
];

const pricingOptions = ["free", "freemium", "paid"];

const tools = Array.from({ length: 80 }, (_, index) => {
  const category = categories[index % categories.length];
  const tags = Array.from(
    new Set([
      tagPool[index % tagPool.length],
      tagPool[(index + 3) % tagPool.length],
      tagPool[(index + 7) % tagPool.length],
    ]),
  );
  const createdAt = new Date(Date.now() - index * 86400000).toISOString();
  return {
    id: `${category.id}-${index + 1}`,
    name: `${category.name} Flow ${index + 1}`,
    tagline: `Agent-driven ${category.name.toLowerCase()} toolkit`,
    description: `A multi-agent orchestration tool for ${category.name.toLowerCase()} scenarios.`,
    url: `https://tool.${category.id}.agent/${index + 1}`,
    categories: [category.id],
    tags,
    pricing: pricingOptions[index % pricingOptions.length],
    openSource: index % 3 === 0,
    cnAvailable: index % 4 !== 0,
    popularity: 1000 - index * 3,
    rating: Math.round((4 + (index % 6) * 0.15) * 10) / 10,
    createdAt,
    updatedAt: new Date(Date.parse(createdAt) + 3600000).toISOString(),
    coverImage: "",
  };
});

const newsPool = [
  "Agent Consensus",
  "Signal Drift Observed",
  "Governance Opera Live",
  "Meme Sapience Report",
  "Research Pulse",
];

const news = Array.from({ length: 40 }, (_, index) => {
  const publishedAt = new Date(Date.now() - index * 3600000 * 3).toISOString();
  return {
    id: `news-${index + 1}`,
    title: `${newsPool[index % newsPool.length]} #${index + 1}`,
    summary: `Summary for ${newsPool[index % newsPool.length]} covering latest agent signals.`,
    source: `Portal ${((index % 5) + 1)}`,
    url: `https://news.agent/${index + 1}`,
    publishedAt,
    tags: ["daily", "signal"],
  };
});

const dataDir = path.resolve(process.cwd(), "src", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "categories.json"), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(dataDir, "tools.json"), JSON.stringify(tools, null, 2));
fs.writeFileSync(path.join(dataDir, "news.json"), JSON.stringify(news, null, 2));
console.log("generated data");
