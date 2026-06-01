import { Download, GitBranch, Globe, Heart, Mail, Send } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const homePrefix = pathname === "/" ? "" : "/";

  return (
    <footer className="bg-slate-900 px-6 pb-8 pt-16 text-slate-300">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Ashar<span className="text-sky-500">.</span>
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Full Stack Developer building digital experiences that bridge the
              gap between software and the physical world.Eager to go into the
              Agentic Ai
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="transition-colors hover:text-sky-400">
                <GitBranch size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-sky-400">
                <Globe size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-sky-400">
                <Send size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-sky-400">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`${homePrefix}#projects`}
                  className="transition-colors hover:text-white"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href={`${homePrefix}#skills`}
                  className="transition-colors hover:text-white"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href={`${homePrefix}#articles`}
                  className="transition-colors hover:text-white"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href={`${homePrefix}#education`}
                  className="transition-colors hover:text-white"
                >
                  Education
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white">Work with me</h3>
            <p className="text-sm text-slate-400">
              Have a project in mind or just want to chat?
            </p>
            <a
              href="tel:03705218077"
              className="block text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              03705218077
            </a>
            <button className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-sky-900/20 transition-all hover:bg-sky-700">
              <Download size={18} />
              Get Resume PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs font-medium uppercase tracking-widest text-slate-500 md:flex-row">
          <p>Copyright {currentYear} Ashar. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <Heart size={12} className="fill-red-500 text-red-500" />{" "}
            using React & Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
