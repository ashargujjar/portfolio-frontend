import { useState } from "react";
import { Plus, Trash2, Award, Save } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

const uploadImageToCloudinary = async (file: File) => {
  const token = localStorage.getItem("token");
  const sigRes = await fetch(`${apiUrl}/api/uploads/signature`, { 
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
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

const CertificatesManager = () => {
  const { certificates: certs, setCertificates: setCerts } = usePortfolio();
  
  const [savedBlocks, setSavedBlocks] = useState<Record<string, boolean>>({});
  const [savingBlocks, setSavingBlocks] = useState<Record<string, boolean>>({});

  const handleBlockSave = async (id: string) => {
    try {
      setSavingBlocks(prev => ({ ...prev, [id]: true }));
      const cert = certs.find((c: any) => c.id === id);
      if (!cert) return;

      let imageUrl = { url: cert.image, public_id: cert.public_id };
      if (cert.file) {
        const uploadResult = await uploadImageToCloudinary(cert.file);
        imageUrl = uploadResult;
      }

      const payload = {
        title: cert.title,
        issuer: cert.issuer,
        link: cert.link,
        imageUrl: imageUrl.url ? imageUrl : undefined,
      };

      if (id.startsWith('new-')) {
        const response = await fetch(`${apiUrl}/api/certificates`, { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }, 
          body: JSON.stringify(payload) 
        });
        const data = await response.json();
        if (data.success) {
           setCerts(certs.map((c: any) => c.id === id ? {
             id: data.data._id,
             title: data.data.title,
             issuer: data.data.issuer,
             link: data.data.link,
             image: data.data.imageUrl?.url || "",
             public_id: data.data.imageUrl?.public_id || "",
           } : c));
        }
      } else {
        await fetch(`${apiUrl}/api/certificates/${id}`, { 
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }, 
          body: JSON.stringify(payload) 
        });
        if (cert.file) {
           setCerts(certs.map((c: any) => c.id === id ? {
             ...c,
             image: imageUrl.url,
             public_id: imageUrl.public_id,
             file: undefined
           } : c));
        }
      }

      setSavedBlocks(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setSavedBlocks(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (error) {
      console.error("Error saving certificate:", error);
      alert("Failed to save certificate.");
    } finally {
      setSavingBlocks(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAdd = () => {
    setCerts([{ id: `new-${Date.now()}`, title: "New Certificate", issuer: "Issuer", image: "", link: "" }, ...certs]);
  };

  const updateCert = (id: string, field: string, value: any) => {
    setCerts(certs.map((c: any) => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCert = async (id: string) => {
    if (!id.startsWith('new-')) {
       if (!window.confirm("Are you sure you want to delete this certificate?")) return;
       try {
         await fetch(`${apiUrl}/api/certificates/${id}`, { 
           method: 'DELETE',
           headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
       } catch (error) {
         console.error("Error deleting certificate:", error);
         return;
       }
    }
    setCerts(certs.filter((c: any) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2"><Award className="text-amber-500"/> Certificates</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certs.map((cert: any) => (
          <div key={cert.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex gap-4">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Title</label>
                <input type="text" value={cert.title} onChange={e => updateCert(cert.id, 'title', e.target.value)} className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Issuer</label>
                <input type="text" value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Certificate Image</label>
                  <input type="file" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setCerts(certs.map((c: any) => c.id === cert.id ? {
                        ...c,
                        file: file,
                        image: URL.createObjectURL(file)
                      } : c));
                    }
                  }} className="w-full border rounded-lg px-2 py-0.5 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                  {cert.image && !cert.image.startsWith("blob:") && (
                    <span className="text-[10px] text-slate-400 mt-1 block truncate">Uploaded</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Link</label>
                  <input type="url" value={cert.link} onChange={e => updateCert(cert.id, 'link', e.target.value)} className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => handleBlockSave(cert.id)} 
                  disabled={savingBlocks[cert.id]}
                  className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingBlocks[cert.id] ? "Saving..." : savedBlocks[cert.id] ? "Saved!" : <><Save size={14}/> Save</>}
                </button>
              </div>
            </div>
            <button onClick={() => removeCert(cert.id)} className="self-start p-1 text-rose-500 hover:bg-rose-50 rounded transition"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesManager;
