import React, { useState, useRef } from "react";
import {
  Trash2,
  Edit2,
  Eye,
  LayoutGrid,
  FilePlus,
  Save,
  X,
  Code2,
  Image as ImageIcon,
  Upload,
  Plus,
  ExternalLink,
} from "lucide-react";

const emptyProjectForm = {
  title: "",
  shortSummary: "",
  description: "",
  techStack: "",
  live: "",
  github: "",
};

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const ProjectsManager = () => {
  const [projects, setProjects] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<"list" | "form" | "preview">("list");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState(emptyProjectForm);
  const [topBannerImg, setTopBannerImg] = useState<any>("");
  const [image, setImage] = useState<
    Array<{ url: string; file?: File; public_id?: string }>
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingImageIdx, setRemovingImageIdx] = useState<number | null>(null);

  // Temporary state for the image item creator
  const [tempImgUrl, setTempImgUrl] = useState("");
  const [tempImgFile, setTempImgFile] = useState<File | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/project`);
      const data = await response.json();
      if (data.success) {
        const fetchedProjects = data.data.map((p: any) => ({
          id: p._id,
          title: p.title,
          shortSummary: p.shortSummary,
          description: p.description,
          techStack: p.techStack,
          topBannerImg: p.topBannerImg?.secure_url || "",
          live: p.live || "",
          github: p.github || "",
          image:
            p.image?.map((img: any) => ({
              url: img.secure_url,
              public_id: img.public_id,
            })) || [],
        }));
        setProjects(fetchedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setTopBannerImg({ url: localUrl, file });
    }
  };

  const handleGalleryItemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setTempImgUrl(localUrl);
      setTempImgFile(file);
    }
  };

  const addGalleryItem = () => {
    if (!tempImgUrl) return;
    setImage([...image, { url: tempImgUrl, file: tempImgFile || undefined }]);
    setTempImgUrl("");
    setTempImgFile(null);
    if (imageFileRef.current) imageFileRef.current.value = "";
  };

  const removeGalleryItem = async (indexToDrop: number) => {
    const imgToRemove = image[indexToDrop];
    // If it's an existing image and we are editing, we can delete it from Cloudinary/Backend here or leave it to standard update
    // But since the project has a specific delete image route:
    if (imgToRemove.public_id && isEditing && currentEditId) {
      if (!window.confirm("Delete this image from the backend?")) return;
      setRemovingImageIdx(indexToDrop);
      try {
        await fetch(`${apiUrl}/api/image/${currentEditId}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ public_id: imgToRemove.public_id }),
        });
      } catch (error) {
        console.error("Failed to delete image", error);
      } finally {
        setRemovingImageIdx(null);
      }
    }
    setImage(image.filter((_, idx) => idx !== indexToDrop));
  };

  // --- CRUD ACTIONS ---
  const handleOpenCreateForm = () => {
    setFormData(emptyProjectForm);
    setTopBannerImg("");
    setImage([]);
    setIsEditing(false);
    setViewMode("form");
  };
  type Project = {
    title: string;
    shortSummary: string;
    description: string;
    techStack: string[];
    live?: string;
    github?: string;
    topBannerImg: string;
    image: Array<{ url: string; file?: File; public_id?: string }>;
    id: string;
  };
  const handleOpenEditForm = (project: Project) => {
    setFormData({
      title: project.title,
      shortSummary: project.shortSummary,
      description: project.description,
      techStack: project.techStack.join(", "),
      live: project.live || "",
      github: project.github || "",
    });
    setTopBannerImg(project.topBannerImg);
    setImage(project.image || []);
    setCurrentEditId(project.id);
    setIsEditing(true);
    setViewMode("form");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topBannerImg && !isEditing) {
      alert("Please provide a Main Banner Cover Image.");
      return;
    }

    setIsSaving(true);
    const formDataPayload = new FormData();
    formDataPayload.append("title", formData.title);
    formDataPayload.append("stack", formData.techStack);
    formDataPayload.append("summary", formData.shortSummary);
    formDataPayload.append("description", formData.description);
    formDataPayload.append("projectUrl", formData.live);
    formDataPayload.append("githubUrl", formData.github);

    if (topBannerImg?.file) {
      formDataPayload.append("banner", topBannerImg.file);
    }

    image.forEach((img) => {
      if (img.file) {
        formDataPayload.append("gallery", img.file);
      }
    });

    try {
      const endpoint =
        isEditing && currentEditId
          ? `${apiUrl}/api/project/${currentEditId}`
          : `${apiUrl}/api/project`;

      const method = isEditing && currentEditId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formDataPayload,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save project");
      }

      fetchProjects();
      setViewMode("list");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to permanently delete "${name}"?`)
    ) {
      setDeletingId(id);
      try {
        const response = await fetch(`${apiUrl}/api/project/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          fetchProjects();
          if (selectedProject?.id === id) setSelectedProject(null);
        } else {
          alert("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleOpenPreview = (project: any) => {
    setSelectedProject(project);
    setViewMode("preview");
  };

  return (
    <div className="space-y-8">
      {/* Sub-Header area */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid size={20} className="text-emerald-600" />
            Case Studies Directory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live portfolio presentation layouts and deployment URLs.
          </p>
        </div>

        {viewMode !== "list" ? (
          <button
            onClick={() => setViewMode("list")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <X size={14} /> Close Work Area
          </button>
        ) : (
          <button
            onClick={handleOpenCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition shadow-sm"
          >
            <FilePlus size={14} /> Create New Case Study
          </button>
        )}
      </div>

      {/* --- INDEX OVERVIEW GRID VIEW --- */}
      {viewMode === "list" &&
        (isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No projects found. Create one to get started!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-900 text-white">
                  <img
                    src={project.topBannerImg}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-x-4 bottom-4">
                    <h4 className="text-xl font-black tracking-tight drop-shadow-md">
                      {project.title}
                    </h4>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.shortSummary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Directory Bottom Project Item Footer Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPreview(project)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-[11px] font-bold text-sky-800 hover:bg-sky-100 transition"
                      >
                        <Eye size={12} /> Preview Live
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditForm(project)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProject(project.id, project.title)
                        }
                        disabled={deletingId === project.id}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50"
                      >
                        {deletingId === project.id ? (
                          <span className="loading loading-spinner loading-xs text-rose-600"></span>
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* --- CREATE / EDIT FORM WORKSPACE VIEW --- */}
      {viewMode === "form" && (
        <form
          onSubmit={handleSaveProject}
          className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-lg font-bold text-slate-900">
              {isEditing
                ? `Modify Layout: ${formData.title}`
                : "Create New Case Study Portfolio Entity"}
            </h4>
            <p className="text-xs text-slate-500">
              Provide textual copy, link resources, and upload images matching
              your layout specs.
            </p>
          </div>

          {/* Banner Cover Frame */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Main Banner Cover Image
            </label>
            <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 bg-slate-50 cursor-pointer transition text-center min-h-[140px]">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  Upload Image Cover
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  PNG, JPG up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </label>

              <div className="border border-slate-200 bg-slate-50 rounded-2xl flex items-center justify-center p-2 relative group overflow-hidden min-h-[140px]">
                {topBannerImg ? (
                  <>
                    <img
                      src={
                        typeof topBannerImg === "object"
                          ? topBannerImg?.url
                          : topBannerImg
                      }
                      alt="Cover layout preview"
                      className="w-full h-full max-h-36 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setTopBannerImg("")}
                      className="absolute top-4 right-4 bg-rose-600 text-white rounded-full p-1.5 shadow-md hover:bg-rose-700 transition opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                    <ImageIcon size={14} /> Base cover thumbnail view
                    placeholder
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Left Copy Form Inputs Stack */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Rabta Social Platform"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Short Card Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortSummary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortSummary: e.target.value,
                    })
                  }
                  placeholder="Brief abstract displayed on directory grid cards..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Right Copy Form Inputs Stack */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tech Stack badges (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                  placeholder="React, Socket.io, Express, MongoDB"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Extended Presentation Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Write full analytical project insights here..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* New Link Resources Fields Area */}
          <div className="grid gap-4 sm:grid-cols-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                <ExternalLink size={13} className="text-sky-600" /> Live Project
                Preview URL
              </label>
              <input
                type="url"
                value={formData.live}
                onChange={(e) =>
                  setFormData({ ...formData, live: e.target.value })
                }
                placeholder="https://myproduct.com"
                className="w-full bg-white rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                <Code2 size={13} className="text-slate-700" /> GitHub Repository
                Link
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                className="w-full bg-white rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* GALLERY INGESTION */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/60 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-emerald-600" />
                Visual Story Images Gallery Asset Ingestion
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload a local device image, and mount it to the layout stack.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end bg-white p-4 border border-slate-200 rounded-xl">
              <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl px-3 py-2 bg-slate-50 cursor-pointer text-slate-600 hover:border-emerald-500 transition text-xs font-semibold h-10">
                <Upload size={14} />
                {tempImgUrl ? "Image Loaded" : "Choose Gallery Image"}
                <input
                  type="file"
                  ref={imageFileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryItemUpload}
                />
              </label>

              <button
                type="button"
                onClick={addGalleryItem}
                disabled={!tempImgUrl}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950"
              >
                <Plus size={14} className="mr-1" /> Inject Item
              </button>
            </div>

            {image.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                {image.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-slate-200 bg-white p-2 flex flex-col gap-2 group overflow-hidden"
                  >
                    <div className="h-24 w-full rounded-lg bg-slate-100 overflow-hidden">
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      disabled={removingImageIdx === idx}
                      className="absolute top-3 right-3 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition opacity-0 group-hover:opacity-100 disabled:opacity-100"
                    >
                      {removingImageIdx === idx ? (
                        <span className="loading loading-spinner loading-xs text-white"></span>
                      ) : (
                        <X size={12} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Save size={14} />
              )}
              {isSaving ? "Saving..." : "Commit Changes"}
            </button>
          </div>
        </form>
      )}

      {/* --- LIVE PREVIEW VIEW LAYER --- */}
      {viewMode === "preview" && selectedProject && (
        <div className="rounded-[2.5rem] border-2 border-slate-300/80 bg-slate-50 p-4 md:p-8 max-w-5xl mx-auto shadow-inner space-y-8 relative">
          <div className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md z-10 shadow-sm">
            Live Preview Mode
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div className="space-y-4">
              <span className="block text-xs font-bold tracking-widest text-amber-600 uppercase">
                Case Study
              </span>
              <h2 className="text-3xl font-black text-slate-950 md:text-5xl tracking-tight">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProject.shortSummary}
              </p>

              {/* Dynamic Action Buttons Integration */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm hover:shadow"
                  >
                    Open live preview <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                  >
                    View source code <Code2 size={14} />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner max-h-64 md:max-h-none">
              <img
                src={selectedProject.topBannerImg}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                <div className="h-px bg-slate-200 flex-1" /> Project Description{" "}
                <div className="h-px bg-slate-200 flex-1" />
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
              <h4 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <Code2 size={18} className="text-emerald-600" /> Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((t: string) => (
                  <span
                    key={t}
                    className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {selectedProject.image?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Image Gallery
                </span>
                <h4 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                  Visual detail for the project story
                </h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {selectedProject.image.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="h-40 overflow-hidden bg-slate-200 border-b border-slate-100">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProjectsManager;
