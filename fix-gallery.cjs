const fs = require('fs');
let content = fs.readFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', 'utf8');

// 1. Remove galleryFiles state
content = content.replace('const [galleryFiles, setGalleryFiles] = useState<File[]>([]);', '');

// 2. Update image state interface to allow file
content = content.replace(
  'const [image, setImage] = useState<Array<{ url: string, public_id?: string }>>([]);',
  'const [image, setImage] = useState<Array<{ url: string, public_id?: string, file?: File }>>([]);'
);

// 3. Update addGalleryItem
const addGalleryTarget = `  const addGalleryItem = () => {
    if (!tempImgUrl) return;
    setGalleryFiles((prev) => [...prev, galeryImage]);
    setGalleryImage(null);
    setImage([
      ...image,
      { url: tempImgUrl },
    ]);
    setTempImgUrl("");
    if (imageFileRef.current) imageFileRef.current.value = "";
  };`;

const addGalleryReplacement = `  const addGalleryItem = () => {
    if (!tempImgUrl) return;
    setImage([
      ...image,
      { url: tempImgUrl, file: galeryImage },
    ]);
    setGalleryImage(null);
    setTempImgUrl("");
    if (imageFileRef.current) imageFileRef.current.value = "";
  };`;
content = content.replace(addGalleryTarget, addGalleryReplacement);

// 4. Update removeGalleryItem
const removeGalleryTarget = `  const removeGalleryItem = async (indexToDrop: number) => {
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
    setImage(image.filter((_, idx) => idx !== indexToDrop));
  };`;
content = content.replace(removeGalleryTarget, removeGalleryReplacement);

// 5. Update handleSaveProject image logic
const saveGalleryTargetRegex = /    const uploadedGalleryImages = \[\];\n    for \(const file of galleryFiles\) \{[\s\S]*?    const finalImages = \[\.\.\.image, \.\.\.uploadedGalleryImages\];/;

const saveGalleryReplacement = `    const existingImages = image.filter(img => !img.file).map(img => ({ url: img.url, public_id: img.public_id }));
    const filesToUpload = image.filter(img => img.file).map(img => img.file);

    const uploadedGalleryImages = [];
    for (const file of filesToUpload) {
      if (!file) continue;
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

    const finalImages = [...existingImages, ...uploadedGalleryImages];`;

content = content.replace(saveGalleryTargetRegex, saveGalleryReplacement);

fs.writeFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', content);
console.log('Fixed Project.tsx successfully');
