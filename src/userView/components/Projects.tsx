import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "../../data/projects";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/project`);
        const data = await response.json();
        if (data.success) {
          const fetchedProjects = data.data.map((p: any) => ({
            id: p._id,
            slug: p._id, // use _id as slug for routing
            title: p.title,
            shortSummary: p.shortSummary,
            description: p.description,
            techStack: p.techStack,
            topBannerImg: p.topBannerImg?.secure_url || "",
            live: p.live || "",
            github: p.github || "",
            image: p.image?.map((img: any) => ({ url: img.secure_url })) || []
          }));
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const uniqueStackCount = new Set(
    projects.flatMap((project) => project.techStack),
  ).size;

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_52%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
              Selected Work
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Projects that deserve more than a single card preview.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              The projects section now opens full case-study pages with
              detailed descriptions, image galleries, live links, and GitHub links.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Projects
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {projects.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Stack Tags
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {uniqueStackCount}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Detail View
              </p>
              <p className="mt-2 text-lg font-black text-slate-950">
                Gallery showcase
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 min-h-[300px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-sky-600"></span>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex h-full items-center justify-center py-20 text-slate-500">
              No projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
