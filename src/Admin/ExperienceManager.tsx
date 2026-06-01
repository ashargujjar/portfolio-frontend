import { useState } from "react";
import { Plus, Trash2, GraduationCap, Briefcase, Save } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  createEducationDraft,
  createExperienceDraft,
  normalizeEducationItem,
  normalizeExperienceItem,
  type EducationItem,
  type ExperienceItem,
} from "../context/portfolioTimeline";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const ExperienceManager = () => {
  const { education, setEducation, experience, setExperience, profile, setProfile } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'education'|'experience'>('experience');

  const [savedBlocks, setSavedBlocks] = useState<Record<string, boolean>>({});
  const [savingBlockId, setSavingBlockId] = useState<string | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  const handleBlockSave = (id: string) => {
    setSavedBlocks(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSavedBlocks(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleAddEducation = () => {
    setEducation((prev: EducationItem[]) => [createEducationDraft(), ...prev]);
  };
  const handleAddExperience = () => {
    setExperience((prev: ExperienceItem[]) => [createExperienceDraft(), ...prev]);
  };

  const updateEducation = (
    id: string,
    field: keyof Pick<EducationItem, "degree" | "school" | "year">,
    value: string,
  ) => {
    setEducation((prev: EducationItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };
  const updateExperience = (
    id: string,
    field: keyof Pick<
      ExperienceItem,
      "role" | "company" | "period" | "description"
    >,
    value: string,
  ) => {
    setExperience((prev: ExperienceItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const saveEducation = async (item: EducationItem) => {
    const payload = {
      degree: item.degree.trim(),
      school: item.school.trim(),
      year: item.year.trim(),
    };

    if (!payload.degree || !payload.school || !payload.year) {
      alert("Degree, school, and year are required.");
      return;
    }

    setSavingBlockId(item.id);

    try {
      const response = await fetch(`${apiUrl}/api/education`, {
        method: item.isDraft ? "POST" : "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(
          item.isDraft ? payload : { id: item.id, ...payload },
        ),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save education");
      }

      const savedItem = normalizeEducationItem(data.data ?? { id: item.id, ...payload });
      setEducation((prev: EducationItem[]) =>
        item.isDraft
          ? [savedItem, ...prev.filter((entry) => entry.id !== item.id)]
          : prev.map((entry) => (entry.id === item.id ? savedItem : entry)),
      );
      handleBlockSave(savedItem.id);
    } catch (error) {
      console.error("Error saving education:", error);
      alert(error instanceof Error ? error.message : "Error saving education");
    } finally {
      setSavingBlockId(null);
    }
  };

  const saveExperience = async (item: ExperienceItem) => {
    const payload = {
      role: item.role.trim(),
      company: item.company.trim(),
      period: item.period.trim(),
      description: item.description.trim(),
    };

    if (!payload.role || !payload.company || !payload.period || !payload.description) {
      alert("Role, company, period, and description are required.");
      return;
    }

    setSavingBlockId(item.id);

    try {
      const response = await fetch(`${apiUrl}/api/experience`, {
        method: item.isDraft ? "POST" : "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(
          item.isDraft ? payload : { id: item.id, ...payload },
        ),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save experience");
      }

      const savedItem = normalizeExperienceItem(
        data.data ?? { id: item.id, ...payload },
      );
      setExperience((prev: ExperienceItem[]) =>
        item.isDraft
          ? [savedItem, ...prev.filter((entry) => entry.id !== item.id)]
          : prev.map((entry) => (entry.id === item.id ? savedItem : entry)),
      );
      handleBlockSave(savedItem.id);
    } catch (error) {
      console.error("Error saving experience:", error);
      alert(error instanceof Error ? error.message : "Error saving experience");
    } finally {
      setSavingBlockId(null);
    }
  };

  const removeEducation = async (item: EducationItem) => {
    if (item.isDraft) {
      setEducation((prev: EducationItem[]) =>
        prev.filter((entry) => entry.id !== item.id),
      );
      return;
    }

    setDeletingBlockId(item.id);

    try {
      const response = await fetch(`${apiUrl}/api/education`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete education");
      }

      setEducation((prev: EducationItem[]) =>
        prev.filter((entry) => entry.id !== item.id),
      );
    } catch (error) {
      console.error("Error deleting education:", error);
      alert(error instanceof Error ? error.message : "Error deleting education");
    } finally {
      setDeletingBlockId(null);
    }
  };

  const removeExperience = async (item: ExperienceItem) => {
    if (item.isDraft) {
      setExperience((prev: ExperienceItem[]) =>
        prev.filter((entry) => entry.id !== item.id),
      );
      return;
    }

    setDeletingBlockId(item.id);

    try {
      const response = await fetch(`${apiUrl}/api/experience`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete experience");
      }

      setExperience((prev: ExperienceItem[]) =>
        prev.filter((entry) => entry.id !== item.id),
      );
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert(error instanceof Error ? error.message : "Error deleting experience");
    } finally {
      setDeletingBlockId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">AI Career Summary (Hero block)</label>
        <textarea rows={3} value={profile.heroSummary} onChange={e => setProfile({...profile, heroSummary: e.target.value})} className="w-full border rounded-xl p-3 text-sm" />
      </div>

      <div className="flex gap-4 border-b pb-2">
        <button onClick={() => setActiveTab('experience')} className={`flex items-center gap-2 pb-2 px-2 border-b-2 font-bold ${activeTab === 'experience' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>
          <Briefcase size={18} /> Work Experience
        </button>
        <button onClick={() => setActiveTab('education')} className={`flex items-center gap-2 pb-2 px-2 border-b-2 font-bold ${activeTab === 'education' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
          <GraduationCap size={18} /> Education
        </button>
      </div>

      {activeTab === 'experience' && (
        <div className="space-y-4">
          <button type="button" onClick={handleAddExperience} className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">
            <Plus size={16} /> Add Experience
          </button>
          {experience.map((exp: ExperienceItem) => (
            <div key={exp.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex gap-4">
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Role</label>
                  <input type="text" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} placeholder="Full Stack Developer" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Company</label>
                  <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Period</label>
                  <input type="text" value={exp.period} onChange={e => updateExperience(exp.id, 'period', e.target.value)} placeholder="2024 - Present" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                  <textarea rows={2} value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Describe the work you did there." className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div className="md:col-span-2 pt-1 flex justify-end">
                  <button type="button" onClick={() => saveExperience(exp)} disabled={savingBlockId === exp.id} className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60">
                    {savingBlockId === exp.id ? "Saving..." : savedBlocks[exp.id] ? "Saved!" : <><Save size={14}/> Save</>}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => removeExperience(exp)} disabled={deletingBlockId === exp.id} className="self-start p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-60">{deletingBlockId === exp.id ? "..." : <Trash2 size={18} />}</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-4">
          <button type="button" onClick={handleAddEducation} className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">
            <Plus size={16} /> Add Education
          </button>
          {education.map((edu: EducationItem) => (
            <div key={edu.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex gap-4">
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Degree</label>
                  <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="BS Computer Science" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">School</label>
                  <input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="University Name" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Year</label>
                  <input type="text" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} placeholder="2020 - 2024" className="w-full border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div className="md:col-span-2 pt-1 flex justify-end">
                  <button type="button" onClick={() => saveEducation(edu)} disabled={savingBlockId === edu.id} className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60">
                    {savingBlockId === edu.id ? "Saving..." : savedBlocks[edu.id] ? "Saved!" : <><Save size={14}/> Save</>}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => removeEducation(edu)} disabled={deletingBlockId === edu.id} className="self-start p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-60">{deletingBlockId === edu.id ? "..." : <Trash2 size={18} />}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
