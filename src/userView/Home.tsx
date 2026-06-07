import { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import Navbar from "./components/Nav";
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import AIChatbot from "./components/Chatbot";
import ProjectsSection from "./components/Projects";
import Blogs from "./components/Blogs";
import { Certificates } from "./Certificates";
import { ExperienceEducation } from "./Education";
import Footer from "./Footer";

const Home = () => {
  const { isContextLoading } = usePortfolio();
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [blogsLoaded, setBlogsLoaded] = useState(false);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Safety fallback timeout to prevent infinite loader in case of a hung connection
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsTimedOut(true);
    }, 5000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const isPageLoading =
    !isTimedOut &&
    (isContextLoading || !projectsLoaded || !blogsLoaded || !skillsLoaded);

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            {/* Outer spinning ring */}
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-500/20 border-t-sky-500"></div>
            {/* Inner pulsing glow */}
            <div className="absolute h-10 w-10 animate-ping rounded-full bg-sky-500/10"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 animate-pulse">
              ASHAR ASHRAF
            </h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              Loading Portfolio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 animate-fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_30%)]" />
      <Navbar />
      <AIChatbot />
      <main className="relative">
        <Hero />
        <Skills onLoadComplete={() => setSkillsLoaded(true)} />
        <ProjectsSection onLoadComplete={() => setProjectsLoaded(true)} />
        <Certificates />
        <ExperienceEducation />
        <Blogs onLoadComplete={() => setBlogsLoaded(true)} />
        <Footer />
      </main>
    </div>
  );
};

export default Home;


