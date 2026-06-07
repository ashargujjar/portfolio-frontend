import React, { createContext, useContext, useEffect, useState } from "react";
import { articles as initialArticles } from "../data/articles";
import { projects as initialProjects } from "../data/projects";
import {
  loadEducationState,
  loadExperienceState,
  normalizeEducationItem,
  normalizeExperienceItem,
  persistEducationState,
  persistExperienceState,
  type EducationItem,
  type ExperienceItem,
} from "./portfolioTimeline";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const initialEducation: EducationItem[] = [];

const initialExperience: ExperienceItem[] = [];

const initialCertificates: any[] = [];

const initialProfile = {
  name: "Ashar Ashraf",
  role: "Full Stack Engineer",
  tagline: "I build responsive, modern, and scalable systems.",
  heroSummary: "Ashar bridges the gap between hardware and software...",
  email: "contact@example.com",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  twitter: "https://twitter.com/",
  resumeUrl: "#"
};

const initialSkillsData = [
  { id: "cat-1", category: "Backend", skills: ["Node.js", "Express", "MongoDB", "OpenAI API"] },
  { id: "cat-2", category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"] },
  { id: "cat-3", category: "Hardware/IoT", skills: ["ESP32", "Arduino", "Sensors", "Telemetry"] },
];

const PortfolioContext = createContext<any>(null);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [projects, setProjects] = useState(initialProjects);
  const [education, setEducation] = useState(() =>
    loadEducationState(initialEducation),
  );
  const [experience, setExperience] = useState(() =>
    loadExperienceState(initialExperience),
  );
  const [certificates, setCertificates] = useState(initialCertificates);
  const [profile, setProfile] = useState(initialProfile);
  const [skills, setSkills] = useState(initialSkillsData);
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/education`);
        const data = await response.json();

        if (response.ok && data.success) {
          const formatted = data.data.map((item: any) =>
            normalizeEducationItem(item),
          );
          setEducation(formatted);
        }
      } catch (error) {
        console.error("Error fetching education:", error);
      }
    };

    const fetchExperience = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/experience`);
        const data = await response.json();

        if (response.ok && data.success) {
          const formatted = data.data.map((item: any) =>
            normalizeExperienceItem(item),
          );
          setExperience(formatted);
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
      }
    };

    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/certificates`);
        const data = await response.json();
        if (response.ok && data.success) {
          const formatted = data.data.map((item: any) => ({
            id: item._id,
            title: item.title,
            issuer: item.issuer,
            link: item.link,
            image: item.imageUrl?.url || "",
            public_id: item.imageUrl?.public_id || "",
          }));
          setCertificates(formatted);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    const fetchAll = async () => {
      await Promise.allSettled([
        fetchEducation(),
        fetchExperience(),
        fetchCertificates(),
      ]);
      setIsContextLoading(false);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    persistEducationState(education);
  }, [education]);

  useEffect(() => {
    persistExperienceState(experience);
  }, [experience]);

  return (
    <PortfolioContext.Provider value={{
      articles, setArticles,
      projects, setProjects,
      education, setEducation,
      experience, setExperience,
      certificates, setCertificates,
      profile, setProfile,
      skills, setSkills,
      isContextLoading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
