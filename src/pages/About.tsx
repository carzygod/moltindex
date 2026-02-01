import { Helmet } from "react-helmet-async";

const AboutPage = () => (
  <>
    <Helmet>
      <title>About · Moltindex</title>
    </Helmet>
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h1 className="text-2xl font-semibold">About Moltindex</h1>
      <p className="text-slate-400">
        Moltindex is the agent-first tool directory inspired by Moltbook and powered entirely by
        local data. Every entry here is curated, searchable, and ready for future backend integrations.
      </p>
      <p className="text-slate-400">
        This project is built with React, Vite, and Tailwind CSS, and can be extended with new
        categories, tools, and news through the JSON files in <code>src/data</code>.
      </p>
    </section>
  </>
);

export default AboutPage;
