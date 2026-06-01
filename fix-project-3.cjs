const fs = require('fs');

let content = fs.readFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', 'utf8');

// 1. Add useEffect to imports
content = content.replace(
  'import React, { useState, useRef } from "react";',
  'import React, { useState, useRef, useEffect } from "react";'
);

// 2. Add topBannerFile and fetch data in useEffect
const stateTarget = `  const [formData, setFormData] = useState(emptyProjectForm);
  const [topBannerImg, setTopBannerImg] = useState<string>("");
  const [image, setImage] = useState<Array<{ url: string }>>([]);
  const [isEditing, setIsEditing] = useState(false);`;

const stateReplacement = `  const [formData, setFormData] = useState(emptyProjectForm);
  const [topBannerImg, setTopBannerImg] = useState<any>("");
  const [topBannerFile, setTopBannerFile] = useState<File | null>(null);
  const [image, setImage] = useState<Array<{ url: string, public_id?: string }>>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(\`\${apiUrl}/api/project\`);
        const data = await res.json();
        if (data.success && data.data) {
          const mapped = data.data.map((p: any) => ({ ...p, id: p._id }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);`;

content = content.replace(stateTarget, stateReplacement);

// 3. Update handleCoverUpload
const coverTarget = `  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setTopBannerImg(localUrl);
    }`;

const coverReplacement = `  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTopBannerFile(file);
      const localUrl = URL.createObjectURL(file);
      setTopBannerImg(localUrl);
    }`;

content = content.replace(coverTarget, coverReplacement);

// 4. Update removeGalleryItem
const removeGalleryTarget = `  const removeGalleryItem = (indexToDrop: number) => {
    const newGalleryFiles = galleryFiles.filter((_, idx) => idx !== indexToDrop);
    setGalleryFiles(newGalleryFiles);
    setImage(image.filter((_, idx) => idx !== indexToDrop));
  };`;

const removeGalleryReplacement = `  const removeGalleryItem = async (indexToDrop: number) => {
    const imgToDelete = image[indexToDrop];
    if (imgToDelete && imgToDelete.public_id) {
      try {
        await fetch(\`\${apiUrl}/api/project/delete-image\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: imgToDelete.public_id })
        });
      } catch (err) {
        console.error("Failed to delete image", err);
      }
    }
    const newGalleryFiles = galleryFiles.filter((_, idx) => idx !== indexToDrop);
    setGalleryFiles(newGalleryFiles);
    setImage(image.filter((_, idx) => idx !== indexToDrop));
  };`;

content = content.replace(removeGalleryTarget, removeGalleryReplacement);

// 5. Replace handleSaveProject
const saveProjectTargetRegex = /  const handleSaveProject = async \(e: React\.FormEvent\) => \{[\s\S]*?      setViewMode\("list"\);\n    \};/;

const saveProjectReplacement = `  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalCoverImageUrl = typeof topBannerImg === 'object' ? topBannerImg : { url: topBannerImg };

    const coverImageForm = new FormData();
    if (topBannerFile) {
      coverImageForm.append("file", topBannerFile);
      coverImageForm.append("folder", signatureData?.folder || "");
      coverImageForm.append("signature", signatureData?.signature || "");
      coverImageForm.append("timestamp", signatureData?.timestamp || "");
      coverImageForm.append("api_key", signatureData?.apiKey || "");
      const uploadCoverImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData?.cloudName}/image/upload\`,
        {
          method: "POST",
          body: coverImageForm,
        });
      if (!uploadCoverImage.ok) {
        throw new Error(
          "Failed to request the upload signature.");
      }
      const uploadPayload =
        (await uploadCoverImage.json()) as CloudinaryUploadResponse;

      finalCoverImageUrl = { url: uploadPayload.secure_url, public_id: uploadPayload.public_id };
    }

    const uploadedGalleryImages = [];
    for (const file of galleryFiles) {
      const galleryForm = new FormData()
      galleryForm.append('file', file)
      galleryForm.append('folder', signatureData?.folder || "")
      galleryForm.append('signature', signatureData?.signature || "")
      galleryForm.append('timestamp', signatureData?.timestamp || "")
      galleryForm.append('api_key', signatureData?.apiKey || "")
      const uploadGalleryImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData?.cloudName}/image/upload\`, {
        method: 'POST',
        body: galleryForm,
      })
      const uploadPayload = (await uploadGalleryImage.json()) as CloudinaryUploadResponse
      uploadedGalleryImages.push({
        url: uploadPayload.secure_url,
        public_id: uploadPayload.public_id,
      })
    }

    const parsedTechStack = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalImages = [...image, ...uploadedGalleryImages];

    const projectPayload = {
      title: formData.title,
      description: formData.description,
      shortSummary: formData.shortSummary,
      live: formData.live,
      github: formData.github,
      techStack: parsedTechStack,
      topBannerImg: finalCoverImageUrl,
      image: finalImages,
    };

    if (isEditing && currentEditId) {
      const res = await fetch(\`\${apiUrl}/api/project/\${currentEditId}\`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectPayload)
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...data.data, id: data.data._id };
        setProjects(projects.map((p) => p.id === currentEditId ? updated : p));
      }
    } else {
      const res = await fetch(\`\${apiUrl}/api/project\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectPayload)
      });
      const data = await res.json();
      if (data.success) {
        setProjects([...projects, { ...data.data, id: data.data._id }]);
      }
    }
    setViewMode("list");
  };`;

content = content.replace(saveProjectTargetRegex, saveProjectReplacement);

// 6. Update handleDeleteProject
const deleteTargetRegex = /    const handleDeleteProject = \(id: string, name: string\) => \{[\s\S]*?      \}\n    \};/;

const deleteReplacement = `    const handleDeleteProject = async (id: string, name: string) => {
      if (
        window.confirm(\`Are you sure you want to permanently delete "\${name}"?\`)
      ) {
        try {
          await fetch(\`\${apiUrl}/api/project/\${id}\`, { method: 'DELETE' });
          setProjects(projects.filter((p) => p.id !== id));
          if (selectedProject?.id === id) setSelectedProject(null);
        } catch (err) {
          console.error("Failed to delete project", err);
        }
      }
    };`;

content = content.replace(deleteTargetRegex, deleteReplacement);

// 7. Update rendering src for topBannerImg
content = content.replace('src={topBannerImg}', 'src={typeof topBannerImg === "object" ? topBannerImg?.url : topBannerImg}');
// Update mapping src for project card if there is one
content = content.replace('src={project.topBannerImg}', 'src={typeof project.topBannerImg === "object" ? project.topBannerImg?.url : project.topBannerImg}');
content = content.replace('src={selectedProject.topBannerImg}', 'src={typeof selectedProject.topBannerImg === "object" ? selectedProject.topBannerImg?.url : selectedProject.topBannerImg}');

// Also clean up that syntax error in the end if they added '}' or not
// We can just rely on normal formatting
content = content.replace('}\nexport default ProjectsManager;', 'export default ProjectsManager;');


fs.writeFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', content);
