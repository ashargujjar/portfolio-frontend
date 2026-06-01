import { useState } from "react";
import { UserRound, Save, Upload, FileText } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const ProfileManager = ({ focusBorder }: { focusBorder: string }) => {
  const { profile, setProfile } = usePortfolio();

  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleResumeUpload = () => {
    if (resumeFile) {
      alert("Resume uploaded successfully!");
      setProfile({...profile, resumeUrl: URL.createObjectURL(resumeFile)});
    } else {
      alert("Please select a PDF file first.");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2"><UserRound className="text-amber-500"/> Profile & Socials</h3>
          <p className="text-sm text-slate-500 mt-1">Update public-facing profile variables and hero information.</p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Display Name</label>
          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Professional Role</label>
          <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hero Tagline</label>
          <textarea rows={2} value={profile.tagline} onChange={e => setProfile({...profile, tagline: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Public Email</label>
          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">GitHub URL</label>
          <input type="url" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">LinkedIn URL</label>
          <input type="url" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Twitter/X URL</label>
          <input type="url" value={profile.twitter} onChange={e => setProfile({...profile, twitter: e.target.value})} className={`w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition ${focusBorder}`} />
        </div>

        <div className="sm:col-span-2 border-t pt-6 mt-2">
          <h4 className="text-sm font-bold flex items-center gap-2 mb-4"><FileText className="text-slate-500" size={18}/> Resume Management</h4>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Upload PDF Resume</label>
              <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files?.[0] || null)} className={`w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 ${focusBorder}`} />
            </div>
            <button onClick={handleResumeUpload} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition w-full sm:w-auto h-[42px]">
              <Upload size={16}/> Upload Resume
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition">
          {saved ? "Saved!" : <><Save size={16}/> Save Profile</>}
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;
