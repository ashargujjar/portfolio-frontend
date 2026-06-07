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
  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 animate-fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_30%)]" />
      <Navbar />
      <AIChatbot />
      <main className="relative">
        <Hero />
        <Skills />
        <ProjectsSection />
        <Certificates />
        <ExperienceEducation />
        <Blogs />
        <Footer />
      </main>
    </div>
  );
};

export default Home;


