import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Clock3, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./components/Nav";
import Footer from "./Footer";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const ArticleDetail = () => {
  const { slug } = useParams(); // slug is now actually the _id
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/blogs`);
        const data = await res.json();
        if (data.success || data.data) {
          const allArticles = data.data || data.blog || [];
          const currentArticle = allArticles.find((a: any) => a._id === slug);
          setArticle(currentArticle);
          setRelatedArticles(allArticles.filter((a: any) => a._id !== slug).slice(0, 2));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="px-6 py-32 flex justify-center">
          <p className="text-lg font-bold animate-pulse text-slate-400">Loading Article...</p>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="px-6 py-32 flex justify-center">
          <div className="w-full max-w-xl text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Article not found
            </h1>
            <p className="mt-4 text-slate-500 text-lg">
              We couldn't find the article you're looking for.
            </p>
            <Link
              to="/#articles"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Return to articles
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <Navbar />

      <main className="pb-24 pt-12 md:pt-20 px-6">
        <article className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-[250px_1fr] items-start">
            
            {/* Sticky Sidebar (Desktop) / Header Info (Mobile) */}
            <aside className="lg:sticky lg:top-32 space-y-8 pb-8 border-b border-slate-100 lg:border-none lg:pb-0">
              <Link
                to="/#articles"
                className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 transition group-hover:bg-indigo-50">
                  <ArrowLeft size={16} />
                </span>
                Back to all
              </Link>

              <div className="hidden lg:block space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Published</p>
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar size={15} className="text-slate-400" />
                    {new Date(article.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Reading Time</p>
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock3 size={15} className="text-slate-400" />
                    {article.readTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {(article.topics || []).map((topic: string) => (
                      <span
                        key={topic}
                        className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Column */}
            <div className="max-w-3xl">
              {/* Mobile Meta Data */}
              <div className="flex flex-wrap items-center gap-4 lg:hidden mb-8 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(article.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock3 size={14} />{article.readTime}</span>
              </div>

              {/* Title Area */}
              <header className="mb-12">
                <span className="inline-block mb-4 text-[13px] font-black uppercase tracking-[0.25em] text-indigo-600">
                  {article.category}
                </span>
                <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 tracking-tight">
                  {article.title}
                </h1>
                <p className="mt-6 text-xl md:text-2xl leading-relaxed text-slate-600 font-medium max-w-2xl">
                  {article.excerpt}
                </p>
              </header>

              {/* Cover Image */}
              <figure className="mb-16">
                <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
                  <img
                    src={article.imgUrl?.url || ""}
                    alt={article.title}
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                </div>
              </figure>


              {/* Reading Content */}
              <div className="prose prose-lg prose-slate max-w-none prose-p:leading-[1.9] prose-p:text-slate-700 prose-p:text-[1.15rem]">
                {(article.content || "").split("\n").map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Related Articles Footer */}
      {relatedArticles.length > 0 && (
        <section className="bg-slate-50 py-24 px-6 border-t border-slate-100">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Keep Reading</h2>
                <p className="mt-3 text-slate-500 font-medium">Explore more articles</p>
              </div>
              <Link to="/#articles" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {relatedArticles.map((entry) => (
                <Link
                  key={entry._id}
                  to={`/articles/${entry._id}`}
                  className="group flex flex-col justify-between rounded-3xl bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 border border-slate-100 hover:border-indigo-100"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                      {entry.category}
                    </span>
                    <h3 className="mt-4 text-2xl font-black text-slate-900 leading-tight">
                      {entry.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-2">
                      {entry.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Link to="/#articles" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
