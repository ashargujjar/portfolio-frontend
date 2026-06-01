const fs = require('fs');
let content = fs.readFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', 'utf8');

// 1. Remove useEffect fetch
const fetchEffectRegex = /  useEffect\(\(\) => \{\n    const fetchProjects = async \(\) => \{\n[\s\S]*?    fetchProjects\(\);\n  \}, \[\]\);/;
content = content.replace(fetchEffectRegex, '');

// 2. Simplify handleCoverUpload
const coverUploadRegex = /  const handleCoverUpload = async \(e: React.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?  \};/;
const simpleCoverUpload = `  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTopBannerFile(file);
      const localUrl = URL.createObjectURL(file);
      setTopBannerImg(localUrl);
    }
  };`;
content = content.replace(coverUploadRegex, simpleCoverUpload);

// 3. Simplify handleSaveProject
const saveProjectRegex = /  const handleSaveProject = async \(e: React.FormEvent\) => \{[\s\S]*?  \};/;
const simpleSaveProject = `  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topBannerImg && !topBannerFile) {
      alert("Please provide a Main Banner Cover Image.");
      return;
    }

    const parsedTechStack = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      id: isEditing && currentEditId ? currentEditId : "proj-" + Date.now().toString(),
      title: formData.title,
      description: formData.description,
      shortSummary: formData.shortSummary,
      live: formData.live,
      github: formData.github,
      techStack: parsedTechStack,
      topBannerImg: typeof topBannerImg === 'object' ? topBannerImg.url || topBannerImg : topBannerImg,
      image: image.map(img => ({ url: img.url })),
    };

    if (isEditing && currentEditId) {
      setProjects(projects.map((p) => p.id === currentEditId ? projectPayload : p));
    } else {
      setProjects([...projects, projectPayload]);
    }
    setViewMode("list");
  };`;
content = content.replace(saveProjectRegex, simpleSaveProject);

// 4. Simplify handleDeleteProject
const deleteProjectRegex = /    const handleDeleteProject = async \(id: string, name: string\) => \{[\s\S]*?    \};/;
const simpleDeleteProject = `    const handleDeleteProject = (id: string, name: string) => {
      if (
        window.confirm(\`Are you sure you want to permanently delete "\${name}"?\`)
      ) {
        setProjects(projects.filter((p) => p.id !== id));
        if (selectedProject?.id === id) setSelectedProject(null);
      }
    };`;
content = content.replace(deleteProjectRegex, simpleDeleteProject);

fs.writeFileSync('d:/portfolio/frontend/src/Admin/Project.tsx', content);
console.log('Project.tsx frontend logic simplified to dummy data.');
