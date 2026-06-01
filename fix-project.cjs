const fs = require('fs');
let content = fs.readFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', 'utf8');

content = content.replace(
  '  const [formData, setFormData] = useState(emptyProjectForm);\n  const [topBannerImg, setTopBannerImg] = useState<string>("");\n  const [image, setImage] = useState<Array<{ url: string }>>([]);',
  '  const [formData, setFormData] = useState(emptyProjectForm);\n  const [topBannerImg, setTopBannerImg] = useState<string>("");\n  const [topBannerFile, setTopBannerFile] = useState<File | null>(null);\n  const [image, setImage] = useState<Array<{ url: string, public_id?: string }>>([]);'
);

content = content.replace(
  '  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (file) {\n      const localUrl = URL.createObjectURL(file);\n      setTopBannerImg(localUrl);\n    }',
  '  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (file) {\n      setTopBannerFile(file);\n      const localUrl = URL.createObjectURL(file);\n      setTopBannerImg(localUrl);\n    }'
);

const oldSave = `  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const coverImageForm = new FormData();
    if (topBannerImg) {
      coverImageForm.append("file", topBannerImg);
      coverImageForm.append("folder", signatureData?.folder);
      coverImageForm.append("signature", signatureData?.signature)
      coverImageForm.append("timestamp", signatureData?.timestamp)
      coverImageForm.append("api_key", signatureData?.apiKey)
      const uploadCoverImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData.cloudName}/image/upload\`,
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

      const coverImageUrl = uploadPayload?.secure_url;
      // cover Image Data
      const coverImageData = {
        url: coverImageUrl,
        public_id: uploadPayload.public_id,
      }
      const uploadedGalleryImages = [];

      for (const file of galleryFiles) {
        const galleryForm = new FormData()
        galleryForm.append('file', file)
        galleryForm.append('folder', signatureData?.folder)
        galleryForm.append('signature', signatureData?.signature)
        galleryForm.append('timestamp', signatureData?.timestamp)
        galleryForm.append('api_key', signatureData?.apiKey)
        const uploadGalleryImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData.cloudName}/image/upload\`, {
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

      const projectPayload = {
        ...formData,
        techStack: parsedTechStack,
        topBannerImg:
          topBannerImg ||
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        image: image,
      };

      if (isEditing && currentEditId) {
        setProjects(
          projects.map((p) =>
            p.id === currentEditId
              ? { ...p, ...projectPayload, id: currentEditId }
              : p,
          ),
        );
      } else {
        setProjects([
          ...projects,
          { ...projectPayload, id: \`proj-\${Date.now()}\` },
        ]);
      }
      setViewMode("list");
    };`;

const newSave = `  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalCoverImageUrl = topBannerImg;
    const coverImageForm = new FormData();
    if (topBannerFile) {
      coverImageForm.append("file", topBannerFile);
      coverImageForm.append("folder", signatureData?.folder);
      coverImageForm.append("signature", signatureData?.signature)
      coverImageForm.append("timestamp", signatureData?.timestamp)
      coverImageForm.append("api_key", signatureData?.apiKey)
      const uploadCoverImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData.cloudName}/image/upload\`,
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

      finalCoverImageUrl = uploadPayload?.secure_url;
    }

    const uploadedGalleryImages = [];
    for (const file of galleryFiles) {
      const galleryForm = new FormData()
      galleryForm.append('file', file)
      galleryForm.append('folder', signatureData?.folder)
      galleryForm.append('signature', signatureData?.signature)
      galleryForm.append('timestamp', signatureData?.timestamp)
      galleryForm.append('api_key', signatureData?.apiKey)
      const uploadGalleryImage = await fetch(\`https://api.cloudinary.com/v1_1/\${signatureData.cloudName}/image/upload\`, {
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
      ...formData,
      techStack: parsedTechStack,
      topBannerImg:
        finalCoverImageUrl ||
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      image: finalImages,
    };

    if (isEditing && currentEditId) {
      setProjects(
        projects.map((p) =>
          p.id === currentEditId
            ? { ...p, ...projectPayload, id: currentEditId }
            : p,
        ),
      );
    } else {
      setProjects([
        ...projects,
        { ...projectPayload, id: \`proj-\${Date.now()}\` },
      ]);
    }
    setViewMode("list");
  };`;

content = content.replace(oldSave, newSave);

fs.writeFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', content);
