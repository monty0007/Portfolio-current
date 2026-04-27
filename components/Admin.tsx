import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPosts, createPost, deletePost, updatePost, invalidateBlogCache, BlogPost } from '../services/blogService';
import { getAchievements, addAchievement, deleteAchievement } from '../services/dataService';
import { getProjects, createProject, updateProject, deleteProject, saveProjectOrder } from '../services/projectService';
import { Achievement, Project } from '../types';
import Toast from './Toast';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'blogs' | 'achievements' | 'projects'>('blogs');
  const [showManual, setShowManual] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingAchId, setEditingAchId] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [deleteProjectTargetId, setDeleteProjectTargetId] = useState<string | null>(null);
  const getDefaultProjectState = () => ({
    title: '',
    description: '',
    image: '',
    tags: '',
    color: '#FFD600',
    link: '',
    githubLink: '',
    disabled: false,
  });
  const [newProject, setNewProject] = useState(getDefaultProjectState());

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [showDeleteAchModal, setShowDeleteAchModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteAchTargetId, setDeleteAchTargetId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [imageMap, setImageMap] = useState<{ [key: string]: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastCursorPositionRef = useRef<{ start: number; end: number } | null>(null);
  const projectFormRef = useRef<HTMLDivElement>(null);

  // Resize an image file to fit within maxWidth x maxHeight, returns a base64 data URL
  const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality = 0.82): Promise<{ dataUrl: string; resized: boolean }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onloadend = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to decode image'));
        img.onload = () => {
          let { width, height } = img;
          const needsResize = width > maxWidth || height > maxHeight;
          if (needsResize) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve({ dataUrl: canvas.toDataURL('image/jpeg', quality), resized: needsResize });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Markdown-style templates
  // JSON Templates
  const TEMPLATES = {
    heading: '{\n  "type": "heading",\n  "content": "BIG TITLE HERE"\n}',
    subheading: '{\n  "type": "subheading",\n  "content": "Small section title..."\n}',
    paragraph: '{\n  "type": "paragraph",\n  "content": "Once upon a time in the 22nd century..."\n}',
    image: '{\n  "type": "image",\n  "content": "url_here",\n  "caption": "Add a caption"\n}',
    imageGrid: '{\n  "type": "image-grid",\n  "content": "url1_here",\n  "content2": "url2_here",\n  "caption": "Add a caption for both"\n}',
    code: '{\n  "type": "code",\n  "content": "console.log(\'Action Bastion!\');",\n  "language": "javascript"\n}',
    note: '{\n  "type": "note",\n  "content": "This is a secret gadget tip!"\n}',
    link: '{\n  "type": "link",\n  "content": "https://example.com",\n  "caption": "Check out this resource"\n}'
  };



  // Helper to get today's date in YYYY-MM-DD format for date input
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getDefaultBlogState = () => ({
    title: '',
    category: 'Engineering',
    excerpt: '',
    sectionsJSON: '[\n' + TEMPLATES.heading + ',\n' + TEMPLATES.paragraph + '\n]',
    color: '#FF4B4B',
    image: '',
    date: getTodayDate(),
    liveLink: '',
    isDraft: false,
    scheduledDate: ''
  });

  const [newBlog, setNewBlog] = useState(getDefaultBlogState());

  const [newAch, setNewAch] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    icon: '🏆',
    color: '#FFD600'
  });

  useEffect(() => {
    refreshData();
    setAchievements(getAchievements());
    refreshProjects();
  }, []);

  const refreshProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const refreshData = async () => {
    invalidateBlogCache();
    const posts = await getPosts();
    setBlogs(posts);
  };



  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    showFeedback("Template Copied! 📋");
  };

  const smartInsert = (template: string, useLastPosition: boolean = false) => {
    const textarea = textareaRef.current;
    let current = newBlog.sectionsJSON;

    let start: number | null = null;
    let end: number | null = null;

    if (textarea && document.activeElement === textarea) {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
    } else if (useLastPosition && lastCursorPositionRef.current) {
      start = lastCursorPositionRef.current.start;
      end = lastCursorPositionRef.current.end;
    }

    const trimmed = current.trim();

    const executeInsert = (startIdx: number, endIdx: number, textToInsert: string, fallbackUpdatedText: string, finalCursorPos: number) => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(startIdx, endIdx);
        const success = document.execCommand('insertText', false, textToInsert);
        if (!success) {
          setNewBlog(prev => ({ ...prev, sectionsJSON: fallbackUpdatedText }));
        }
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(finalCursorPos, finalCursorPos);
          lastCursorPositionRef.current = { start: finalCursorPos, end: finalCursorPos };
        }, 0);
      } else {
        setNewBlog(prev => ({ ...prev, sectionsJSON: fallbackUpdatedText }));
      }
      setErrors(prev => ({ ...prev, sectionsJSON: false }));
    };

    // If we are appending to a non-empty list that ends with ], add inside the array
    if ((start === null || start === current.length) && trimmed.length > 2 && trimmed.endsWith(']')) {
      // Find position before the last ]
      const lastBracketIndex = current.lastIndexOf(']');
      const beforeBracket = current.substring(0, lastBracketIndex).trimEnd();

      let textToInsert = '';
      if (beforeBracket.endsWith('}')) {
        textToInsert = ',\n' + template;
      } else if (beforeBracket.endsWith('[')) {
        textToInsert = '\n' + template;
      } else {
        textToInsert = '\n' + template;
      }

      const fallbackUpdated = beforeBracket + textToInsert + '\n]';
      const finalCursorPos = beforeBracket.length + textToInsert.length;

      executeInsert(beforeBracket.length, current.length, textToInsert + '\n]', fallbackUpdated, finalCursorPos);
      return;
    }

    if (start !== null && end !== null) {
      let insertText = template;
      const before = current.substring(0, start);
      const after = current.substring(end);
      const beforeTrimmed = before.trimEnd();
      const afterTrimmed = after.trimStart();

      if (beforeTrimmed.endsWith('}')) {
        insertText = ',\n' + insertText;
      }
      if (afterTrimmed.startsWith('{')) {
        insertText = insertText + ',';
      }

      const fallbackUpdated = before + insertText + after;
      const finalCursorPos = start + insertText.length;

      executeInsert(start, end, insertText, fallbackUpdated, finalCursorPos);
    } else {
      if (!trimmed) {
        const insertText = '[\n' + template + '\n]';
        executeInsert(0, current.length, insertText, insertText, insertText.length - 2);
      } else {
        const insertText = '\n' + template;
        executeInsert(current.length, current.length, insertText, current + insertText, current.length + insertText.length);
      }
    }
  };

  const clearEditor = () => {
    setShowWipeModal(true);
  };

  const confirmWipe = () => {
    setNewBlog({ ...newBlog, sectionsJSON: '' });
    setShowWipeModal(false);
    showFeedback("Board Wiped Clean! 🧼");
  };

  const handleSaveBlog = async () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!newBlog.title.trim()) newErrors.title = true;
    if (!newBlog.sectionsJSON.trim() || newBlog.sectionsJSON.trim() === '[]') newErrors.sectionsJSON = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showFeedback("HOLD UP! Mandatory fields are empty! 🛑", "error");
      return;
    }

    try {
      // Parse JSON to sections
      let parsedSections;
      try {
        parsedSections = JSON.parse(newBlog.sectionsJSON);
        if (!Array.isArray(parsedSections)) throw new Error("Root must be an array");
      } catch (e) {
        setErrors({ sectionsJSON: true });
        showFeedback("INVALID JSON! Check syntax! 🤖💥", "error");
        return;
      }

      // Resolve Image Tokens
      parsedSections = parsedSections.map((section: any) => {
        if (section.type === 'image' && section.content && section.content.startsWith('{{IMG_') && section.content.endsWith('}}')) {
          const token = section.content.slice(2, -2);
          if (imageMap[token]) {
            return { ...section, content: imageMap[token] };
          }
        }
        return section;
      });

      // Store date in ISO format for proper sorting, format for display happens on retrieval
      const selectedDate = new Date(newBlog.date);
      // Use ISO format for storage (enables proper date sorting in DB)
      const isoDate = selectedDate.toISOString();

      const blogData = {
        title: newBlog.title,
        category: newBlog.category,
        excerpt: newBlog.excerpt,
        sections: parsedSections,
        color: newBlog.color,
        content: '',
        date: isoDate,
        image: newBlog.image,
        readTime: '5 min',
        tags: [],
        author: 'Manish Yadav',
        liveLink: newBlog.liveLink,
        isDraft: newBlog.isDraft,
        scheduledDate: newBlog.scheduledDate || undefined
      };

      let result;
      if (editingBlogId !== null) {
        // Update existing blog
        result = await updatePost(editingBlogId, blogData);
      } else {
        // Create new blog
        result = await createPost(blogData);
      }

      if (result.success) {
        await refreshData();
        setNewBlog(getDefaultBlogState());
        setImageMap({});
        setErrors({});
        setEditingBlogId(null);
        showFeedback(editingBlogId !== null ? "BLOG UPDATED! ✏️✨" : "MISSION ACCOMPLISHED: Blog Deployed! 🚀✨");
      } else {
        showFeedback(`DEPLOYMENT FAILED! ${result.message} 🛑`, "error");
      }
    } catch (e) {
      setErrors({ sectionsJSON: true });
      showFeedback("JSON CRASH! Check your brackets/commas! 🤖💥", "error");
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    // Parse the date from the blog (e.g., "JAN 27, 2026") to YYYY-MM-DD format
    let dateValue = getTodayDate();
    try {
      const parsedDate = new Date(blog.date);
      if (!isNaN(parsedDate.getTime())) {
        // Use local date components to avoid timezone shift
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        dateValue = `${year}-${month}-${day}`;
      }
    } catch (e) {
      // Keep today's date if parsing fails
    }

    // Process sections to replace base64 images with tokens for cleaner editing
    const sections = blog.sections || [];
    const newImageMap: { [key: string]: string } = {};
    let imgCounter = 1;

    const processedSections = sections.map((section: any) => {
      if (section.type === 'image' && section.content && section.content.startsWith('data:image')) {
        // This is a base64 image - replace with a token
        const token = `IMG_EXISTING_${imgCounter++}`;
        newImageMap[token] = section.content;
        return { ...section, content: `{{${token}}}` };
      }
      return section;
    });

    setImageMap(newImageMap);

    setNewBlog({
      title: blog.title,
      category: blog.category || 'Engineering',
      excerpt: blog.excerpt,
      sectionsJSON: JSON.stringify(processedSections, null, 2),
      color: blog.color || '#FF4B4B',
      image: blog.image || '',
      date: dateValue,
      liveLink: blog.liveLink || '',
      isDraft: !!blog.isDraft,
      scheduledDate: blog.scheduledDate || ''
    });
    setErrors({});
    showFeedback("Blog loaded for editing! ✏️");
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setNewBlog(getDefaultBlogState());
    setErrors({});
    showFeedback("Edit cancelled! 🔙");
  };

  const handleDeleteBlog = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    const success = await deletePost(deleteTargetId);
    if (success) {
      invalidateBlogCache();
      await refreshData();
      showFeedback("ENTRY DELETED! 🗑️");
    } else {
      showFeedback("DELETE FAILED! 🛑", "error");
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const handleSaveAch = () => {
    if (!newAch.title || !newAch.issuer) {
      showFeedback("Fill all fields to forge this badge! 🛑", "error");
      return;
    }

    if (editingAchId !== null) {
      // Update existing achievement
      const updatedAchievements = achievements.map(a =>
        a.id === editingAchId ? { ...newAch, id: editingAchId } : a
      );
      setAchievements(updatedAchievements);
      localStorage.setItem('Manish_portfolio_achievements_v2', JSON.stringify(updatedAchievements));
      setEditingAchId(null);
      setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
      showFeedback("BADGE UPDATED! ✏️✨");
    } else {
      // Create new achievement
      const ach: Achievement = { ...newAch, id: Date.now().toString() };
      setAchievements(addAchievement(ach));
      setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
      showFeedback("NEW BADGE FORGED! 🏆✨");
    }
  };

  const handleEditAch = (ach: Achievement) => {
    setEditingAchId(ach.id);
    setNewAch({
      title: ach.title,
      issuer: ach.issuer,
      date: ach.date,
      icon: ach.icon,
      color: ach.color
    });
    showFeedback("Badge loaded for editing! ✏️");
  };

  const handleCancelEditAch = () => {
    setEditingAchId(null);
    setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
    showFeedback("Edit cancelled! 🔙");
  };

  const handleDeleteAch = (id: string) => {
    setDeleteAchTargetId(id);
    setShowDeleteAchModal(true);
  };

  const confirmDeleteAch = () => {
    if (deleteAchTargetId) {
      setAchievements(deleteAchievement(deleteAchTargetId));
      showFeedback("BADGE DELETED! 🗑️");
    }
    setShowDeleteAchModal(false);
    setDeleteAchTargetId(null);
  };

  const moveBadge = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= achievements.length) return;

    const updated = [...achievements];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    setAchievements(updated);
    localStorage.setItem('Manish_portfolio_achievements_v2', JSON.stringify(updated));
    showFeedback(direction === 'up' ? "Badge moved up! ⬆️" : "Badge moved down! ⬇️");
  };
  // --- PROJECT HANDLERS ---
  const handleSaveProject = async () => {
    if (!newProject.title.trim()) {
      showFeedback('Project title is required! 🛑', 'error');
      return;
    }
    const projectData: Omit<Project, 'id'> = {
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      image: newProject.image.trim(),
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      color: newProject.color,
      link: newProject.link.trim(),
      githubLink: newProject.githubLink.trim(),
      disabled: newProject.disabled,
    };
    let result;
    if (editingProjectId !== null) {
      result = await updateProject(editingProjectId, projectData);
    } else {
      result = await createProject(projectData);
    }
    if (result.success) {
      await refreshProjects();
      setNewProject(getDefaultProjectState());
      setEditingProjectId(null);
      showFeedback(editingProjectId !== null ? 'PROJECT UPDATED! ✏️✨' : 'PROJECT LAUNCHED! 🚀✨');
    } else {
      showFeedback(`FAILED! ${result.message} 🛑`, 'error');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      color: project.color,
      link: project.link,
      githubLink: project.githubLink || '',
      disabled: project.disabled,
    });
    showFeedback('Project loaded for editing! ✏️');
    // Scroll the form into view so the user sees the populated fields
    setTimeout(() => {
      projectFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleDeleteProject = (id: string) => {
    setDeleteProjectTargetId(id);
    setShowDeleteProjectModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!deleteProjectTargetId) return;
    const success = await deleteProject(deleteProjectTargetId);
    if (success) {
      await refreshProjects();
      showFeedback('PROJECT DELETED! 🗑️');
    } else {
      showFeedback('DELETE FAILED! 🛑', 'error');
    }
    setShowDeleteProjectModal(false);
    setDeleteProjectTargetId(null);
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setProjects(updated);
    try {
      await saveProjectOrder(updated.map(p => p.id));
      showFeedback(direction === 'up' ? 'Project moved up! ⬆️' : 'Project moved down! ⬇️');
    } catch {
      // Revert optimistic update on failure
      setProjects(projects);
      showFeedback('Failed to save order! 🛑', 'error');
    }
  };

  const DeleteConfirmationModal = () => createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-6xl mb-4">🗑️</div>
        <h3 className="text-2xl font-black uppercase mb-2">Delete this Entry?</h3>
        <p className="font-bold text-gray-600 mb-8">This action cannot be undone. Theoretically.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-white text-black border-4 border-black py-3 font-black uppercase hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-500 text-white border-4 border-black py-3 font-black uppercase hover:bg-red-600 shadow-[4px_4px_0px_#000]"
          >
            Delete!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  const DeleteAchConfirmationModal = () => createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-black uppercase mb-2">Delete this Badge?</h3>
        <p className="font-bold text-gray-600 mb-8">This badge will be removed from your collection!</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowDeleteAchModal(false)}
            className="flex-1 bg-white text-black border-4 border-black py-3 font-black uppercase hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteAch}
            className="flex-1 bg-red-500 text-white border-4 border-black py-3 font-black uppercase hover:bg-red-600 shadow-[4px_4px_0px_#000]"
          >
            Delete!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  const DeleteProjectModal = () => createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-6xl mb-4">🛠️</div>
        <h3 className="text-2xl font-black uppercase mb-2">Delete this Project?</h3>
        <p className="font-bold text-gray-600 mb-8">This will permanently remove the project!</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowDeleteProjectModal(false)}
            className="flex-1 bg-white text-black border-4 border-black py-3 font-black uppercase hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteProject}
            className="flex-1 bg-red-500 text-white border-4 border-black py-3 font-black uppercase hover:bg-red-600 shadow-[4px_4px_0px_#000]"
          >
            Delete!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  const WipeConfirmationModal = () => createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-6xl mb-4">☢️</div>
        <h3 className="text-2xl font-black uppercase mb-2">Detailed Wipe?</h3>
        <p className="font-bold text-gray-600 mb-8">This will destroy all your current work on the board!</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowWipeModal(false)}
            className="flex-1 bg-white text-black border-4 border-black py-3 font-black uppercase hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmWipe}
            className="flex-1 bg-[#FFD600] text-black border-4 border-black py-3 font-black uppercase hover:bg-yellow-400 shadow-[4px_4px_0px_#000]"
          >
            Wipe It!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  // Full JSON template for the copy all button
  const FULL_JSON_TEMPLATE = `[
  {
    "type": "heading",
    "content": "Title Here"
  },
  {
    "type": "subheading",
    "content": "Subtitle Here"
  },
  {
    "type": "paragraph",
    "content": "Your text content..."
  },
  {
    "type": "image",
    "content": "URL or {{IMG_TOKEN}}",
    "caption": "Image caption"
  },
  {
    "type": "image-grid",
    "content": "URL1",
    "content2": "URL2",
    "caption": "Caption for the grid"
  },
  {
    "type": "code",
    "content": "console.log('Hello!');",
    "language": "javascript"
  },
  {
    "type": "note",
    "content": "Important note or tip!"
  },
  {
    "type": "link",
    "content": "https://example.com",
    "caption": "Link description"
  }
]`;

  const SlideOutManual = () => (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group">
      {/* Tab Handle */}
      <div className="flex">
        {/* The sliding panel - syntax reference */}
        <div className="bg-[#003366] border-4 border-l-0 border-black w-0 group-hover:w-[350px] overflow-hidden transition-all duration-300 ease-out shadow-[8px_0px_20px_rgba(0,0,0,0.3)]">
          <div className="w-[350px] p-4 text-white max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black uppercase italic tracking-tighter decoration-yellow-400 underline">📖 JSON Logic Guide</h3>
              <button
                onClick={() => handleCopyTemplate(FULL_JSON_TEMPLATE)}
                className="bg-[#FFD600] text-black px-2 py-1 text-[10px] font-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0px_#000] transition-all"
              >
                📋 COPY ALL
              </button>
            </div>
            <div className="space-y-3 text-xs">

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Structure</p>
                <p className="text-gray-300 mb-1">Everything must be in a list <code>[]</code></p>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Heading</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "heading",
  "content": "Title Here"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Subheading</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "subheading",
  "content": "Subtitle Here"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Paragraph</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "paragraph",
  "content": "Text..."
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Image</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "image",
  "content": "URL",
  "caption": "Alt text"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Image Grid</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "image-grid",
  "content": "URL1",
  "content2": "URL2",
  "caption": "Alt text"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Code Block</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "code",
  "content": "console.log()",
  "language": "javascript"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Note</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "note",
  "content": "Important tip!"
}`}</code>
              </div>

              <div className="bg-black/40 p-2 rounded border border-white/20">
                <p className="text-yellow-400 font-black uppercase mb-1">Link</p>
                <code className="text-green-400 block bg-black/50 p-1 rounded whitespace-pre">{`{
  "type": "link",
  "content": "https://...",
  "caption": "Link text"
}`}</code>
              </div>

            </div>
          </div>
        </div>

        {/* The visible tab handle */}
        <div className="bg-[#003366] border-2 border-l-0 border-black py-2 px-1 cursor-pointer flex items-center shadow-[2px_2px_0px_#000] group-hover:bg-[#004080] transition-colors rounded-r-md">
          <div className="writing-vertical text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-0.5">
            <span className="text-xs">📖</span>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>JSON HELP</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showWipeModal && <WipeConfirmationModal />}
      {showDeleteAchModal && <DeleteAchConfirmationModal />}
      {showDeleteProjectModal && <DeleteProjectModal />}

      {/* ── Dark Admin Header ── */}
      <div className="bg-black border-b-4 border-[#FFD600] pt-32 pb-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#FFD600] border-4 border-black flex items-center justify-center shadow-[5px_5px_0px_rgba(255,214,0,0.2)]">
              <svg viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
                <path d="M2 17L5 6L10 11L12 4L14 11L19 6L22 17H2Z" fill="#000"/>
                <path d="M2 17H22V19H2V17Z" fill="#000"/>
                <circle cx="5" cy="6" r="1.5" fill="#000"/>
                <circle cx="12" cy="4" r="1.5" fill="#000"/>
                <circle cx="19" cy="6" r="1.5" fill="#000"/>
              </svg>
            </div>
            <div>
              <p className="text-[#FFD600]/70 font-black text-[10px] uppercase tracking-[0.3em] mb-0.5">Control Center</p>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                Admin <span className="text-[#FFD600]">Suite</span>
              </h1>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-[#FFD600] text-black border-4 border-black px-6 py-3 font-black uppercase text-sm hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_rgba(255,214,0,0.4)] active:translate-y-1"
          >
            ← Exit Admin
          </button>
        </div>
      </div>

      {/* ── Stats + Tabs ── */}
      <div className="bg-white border-b-4 border-black px-6 py-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FF4B4B] border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_#000] flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">📝</span>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white leading-none">{blogs.length}</div>
                <div className="text-[9px] sm:text-[10px] font-black uppercase text-white/80">Blog Posts</div>
              </div>
            </div>
            <div className="bg-[#FFD600] border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_#000] flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🏆</span>
              <div>
                <div className="text-xl sm:text-2xl font-black text-black leading-none">{achievements.length}</div>
                <div className="text-[9px] sm:text-[10px] font-black uppercase text-black/60">Achievements</div>
              </div>
            </div>
            <div className="bg-[#00A1FF] border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_#000] flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🚀</span>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white leading-none">{projects.length}</div>
                <div className="text-[9px] sm:text-[10px] font-black uppercase text-white/80">Projects</div>
              </div>
            </div>
          </div>
          <div className="flex border-4 border-black overflow-hidden shadow-[4px_4px_0px_#000]">
            <button
              onClick={() => setTab('blogs')}
              className={`flex-1 px-4 py-3 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${tab === 'blogs' ? 'bg-[#FF4B4B] text-white' : 'bg-white text-black hover:bg-[#fff8f8]'}`}
            >
              <span>📝</span>
              <span className="hidden sm:inline">Blogs</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-black border-2 border-black rounded-full leading-none ${tab === 'blogs' ? 'bg-white text-[#FF4B4B]' : 'bg-black text-white'}`}>{blogs.length}</span>
            </button>
            <div className="w-1 bg-black flex-shrink-0" />
            <button
              onClick={() => setTab('achievements')}
              className={`flex-1 px-4 py-3 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${tab === 'achievements' ? 'bg-[#FFD600] text-black' : 'bg-white text-black hover:bg-[#fffdf0]'}`}
            >
              <span>🏆</span>
              <span className="hidden sm:inline">Badges</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-black border-2 border-black rounded-full leading-none ${tab === 'achievements' ? 'bg-black text-[#FFD600]' : 'bg-black text-white'}`}>{achievements.length}</span>
            </button>
            <div className="w-1 bg-black flex-shrink-0" />
            <button
              onClick={() => setTab('projects')}
              className={`flex-1 px-4 py-3 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${tab === 'projects' ? 'bg-[#00A1FF] text-white' : 'bg-white text-black hover:bg-[#f0f9ff]'}`}
            >
              <span>🚀</span>
              <span className="hidden sm:inline">Projects</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-black border-2 border-black rounded-full leading-none ${tab === 'projects' ? 'bg-white text-[#00A1FF]' : 'bg-black text-white'}`}>{projects.length}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">

        {tab === 'blogs' && <SlideOutManual />}

        {tab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">

              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black uppercase text-black">
                    {editingBlogId !== null ? '✏️ Edit Blog' : 'New Blog Forge'}
                  </h2>
                  {editingBlogId !== null && (
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 font-black uppercase border-2 border-black hover:bg-gray-600"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                  </div>
                  <div>
                    <label className="font-black uppercase text-xs mb-1 block">Blog Title {errors.title && <span className="text-red-500 ml-2">REQUIRED!</span>}</label>
                    <input type="text" placeholder="Title..." value={newBlog.title} onChange={e => { setNewBlog({ ...newBlog, title: e.target.value }); setErrors({ ...errors, title: false }) }} className={`w-full p-4 border-4 border-black font-bold text-black ${errors.title ? 'bg-red-50 border-red-500' : ''}`} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })} className="p-4 border-4 border-black font-bold text-black" />
                    <div className="flex flex-col gap-1.5 p-2 border-4 border-black bg-white justify-center shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                      <div className="flex flex-wrap gap-1.5 justify-center mt-0.5">
                        {[
                          { value: "#FF4B4B", label: "Red Alert" },
                          { value: "#00A1FF", label: "Sonic Blue" },
                          { value: "#FFD600", label: "Golden Yellow" },
                          { value: "#10B981", label: "Emerald Green" },
                          { value: "#6B4BFF", label: "Electric Purple" },
                          { value: "#FF6B6B", label: "Coral Pink" },
                          { value: "#F59E0B", label: "Amber Flare" },
                          { value: "#06B6D4", label: "Aqua Bolt" },
                          { value: "#8B5CF6", label: "Void Violet" },
                          { value: "#EC4899", label: "Neon Pink" },
                          { value: "#14B8A6", label: "Teal Strike" },
                          { value: "#DC2626", label: "Crimson Rage" },
                          { value: "#EAB308", label: "Cyber Yellow" }
                        ].map(c => (
                          <div
                            key={c.value}
                            onClick={() => setNewBlog({ ...newBlog, color: c.value })}
                            className={`w-5 h-5 rounded-full border-2 border-black cursor-pointer transition-transform hover:scale-125 hover:z-10 relative ${newBlog.color === c.value ? 'ring-2 ring-black ring-offset-1 scale-125 z-10' : ''}`}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <input
                        type="date"
                        value={newBlog.date}
                        onChange={e => setNewBlog({ ...newBlog, date: e.target.value })}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        className="w-full p-4 border-4 border-black font-bold text-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00A1FF]"
                        title="Blog publish date - controls ordering (latest first)"
                      />
                    </div>
                  </div>

                  <textarea placeholder="Quick Excerpt..." value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} className="w-full p-4 border-4 border-black font-bold h-20 text-black" />

                  <div>
                    <label className="font-black uppercase text-xs mb-1 block">🔗 Live Link <span className="text-gray-400 font-normal">(optional project URL)</span></label>
                    <input
                      type="url"
                      placeholder="https://your-project-link.com"
                      value={newBlog.liveLink}
                      onChange={e => setNewBlog({ ...newBlog, liveLink: e.target.value })}
                      className="w-full p-4 border-4 border-black font-bold text-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-xs cursor-pointer bg-white transition-all shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                      <input
                        type="checkbox"
                        checked={newBlog.isDraft}
                        onChange={e => setNewBlog({ ...newBlog, isDraft: e.target.checked })}
                        className="w-6 h-6 border-2 border-black accent-[#FF4B4B]"
                      />
                      Save as Draft (Hide from public)
                    </label>
                    <div className="flex flex-col">
                      <label className="font-black uppercase text-xs mb-1 block">🗓️ Publish Schedule <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="date"
                        value={newBlog.scheduledDate}
                        onChange={e => setNewBlog({ ...newBlog, scheduledDate: e.target.value })}
                        className="w-full p-4 border-4 border-black font-bold text-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      />
                    </div>
                  </div>

                  <div className={`p-4 bg-gray-50 border-4 border-black ${errors.sectionsJSON ? 'border-red-500' : ''}`}>
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                      <p className="text-xs font-black uppercase text-black">The Assembly Board</p>
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => smartInsert(TEMPLATES.heading, true)} className="bg-black text-white px-2 py-1 text-[9px] font-black border-2 border-black">+H1</button>
                        <button onClick={() => smartInsert(TEMPLATES.subheading, true)} className="bg-red-500 text-white px-2 py-1 text-[9px] font-black border-2 border-black">+H2</button>
                        <button onClick={() => smartInsert(TEMPLATES.paragraph, true)} className="bg-white text-black px-2 py-1 text-[9px] font-black border-2 border-black">+P</button>

                        {/* Image Uploader for Sections */}
                        <button onClick={() => smartInsert(TEMPLATES.image, true)} className="bg-[#e346d3] text-white px-2 py-1 text-[9px] font-black border-2 border-black">+URL</button>
                        <label className="bg-[#ff8c42] text-white px-2 py-1 text-[9px] font-black border-2 border-black cursor-pointer hover:bg-orange-400">
                          +GRID
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []) as File[];
                              if (files.length === 0) return;
                              if (files.length > 2) {
                                showFeedback("MAX 2 IMAGES FOR GRID! 🛑", "error");
                                return;
                              }

                              try {
                                const results = await Promise.all(
                                  files.map(f => resizeImage(f, 900, 700, 0.82))
                                );
                                const anyResized = results.some(r => r.resized);

                                const ts = Date.now();
                                const imgId1 = `IMG_${ts}_1`;
                                const imgId2 = results.length > 1 ? `IMG_${ts}_2` : '';

                                const newMap: { [key: string]: string } = { [imgId1]: results[0].dataUrl };
                                if (imgId2) newMap[imgId2] = results[1].dataUrl;

                                setImageMap(prev => ({ ...prev, ...newMap }));

                                if (results.length === 1) {
                                  smartInsert(`{\n  "type": "image",\n  "content": "{{${imgId1}}}",\n  "caption": "Uploaded Image"\n}`, true);
                                } else {
                                  smartInsert(`{\n  "type": "image-grid",\n  "content": "{{${imgId1}}}",\n  "content2": "{{${imgId2}}}",\n  "caption": "Uploaded Grid"\n}`, true);
                                }
                                if (anyResized) {
                                  showFeedback('Images uploaded & resized to fit! 🖼️✅');
                                } else {
                                  showFeedback('Images uploaded! 🖼️✅');
                                }
                              } catch {
                                showFeedback('Failed to process images! 🛑', 'error');
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button onClick={() => smartInsert(TEMPLATES.code, true)} className="bg-[#FFD600] text-black px-2 py-1 text-[9px] font-black border-2 border-black">+CODE</button>
                        <button onClick={() => smartInsert(TEMPLATES.note, true)} className="bg-[#6B4BFF] text-white px-2 py-1 text-[9px] font-black border-2 border-black">+NOTE</button>
                        <button onClick={() => smartInsert(TEMPLATES.link, true)} className="bg-[#10B981] text-white px-2 py-1 text-[9px] font-black border-2 border-black">+LINK</button>
                        <button onClick={clearEditor} className="bg-gray-400 text-white px-2 py-1 text-[9px] font-black border-2 border-black">WIPE</button>
                      </div>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={newBlog.sectionsJSON}
                      onChange={e => { setNewBlog({ ...newBlog, sectionsJSON: e.target.value }); setErrors({ ...errors, sectionsJSON: false }) }}
                      onBlur={(e) => {
                        // Save cursor position when textarea loses focus
                        lastCursorPositionRef.current = {
                          start: e.target.selectionStart,
                          end: e.target.selectionEnd
                        };
                      }}
                      className="w-full p-4 border-2 border-black font-mono text-sm h-72 text-black bg-white"
                    />
                  </div>

                  <button onClick={handleSaveBlog} className="cartoon-btn w-full bg-[#FFD600] text-black py-5 font-black uppercase text-2xl shadow-[10px_10px_0px_#000]">
                    {editingBlogId !== null ? '💾 UPDATE BLOG' : '🚀 BROADCAST TO LOGS'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4 text-black">Active Logs</h3>
              <div className="overflow-y-auto max-h-[800px] space-y-3 pr-2 custom-scrollbar">
                {blogs.map(blog => (
                  <div key={blog.id} className={`bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000] ${editingBlogId === blog.id ? 'ring-4 ring-yellow-400' : ''}`}>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-black uppercase text-sm text-black">{blog.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{blog.date}</div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="px-3 py-1 bg-[#00A1FF] text-white border-2 border-black font-black text-xs uppercase hover:bg-blue-400 shadow-[2px_2px_0px_#000] transition-all hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                          title="Edit blog"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="w-8 h-8 bg-red-500 text-white border-2 border-black font-black hover:bg-red-600 shadow-[2px_2px_0px_#000] transition-all hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                          title="Delete blog"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'achievements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-black">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black uppercase">
                    {editingAchId !== null ? '✏️ Edit Badge' : 'Badge Forge'}
                  </h2>
                  {editingAchId !== null && (
                    <button
                      onClick={handleCancelEditAch}
                      className="bg-gray-500 text-white px-4 py-2 font-black uppercase border-2 border-black hover:bg-gray-600"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Title..." value={newAch.title} onChange={e => setNewAch({ ...newAch, title: e.target.value })} className="w-full p-4 border-4 border-black font-bold" />
                  <input type="text" placeholder="Issuer..." value={newAch.issuer} onChange={e => setNewAch({ ...newAch, issuer: e.target.value })} className="w-full p-4 border-4 border-black font-bold" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="Year" value={newAch.date} onChange={e => setNewAch({ ...newAch, date: e.target.value })} className="p-4 border-4 border-black font-bold" />
                    <select value={newAch.icon} onChange={e => setNewAch({ ...newAch, icon: e.target.value })} className="p-4 border-4 border-black font-bold text-2xl">
                      <option value="🏆">🏆 Trophy</option>
                      <option value="🥇">🥇 1st Place</option>
                      <option value="🥈">🥈 2nd Place</option>
                      <option value="🥉">🥉 3rd Place</option>
                    </select>
                    <select value={newAch.color} onChange={e => setNewAch({ ...newAch, color: e.target.value })} className="p-4 border-4 border-black font-bold">
                      <option value="#FFD600">Yellow</option>
                      <option value="#00A1FF">Blue</option>
                      <option value="#FF4B4B">Red</option>
                    </select>
                  </div>
                  <button onClick={handleSaveAch} className="cartoon-btn w-full bg-[#6B4BFF] text-white py-4 font-black uppercase text-xl shadow-[8px_8px_0px_#000]">
                    {editingAchId !== null ? '💾 UPDATE BADGE' : 'FORGE BADGE'}
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4">Earned Badges</h3>
              <div className="overflow-y-auto max-h-[800px] space-y-3">
                {achievements.map((ach, index) => (
                  <div key={ach.id} className={`bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000] ${editingAchId === ach.id ? 'ring-4 ring-yellow-400' : ''}`}>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-3 font-black uppercase text-sm min-w-0 flex-1">
                        <span className="text-xl flex-shrink-0">{ach.icon}</span>
                        <div className="min-w-0">
                          <div className="truncate">{ach.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{ach.issuer} • {ach.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {/* Reorder buttons */}
                        <button
                          onClick={() => moveBadge(index, 'up')}
                          disabled={index === 0}
                          className={`w-7 h-7 border-2 border-black font-black text-xs ${index === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-black hover:bg-gray-300'} shadow-[2px_2px_0px_#000] transition-all`}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveBadge(index, 'down')}
                          disabled={index === achievements.length - 1}
                          className={`w-7 h-7 border-2 border-black font-black text-xs ${index === achievements.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-black hover:bg-gray-300'} shadow-[2px_2px_0px_#000] transition-all`}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditAch(ach)}
                          className="px-3 py-1 bg-[#00A1FF] text-white border-2 border-black font-black text-xs uppercase hover:bg-blue-400 shadow-[2px_2px_0px_#000] transition-all hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                          title="Edit badge"
                        >
                          EDIT
                        </button>
                        <button
                          aria-label="Delete badge"
                          onClick={() => handleDeleteAch(ach.id)}
                          className="w-8 h-8 bg-red-500 text-white border-2 border-black font-black hover:bg-red-600 shadow-[2px_2px_0px_#000] transition-all hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                          title="Delete badge"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======== PROJECTS TAB ======== */}
      {tab === 'projects' && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-black">
          {/* Form */}
          <div ref={projectFormRef} className="lg:col-span-2 space-y-8">
            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase">
                  {editingProjectId !== null ? '✏️ Edit Project' : '🚀 New Project'}
                </h2>
                {editingProjectId !== null && (
                  <button
                    onClick={() => { setEditingProjectId(null); setNewProject(getDefaultProjectState()); }}
                    className="bg-gray-500 text-white px-4 py-2 font-black uppercase border-2 border-black hover:bg-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Project Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Trivia Arena"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full p-4 border-4 border-black font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Description</label>
                  <textarea
                    placeholder="What does this project do?"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-4 border-4 border-black font-bold text-black h-24"
                  />
                </div>
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">🖼️ Thumbnail</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={newProject.image.startsWith('data:') ? '' : newProject.image}
                      onChange={e => setNewProject({ ...newProject, image: e.target.value })}
                      className="flex-1 p-4 border-4 border-black font-bold text-black"
                    />
                    <label className="flex items-center justify-center gap-1 bg-[#FF4B4B] text-white border-4 border-black px-4 font-black uppercase text-xs cursor-pointer shadow-[4px_4px_0px_#000] hover:bg-red-400 hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap">
                      📁 Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const { dataUrl, resized } = await resizeImage(file, 800, 600, 0.82);
                            setNewProject(prev => ({ ...prev, image: dataUrl }));
                            if (resized) {
                              showFeedback('Image uploaded & resized to fit! 🖼️✅');
                            } else {
                              showFeedback('Image uploaded! 🖼️✅');
                            }
                          } catch {
                            showFeedback('Failed to process image! 🛑', 'error');
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  {newProject.image && (
                    <div className="relative mt-2">
                      <img src={newProject.image} alt="preview" className="h-32 w-full object-cover border-4 border-black" />
                      <button
                        onClick={() => setNewProject(prev => ({ ...prev, image: '' }))}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white border-2 border-black font-black text-sm flex items-center justify-center hover:bg-red-600"
                      >×</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-black uppercase text-xs mb-1 block">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                  <input
                    type="text"
                    placeholder="React, Firebase, TailwindCSS"
                    value={newProject.tags}
                    onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                    className="w-full p-4 border-4 border-black font-bold text-black"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-black uppercase text-xs mb-1 block">🔗 Live Link</label>
                    <input
                      type="url"
                      placeholder="https://yourproject.com"
                      value={newProject.link}
                      onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                      className="w-full p-4 border-4 border-black font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="font-black uppercase text-xs mb-1 block">🐛 GitHub Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/user/repo"
                      value={newProject.githubLink}
                      onChange={e => setNewProject({ ...newProject, githubLink: e.target.value })}
                      className="w-full p-4 border-4 border-black font-bold text-black"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-black uppercase text-xs mb-1 block">🎨 Accent Color</label>
                    <div className="flex gap-2 p-3 border-4 border-black flex-wrap">
                      {['#FFD600','#00A1FF','#FF4B4B','#10B981','#6B4BFF','#FF6B6B','#8B5CF6','#F59E0B'].map(c => (
                        <div
                          key={c}
                          onClick={() => setNewProject({ ...newProject, color: c })}
                          className={`w-7 h-7 rounded-full border-2 border-black cursor-pointer hover:scale-125 transition-transform ${newProject.color === c ? 'ring-2 ring-black ring-offset-1 scale-125' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-4 border-4 border-black font-black uppercase text-xs cursor-pointer bg-white shadow-[4px_4px_0px_#000]">
                    <input
                      type="checkbox"
                      checked={newProject.disabled}
                      onChange={e => setNewProject({ ...newProject, disabled: e.target.checked })}
                      className="w-6 h-6 border-2 border-black accent-[#FF4B4B]"
                    />
                    Enterprise Only (hides live link)
                  </label>
                </div>
                <button
                  onClick={handleSaveProject}
                  className="cartoon-btn w-full bg-[#00A1FF] text-white py-5 font-black uppercase text-2xl shadow-[10px_10px_0px_#000]"
                >
                  {editingProjectId !== null ? '💾 UPDATE PROJECT' : '🚀 LAUNCH PROJECT'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar list */}
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4">Active Projects</h3>
            <div className="overflow-y-auto max-h-[800px] space-y-3 pr-2 custom-scrollbar">
              {projects.length === 0 && (
                <div className="bg-white border-4 border-black p-4 text-center font-bold text-gray-500">
                  No projects yet. Launch your first one!
                </div>
              )}
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000] ${
                    editingProjectId === project.id ? 'ring-4 ring-[#00A1FF]' : ''
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    {project.image && (
                      <img src={project.image} alt={project.title} className="w-16 h-12 object-cover border-2 border-black flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-black uppercase text-sm text-black">{project.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tags.slice(0, 3).map(t => (
                          <span key={t} className="bg-black text-white text-[9px] px-1.5 py-0.5 font-black uppercase">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveProject(projects.indexOf(project), 'up')}
                        disabled={projects.indexOf(project) === 0}
                        className={`w-7 h-7 border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] transition-all ${projects.indexOf(project) === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-black hover:bg-gray-300'}`}
                        title="Move up"
                      >↑</button>
                      <button
                        onClick={() => moveProject(projects.indexOf(project), 'down')}
                        disabled={projects.indexOf(project) === projects.length - 1}
                        className={`w-7 h-7 border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] transition-all ${projects.indexOf(project) === projects.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-black hover:bg-gray-300'}`}
                        title="Move down"
                      >↓</button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="px-3 py-1 bg-[#00A1FF] text-white border-2 border-black font-black text-xs uppercase hover:bg-blue-400 shadow-[2px_2px_0px_#000]"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="w-8 h-8 bg-red-500 text-white border-2 border-black font-black hover:bg-red-600 shadow-[2px_2px_0px_#000]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #eee; border: 2px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #eee; }
      `}</style>
    </div>
  );
};

export default Admin;
