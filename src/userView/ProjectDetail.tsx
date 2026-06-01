import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./components/Nav";
import type { Project } from "../data/projects";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  type Image = {
    secure_url: string;
  };

  type FetchProjects = {
    _id: string;
    slug: string;
    title: string;
    shortSummary: string;
    topBannerImg: {
      secure_url: string;
    };
    description: string;
    techStack: string;
    secure_url: string;
    live: string;
    github: string;
    image: Image[];
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/project`);
        const data = await response.json();
        if (data.success) {
          const fetchedProjects = data.data.map((p: FetchProjects) => ({
            id: p._id,
            slug: p._id,
            title: p.title,
            shortSummary: p.shortSummary,
            description: p.description,
            techStack: p.techStack,
            topBannerImg: p.topBannerImg?.secure_url || "",
            live: p.live || "",
            github: p.github || "",
            image:
              p.image?.map((img: { secure_url: string }) => ({
                url: img.secure_url,
              })) || [],
          }));
          setProjects(fetchedProjects);
          const found = fetchedProjects.find(
            (p: { slug: string }) => p.slug === slug,
          );
          setProject(found || null);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-sky-600"></span>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <main className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              Project Not Found
            </p>
            <h1 className="mt-4 text-4xl font-black text-slate-950">
              The requested case study does not exist.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              The slug does not match the current project dataset. Use the
              projects section on the homepage to open a valid case study.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Return Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const relatedProjects = projects
    .filter((entry) => entry.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="relative overflow-hidden px-6 pb-24 pt-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.20),transparent_52%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl">
          <a
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-sky-700"
          >
            <ArrowLeft size={16} />
            Back to all projects
          </a>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
                  Case Study
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {project.shortSummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open live preview
                    <ArrowUpRight size={16} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    View source code
                    <GitBranch size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)]">
              <img
                src={project.topBannerImg}
                alt={project.title}
                className="h-full min-h-[320px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Project Description
                </p>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="mt-8 space-y-5">
                <p className="text-base leading-8 text-slate-600 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] flex flex-col justify-center">
              <h2 className="text-2xl font-black text-slate-950">Tech Stack</h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.techStack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {project.image && project.image.length > 0 && (
            <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                    Image Gallery
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    Visual detail for the project story
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {project.image.map((img) => (
                  <figure
                    key={img.url}
                    className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 flex flex-col justify-between"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={img.url}
                        alt="Gallery Image"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  More Work
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Related projects
                </h2>
              </div>
              <a
                href="/#projects"
                className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
              >
                Return to project grid
              </a>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {relatedProjects.map((entry) => (
                <Link
                  key={entry.slug}
                  to={`/projects/${entry.slug}`}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-slate-300"
                >
                  <h3 className="mt-3 text-2xl font-black text-slate-950">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-2">
                    {entry.shortSummary}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-sky-700">
                    Open case study
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
