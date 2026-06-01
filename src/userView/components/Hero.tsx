import { ArrowDownRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export const Hero = () => {
  const { profile } = usePortfolio();

  return (
    <section className="px-6 pb-24 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-sky-700">
            Full Stack Developer + Cloud Developer
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-slate-950 md:text-7xl">
            Building sharp digital products for connected systems.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100"
            >
              Browse case studies
              <ArrowDownRight size={16} />
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
          <div>
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                Core focus
              </p>
              <p className="mt-3 text-2xl font-black">
                Backend systems with scalable APIs
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Current strengths
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "React interfaces",
                "Node APIs",
                "MongoDB data models",
                "MySQL",
                "AWS",
                "Docker",
                "LangChain",
                "OpenAI",
                "DeepSeek",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Projects", value: "03" },
              { label: "Direction", value: "AI + product clarity" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
