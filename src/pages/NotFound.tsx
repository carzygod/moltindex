import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center">
    <h1 className="text-3xl font-semibold text-white">Page not found</h1>
    <p className="text-slate-400">It looks like the route you requested does not exist.</p>
    <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black">
      Return home
    </Link>
  </section>
);

export default NotFoundPage;
