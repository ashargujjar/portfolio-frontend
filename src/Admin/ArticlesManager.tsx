import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Newspaper, Save, X } from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const uploadImageToCloudinary = async (file: File) => {
  const token = localStorage.getItem("token");
  const sigRes = await fetch(`${apiUrl}/api/uploads/signature`, { 
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const sigData = await sigRes.json();
  if (!sigData.success) throw new Error("Failed to get signature");
  const { timestamp, signature, cloudName, apiKey, folder } = sigData.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  if (folder) formData.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const uploadData = await uploadRes.json();
  return {
    url: uploadData.secure_url,
    public_id: uploadData.public_id,
  };
};

const emptyArticle = {
  _id: "",
  title: "",
  category: "",
  date: "",
  readTime: "",
  image: "",
  public_id: "",
  file: undefined as File | undefined,
  excerpt: "",
  aiSummary: "",
  topics: "",
  content: "",
};

const ArticlesManager = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [formData, setFormData] = useState(emptyArticle);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/blogs`);
      const data = await res.json();
      if (data.success || data.data) {
        setArticles(data.data || data.blog || []);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const handleOpenCreateForm = () => {
    setFormData({
      ...emptyArticle,
      date: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
    setViewMode("form");
  };

  const handleOpenEditForm = (article: any) => {
    setFormData({
      _id: article._id,
      title: article.title,
      category: article.category,
      date: new Date(article.date).toISOString().split('T')[0],
      readTime: article.readTime,
      image: article.imgUrl?.url || "",
      public_id: article.imgUrl?.public_id || "",
      file: undefined,
      excerpt: article.excerpt,
      aiSummary: article.aiSummary || "",
      topics: (article.topics || []).join(", "),
      content: article.content || "",
    });
    setIsEditing(true);
    setViewMode("form");
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let imgUrl = { url: formData.image, public_id: formData.public_id };
      if (formData.file) {
        const uploadResult = await uploadImageToCloudinary(formData.file);
        imgUrl = uploadResult;
      } else if (!formData.image) {
         alert("Image is required");
         setIsSaving(false);
         return;
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        readTime: formData.readTime,
        imgUrl: imgUrl,
        excerpt: formData.excerpt,
        aiSummary: formData.aiSummary,
        topics: formData.topics.split(",").map((t) => t.trim()).filter(Boolean),
        content: formData.content,
      };

      if (isEditing && formData._id) {
        const res = await fetch(`${apiUrl}/api/blogs/${formData._id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch(`${apiUrl}/api/blogs`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to create");
      }
      
      await fetchBlogs();
      setViewMode("list");
    } catch (error) {
      console.error(error);
      alert("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Delete this article?")) {
      try {
        await fetch(`${apiUrl}/api/blogs/${id}`, { 
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        await fetchBlogs();
      } catch (error) {
         alert("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Newspaper size={20} className="text-violet-600" /> Articles Manager
          </h3>
          <p className="text-sm text-slate-500">Manage blog posts and insights.</p>
        </div>
        {viewMode === "list" ? (
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800"
          >
            <Plus size={16} /> New Article
          </button>
        ) : (
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50"
          >
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {viewMode === "list" && (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <div key={article._id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-violet-600 uppercase">{article.category}</span>
                  <h4 className="text-lg font-bold mt-1 leading-tight">{article.title}</h4>
                  <p className="text-xs text-slate-500 mt-2">{new Date(article.date).toLocaleDateString()} · {article.readTime}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEditForm(article)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteArticle(article._id)} className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "form" && (
        <form onSubmit={handleSaveArticle} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
              <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Read Time</label>
              <input type="text" required value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Upload Image</label>
              {!formData.image ? (
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setFormData({
                         ...formData, 
                         file: file,
                         image: URL.createObjectURL(file)
                      });
                    }
                  }} 
                  className="w-full border rounded-xl px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
                />
              ) : (
                <div className="relative inline-block mt-2">
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none">
                    Preview
                  </span>
                  <img 
                    src={formData.image} 
                    alt="Article preview" 
                    className="w-64 h-40 object-cover rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, image: "", file: undefined, public_id: ""})}
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200 shadow-sm z-10 transition-colors"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Excerpt</label>
              <textarea rows={2} required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">AI Summary</label>
              <textarea rows={2} value={formData.aiSummary} onChange={e => setFormData({...formData, aiSummary: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Topics (comma separated)</label>
              <input type="text" value={formData.topics} onChange={e => setFormData({...formData, topics: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Content</label>
              <textarea rows={6} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <button disabled={isSaving} type="submit" className="flex items-center gap-2 bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16} /> {isSaving ? "Saving..." : "Save Article"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticlesManager;

