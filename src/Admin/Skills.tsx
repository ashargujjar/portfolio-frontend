import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  Layers,
  Cpu,
  Code2,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const SkillsManager = () => {
  const [categories, setCategories] = useState<any[]>([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [deletingSkillCatId, setDeletingSkillCatId] = useState<string | null>(null);
  const [deletingSkillName, setDeletingSkillName] = useState<string | null>(null);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);

  // State for adding a brand new category block
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // State for adding a specific skill tag inside a category
  const [newSkillText, setNewSkillText] = useState<{ [key: string]: string }>({});

  // State for editing an existing category title inline
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/skills`);
      const data = await response.json();
      if (data.success) {
        const formatted = data.data.map((cat: any) => ({
          id: cat._id,
          category: cat.title,
          skills: cat.skills || [],
        }));
        setCategories(formatted);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to pick contextual icons based on category names
  const getCategoryIcon = (category: string) => {
    const name = category?.toLowerCase() || "";
    if (name.includes("back")) return <Layers size={18} className="text-sky-600" />;
    if (name.includes("front")) return <Code2 size={18} className="text-emerald-600" />;
    if (name.includes("hard") || name.includes("iot")) return <Cpu size={18} className="text-amber-600" />;
    return <Sparkles size={18} className="text-violet-600" />;
  };

  // --- ACTIONS ---

  // 1. Create Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSavingCategory(true);
    try {
      const response = await fetch(`${apiUrl}/api/skills`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ category: newCategoryName.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setNewCategoryName("");
        setIsAddingCategory(false);
        fetchSkills();
      } else {
        alert(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingCategory(false);
    }
  };

  // 2. Delete Category Block
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this entire skill category?")) return;
    
    setDeletingCatId(id);
    try {
      const response = await fetch(`${apiUrl}/api/skills`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchSkills();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting category");
    } finally {
      setDeletingCatId(null);
    }
  };

  // 3. Start Editing Category Title
  const startEditingCategory = (id: string, currentName: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(currentName);
  };

  // 4. Save Edited Category Title
  const saveCategoryName = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    setSavingEditId(id);
    try {
      const response = await fetch(`${apiUrl}/api/skills/title`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id, category: editingCategoryName.trim() }),
      });
      
      if (response.ok) {
        setEditingCategoryId(null);
        fetchSkills();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to edit category title");
      }
    } catch (error) {
      console.error(error);
      alert("Error editing category title");
    } finally {
      setSavingEditId(null);
    }
  };

  // 5. Create Skill Tag
  const handleAddSkill = async (catId: string) => {
    const text = newSkillText[catId];
    if (!text || !text.trim()) return;

    setAddingSkillId(catId);
    try {
      const response = await fetch(`${apiUrl}/api/skills`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: catId, skills: text.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setNewSkillText({ ...newSkillText, [catId]: "" });
        fetchSkills();
      } else {
        alert(data.message || "Failed to add skill");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddingSkillId(null);
    }
  };

  // 6. Delete Skill Tag
  const handleDeleteSkill = async (catId: string, skillToDelete: string) => {
    setDeletingSkillCatId(catId);
    setDeletingSkillName(skillToDelete);
    try {
      const response = await fetch(`${apiUrl}/api/skills/specific`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: catId, skillname: skillToDelete }),
      });
      
      if (response.ok) {
        fetchSkills();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete skill tag");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting skill tag");
    } finally {
      setDeletingSkillCatId(null);
      setDeletingSkillName(null);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] md:p-10">
      {/* Header View Area matching your screenshot */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Technical Skills
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            My toolbox for building digital products.
          </p>
        </div>

        {/* Action Button: Create New Category Column */}
        <button
          onClick={() => setIsAddingCategory(!isAddingCategory)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800"
        >
          {isAddingCategory ? <X size={14} /> : <Plus size={14} />}
          {isAddingCategory ? "Cancel Block" : "Add Skill Block"}
        </button>
      </div>

      {/* Inline Form to Create a New Category Group */}
      {isAddingCategory && (
        <form
          onSubmit={handleAddCategory}
          className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl bg-slate-50 p-5 border border-slate-200/60 max-w-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              New Block Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Cloud & DevOps"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-400/10"
            />
          </div>
          <button
            type="submit"
            disabled={isSavingCategory}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 px-4 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            {isSavingCategory ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
            Create Category
          </button>
        </form>
      )}

      {/* Live Preview / Interactive Management Layout Container */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-sky-600"></span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No skill categories found. Add one above!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
          >
            <div>
              {/* Category Top Row: Title Management & Block Delete */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {getCategoryIcon(cat.category)}

                  {editingCategoryId === cat.id ? (
                    // Editing mode title input
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-0.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveCategoryName(cat.id)}
                        disabled={savingEditId === cat.id}
                        className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md disabled:opacity-50"
                      >
                        {savingEditId === cat.id ? <span className="loading loading-spinner loading-xs text-emerald-600"></span> : <Check size={14} />}
                      </button>
                      <button
                        onClick={() => setEditingCategoryId(null)}
                        disabled={savingEditId === cat.id}
                        className="text-slate-400 hover:bg-slate-50 p-1 rounded-md disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    // Regular Display title view
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {cat.category}
                    </h3>
                  )}
                </div>

                {/* Edit & Delete Action Row for specific blocks */}
                {editingCategoryId !== cat.id && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditingCategory(cat.id, cat.category)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Rename Category"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={deletingCatId === cat.id}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50"
                      title="Delete Category"
                    >
                      {deletingCatId === cat.id ? <span className="loading loading-spinner loading-xs text-rose-600"></span> : <Trash2 size={14} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Badges / Skill Tags Layout View with individual Delete Options */}
              <div className="mt-4 flex flex-wrap gap-2">
                {cat.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">
                    No tags added yet.
                  </p>
                ) : (
                  cat.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 pl-2.5 pr-1.5 py-1 text-xs font-medium text-slate-700 hover:border-rose-200 hover:bg-rose-50/30 transition-colors group/tag"
                    >
                      {skill}
                      <button
                        onClick={() => handleDeleteSkill(cat.id, skill)}
                        disabled={deletingSkillCatId === cat.id && deletingSkillName === skill}
                        className="rounded p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors disabled:opacity-50"
                        title={`Remove ${skill}`}
                      >
                        {deletingSkillCatId === cat.id && deletingSkillName === skill ? <span className="loading loading-spinner loading-xs text-rose-600"></span> : <X size={10} />}
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Sub Form: Adding individual tag variables directly into target columns */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g., Docker)"
                  value={newSkillText[cat.id] || ""}
                  onChange={(e) =>
                    setNewSkillText({
                      ...newSkillText,
                      [cat.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(cat.id);
                    }
                  }}
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs outline-none transition focus:bg-white focus:border-slate-300"
                />
                <button
                  onClick={() => handleAddSkill(cat.id)}
                  disabled={addingSkillId === cat.id}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {addingSkillId === cat.id ? <span className="loading loading-spinner loading-xs text-slate-700 mr-1"></span> : null}
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
