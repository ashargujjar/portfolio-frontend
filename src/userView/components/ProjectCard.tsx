import { ArrowRight, ArrowUpRight, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";

type ProjectCardProps = {
  featured?: boolean;
  project: Project;
};

export const ProjectCard = ({
  featured = false,
  project,
}: ProjectCardProps) => {
  return (
    <article
      className={`group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 ${
        featured ? "lg:col-span-2 lg:grid lg:grid-cols-[1.1fr_0.9fr]" : ""
      }`}
    >
      <div className={`relative ${featured ? "min-h-[320px]" : "h-72"}`}>
        <img
          src={project.topBannerImg}
          alt={project.title}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
            featured ? "lg:min-h-full" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="text-2xl font-black leading-tight">{project.title}</h3>
          {featured && (
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
              {project.shortSummary}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col p-6">
        {!featured && (
          <p className="text-sm leading-7 text-slate-600 line-clamp-3">
            {project.shortSummary}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {item}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
          >
            Open case study
            <ArrowRight size={16} className="text-white" />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-800"
            >
              Live project preview
              <ArrowUpRight size={15} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              View source code
              <GitBranch size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
