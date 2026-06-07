import { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const Blogs = ({ onLoadComplete }: { onLoadComplete?: () => void }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs`);
        const data = await res.json();
        if (data.success || data.data) {
          setArticles(data.data || data.blog || []);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        onLoadComplete?.();
      }
    };
    fetchBlogs();
  }, [onLoadComplete]);

  return (
    <section id="articles" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
              Writing
            </p>
            <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
              Articles that unpack the thinking behind the build.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Each article now opens on its own page with richer reading layout
              and clearer insights.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Reading Format
            </p>
            <p className="mt-3 text-lg font-black text-slate-950">
              Dedicated article pages with focused topics
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, visibleCount).map((article) => {

            return (
              <article
                key={article._id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-slate-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.imgUrl?.url || ""}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    alt={article.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className="inline-flex rounded-full bg-white/92 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={14} />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                    {article.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/articles/${article._id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100"
                    >
                      Read the full article
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visibleCount < articles.length && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="group mx-auto flex flex-col items-center text-slate-500 transition hover:text-blue-600"
            >
              <span className="mb-2 font-bold">Show more articles</span>
              <div className="rounded-full border border-slate-200 bg-white p-3 shadow-sm transition-all group-hover:border-blue-200">
                <ChevronDown
                  size={24}
                  className="transition-transform group-hover:translate-y-1"
                />
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
