import { GraduationCap, Briefcase, Calendar } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  type EducationItem,
  type ExperienceItem,
} from "../context/portfolioTimeline";
import { Spinner } from "./components/Spinner";

export const ExperienceEducation = () => {
  const { education, experience, isContextLoading } = usePortfolio();

  return (
    <section
      id="education"
      className="border-t border-slate-100 bg-white px-6 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Experience & Education
            </h2>
            <p className="text-slate-500 mt-2">
              My professional and academic journey so far.
            </p>
          </div>
        </div>

        {isContextLoading ? (
          <Spinner color="blue" text="Loading experience & education..." />
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 border-b pb-4">
                <Briefcase className="text-blue-600" /> Work Experience
              </h3>
              {experience.map((exp: ExperienceItem) => (
                <div
                  key={exp.id}
                  className="relative pl-6 border-l-2 border-slate-100 hover:border-blue-500 transition-colors"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
                    <span>{exp.company}</span>
                    <span className="text-slate-300">|</span>
                    <span>{exp.period}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 border-b pb-4">
                <GraduationCap className="text-blue-600" /> Education
              </h3>
              {education.map((edu: EducationItem) => (
                <div
                  key={edu.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-bold text-lg">{edu.degree}</h4>
                  <p className="text-blue-600 font-medium">{edu.school}</p>
                  <div className="flex justify-between mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {edu.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
