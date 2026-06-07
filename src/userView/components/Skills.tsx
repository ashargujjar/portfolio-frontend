import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

export const Skills = ({ onLoadComplete }: { onLoadComplete?: () => void }) => {
  const [skillSet, setSkillSet] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/skills`);
        const data = await response.json();
        if (data.success) {
          const formatted = data.data.map((cat: any) => ({
            category: cat.title,
            items: cat.skills || [],
          }));
          setSkillSet(formatted);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
        onLoadComplete?.();
      }
    };
    fetchSkills();
  }, [onLoadComplete]);

  return (
    <section id="skills" className="py-16 bg-slate-50 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">
              Technical Skills
            </h3>
            <p className="text-slate-500 mt-1">
              My toolbox for building digital products.
            </p>
          </div>
        </div>

        <div className="min-h-[200px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-purple-600"></span>
            </div>
          ) : skillSet.length === 0 ? (
            <div className="flex h-full items-center justify-center py-20 text-slate-500">
              No technical skills to display yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillSet.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group"
                >
                  <h4 className="font-bold text-lg mb-4 text-blue-600 group-hover:text-blue-700">
                    {skill.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item: string) => (
                      <span
                        key={item}
                        className="bg-slate-100 px-3 py-1 rounded-md text-sm text-slate-700 group-hover:bg-blue-50 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
