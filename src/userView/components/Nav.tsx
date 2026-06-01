import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects/");
  const sectionHref = isProjectPage ? "/#projects" : "/#articles";
  const sectionLabel = isProjectPage ? "Project archive" : "Article archive";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-slate-950 transition hover:text-sky-700"
        >
          Ashar Ashraf.
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {isHomePage ? (
            <>
              <a href="#projects" className="transition hover:text-sky-700">
                Projects
              </a>
              <a href="#skills" className="transition hover:text-sky-700">
                Skills
              </a>
              <a href="#articles" className="transition hover:text-sky-700">
                Articles
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100"
              >
                Browse Projects
                <ArrowUpRight size={16} />
              </a>
            </>
          ) : (
            <>
              <Link to="/" className="transition hover:text-sky-700">
                Home
              </Link>
              <a href="/#projects" className="transition hover:text-sky-700">
                Projects
              </a>
              <a href="/#articles" className="transition hover:text-sky-700">
                Articles
              </a>
              <a
                href={sectionHref}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-white transition hover:bg-slate-800"
              >
                {sectionLabel}
                <ArrowUpRight size={16} />
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
