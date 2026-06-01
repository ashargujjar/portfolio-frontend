import { useState } from "react";
import {
  ArrowLeft,
  Code2,
  FileText,
  FolderKanban,
  Newspaper,
  UserRound,
  Briefcase,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProjectsManager from "./Project";
import SkillsManager from "./Skills";
import ArticlesManager from "./ArticlesManager";
import ExperienceManager from "./ExperienceManager";
import CertificatesManager from "./CertificatesManager";
import ProfileManager from "./ProfileManager";
import KnowledgePdfManager from "./KnowledgePdfManager";

const sectionsData = [
  {
    id: "pdf",
    title: "Knowledge PDF",
    detail: "Upload chatbot source",
    icon: FileText,
    accent: "sky",
    tag: "Section 01",
    badge: "RAG Pipeline Active",
  },
  {
    id: "skills",
    title: "Skills",
    detail: "Technical stack tags",
    icon: Code2,
    accent: "cyan",
    tag: "Section 02",
    badge: "Skills Manager",
  },
  {
    id: "projects",
    title: "Projects",
    detail: "Portfolio case studies",
    icon: FolderKanban,
    accent: "emerald",
    tag: "Section 03",
    badge: "Work Showcase",
  },
  {
    id: "articles",
    title: "Articles",
    detail: "Blog content area",
    icon: Newspaper,
    accent: "violet",
    tag: "Section 04",
    badge: "Writing Hub",
  },
  {
    id: "profile",
    title: "Profile",
    detail: "Personal information",
    icon: UserRound,
    accent: "amber",
    tag: "Section 05",
    badge: "Account Meta",
  },
  {
    id: "experience",
    title: "Experience",
    detail: "Work & Education",
    icon: Briefcase,
    accent: "sky",
    tag: "Section 06",
    badge: "Timeline",
  },
  {
    id: "certificates",
    title: "Certificates",
    detail: "Awards & Certs",
    icon: Award,
    accent: "emerald",
    tag: "Section 07",
    badge: "Achievements",
  },
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("pdf");

  // Dynamic accent style resolver to keep things beautifully color-coordinated
  const getAccentClasses = (accent: string) => {
    const styles = {
      sky: {
        cardActive:
          "border-sky-300 bg-gradient-to-br from-sky-50/70 to-white shadow-xl shadow-sky-100/40 ring-1 ring-sky-400/10",
        iconActive: "bg-sky-600 text-white shadow-lg shadow-sky-600/20",
        tagText: "text-sky-700",
        badge: "bg-sky-50 text-sky-800 border-sky-200/60",
        focusBorder: "focus:border-sky-500 focus:ring-sky-500/20",
        dashedBorder: "border-sky-200 hover:border-sky-300 hover:bg-sky-50/30",
      },
      cyan: {
        cardActive:
          "border-cyan-300 bg-gradient-to-br from-cyan-50/70 to-white shadow-xl shadow-cyan-100/40 ring-1 ring-cyan-400/10",
        iconActive: "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20",
        tagText: "text-cyan-700",
        badge: "bg-cyan-50 text-cyan-800 border-cyan-200/60",
        focusBorder: "focus:border-cyan-500 focus:ring-cyan-500/20",
        dashedBorder:
          "border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50/30",
      },
      emerald: {
        cardActive:
          "border-emerald-300 bg-gradient-to-br from-emerald-50/70 to-white shadow-xl shadow-emerald-100/40 ring-1 ring-emerald-400/10",
        iconActive: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
        tagText: "text-emerald-700",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
        focusBorder: "focus:border-emerald-500 focus:ring-emerald-500/20",
        dashedBorder:
          "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/30",
      },
      violet: {
        cardActive:
          "border-violet-300 bg-gradient-to-br from-violet-50/70 to-white shadow-xl shadow-violet-100/40 ring-1 ring-violet-400/10",
        iconActive: "bg-violet-600 text-white shadow-lg shadow-violet-600/20",
        tagText: "text-violet-700",
        badge: "bg-violet-50 text-violet-800 border-violet-200/60",
        focusBorder: "focus:border-violet-500 focus:ring-violet-500/20",
        dashedBorder:
          "border-violet-200 hover:border-violet-300 hover:bg-violet-50/30",
      },
      amber: {
        cardActive:
          "border-amber-300 bg-gradient-to-br from-amber-50/70 to-white shadow-xl shadow-amber-100/40 ring-1 ring-amber-400/10",
        iconActive: "bg-amber-600 text-white shadow-lg shadow-amber-600/20",
        tagText: "text-amber-700",
        badge: "bg-amber-50 text-amber-800 border-amber-200/60",
        focusBorder: "focus:border-amber-500 focus:ring-amber-500/20",
        dashedBorder:
          "border-amber-200 hover:border-amber-300 hover:bg-amber-50/30",
      },
    };
    return styles[accent as keyof typeof styles] || styles.sky;
  };

  const activeData =
    sectionsData.find((s) => s.id === activeSection) || sectionsData[0];
  const activeStyle = getAccentClasses(activeData.accent);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-zinc-200 text-slate-900 font-sans antialiased">
      {/* Dynamic Background Mesh */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.1),transparent_40%),radial-gradient(circle_at_50%_30%,rgba(249,115,22,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-8">
        {/* Top Header Row */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 bg-slate-200/50 px-3 py-1 rounded-md">
              Control Panel
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              Content Sections
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Select a segment below to manage your live application content.
            </p>
          </div>

          <Link
            to="/admin/login"
            className="group inline-flex items-center gap-2.5 self-start sm:self-center rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-900 hover:bg-slate-950 hover:text-white hover:shadow-md"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to login
          </Link>
        </header>

        {/* Interactive Cards Grid */}
        <nav className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sectionsData.map((section) => {
            const Icon = section.icon;
            const isCurrent = activeSection === section.id;
            const style = getAccentClasses(section.accent);

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative text-left rounded-3xl border p-6 transition-all duration-300 outline-none focus:ring-2 focus:ring-slate-400/20 ${
                  isCurrent
                    ? style.cardActive
                    : "border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`inline-flex rounded-2xl p-3.5 transition-all duration-300 ${
                    isCurrent
                      ? style.iconActive
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/80"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-950 tracking-tight flex items-center justify-between">
                  {section.title}
                </h2>
                <p className="mt-1.5 text-xs font-medium text-slate-500 group-hover:text-slate-600 transition-colors">
                  {section.detail}
                </p>

                {/* Micro active layout line indicator */}
                {isCurrent && (
                  <div className="absolute bottom-3 right-4 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Section Viewer Section */}
        <main className="mt-10 rounded-[2.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_32px_96px_-32px_rgba(15,23,42,0.12)] md:p-12 transition-all duration-300">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.3em] ${activeStyle.tagText}`}
              >
                {activeData.tag}
              </p>
              <h2 className="mt-2.5 text-2xl font-black text-slate-950 md:text-3xl tracking-tight">
                Manage {activeData.title}
              </h2>
            </div>

            <div
              className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${activeStyle.badge}`}
            >
              {activeData.badge}
            </div>
          </div>

          {/* Conditional Rendering Block based on Selected Submenu */}
          <div className="mt-8">
            {activeSection === "pdf" && (
              <KnowledgePdfManager dashedBorder={activeStyle.dashedBorder} />
            )}
            {activeSection === "skills" && <SkillsManager />}
            {activeSection === "projects" && <ProjectsManager />}
            {activeSection === "articles" && <ArticlesManager />}
            {activeSection === "profile" && (
              <ProfileManager focusBorder={activeStyle.focusBorder} />
            )}
            {activeSection === "experience" && <ExperienceManager />}
            {activeSection === "certificates" && <CertificatesManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
