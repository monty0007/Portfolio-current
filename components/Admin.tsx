import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPosts, createPost, deletePost, updatePost, BlogPost } from '../services/blogService';
import { getAchievements, addAchievement, deleteAchievement } from '../services/dataService'; // Keep achievements mock for now or move it too? Assuming user only asked about blog.
import { Achievement } from '../types';
import Toast from './Toast';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'blogs' | 'achievements'>('blogs');
  const [showManual, setShowManual] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [imageMap, setImageMap] = useState<{ [key: string]: string }>({});

  const TEMPLATES = {
    heading: '{ "type": "heading", "content": "BIG TITLE HERE" }',
    subheading: '{ "type": "subheading", "content": "Small section title..." }',
    paragraph: '{ "type": "paragraph", "content": "Once upon a time in the 22nd century..." }',
    image: '{ "type": "image", "content": "", "caption": "Add a caption" }',
    code: '{ "type": "code", "content": "console.log(\'Action Bastion!\');", "language": "javascript" }',
    note: '{ "type": "note", "content": "This is a secret gadget tip!" }'
  };

  // Helper to get today's date in YYYY-MM-DD format for date input
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getDefaultBlogState = () => ({
    title: '',
    category: 'Engineering',
    excerpt: '',
    sectionsJSON: '[\n  ' + TEMPLATES.heading + ',\n  ' + TEMPLATES.paragraph + '\n]',
    color: '#FF4B4B',
    image: '',
    date: getTodayDate()
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
  }, []);

  const refreshData = async () => {
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

  const smartInsert = (template: string) => {
    const current = newBlog.sectionsJSON.trim();
    let updated = '';

    if (current === '' || current === '[]' || current === '[ ]') {
      updated = '[\n  ' + template + '\n]';
    } else if (current.endsWith(']')) {
      const base = current.substring(0, current.lastIndexOf(']')).trim();
      const needsComma = base.length > 1 && !base.endsWith(',');
      updated = base + (needsComma ? ',\n  ' : '\n  ') + template + '\n]';
    } else {
      updated = '[\n  ' + template + '\n]';
    }

    setNewBlog({ ...newBlog, sectionsJSON: updated });
    setErrors({ ...errors, sectionsJSON: false });
  };

  const clearEditor = () => {
    setShowWipeModal(true);
  };

  const confirmWipe = () => {
    setNewBlog({ ...newBlog, sectionsJSON: '[\n  \n]' });
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
      let parsedSections = JSON.parse(newBlog.sectionsJSON);

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
        author: 'Manish Yadav'
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

    setNewBlog({
      title: blog.title,
      category: blog.category || 'Engineering',
      excerpt: blog.excerpt,
      sectionsJSON: JSON.stringify(blog.sections || [], null, 2),
      color: blog.color || '#FF4B4B',
      image: blog.image || '',
      date: dateValue
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
    const ach: Achievement = { ...newAch, id: Date.now().toString() };
    setAchievements(addAchievement(ach));
    setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
    showFeedback("NEW BADGE FORGED! 🏆✨");
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

  const BlueprintManual = () => (
    <div className="bg-[#003366] border-4 border-black p-6 shadow-[10px_10px_0px_#00A1FF] text-white relative mb-8">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter decoration-yellow-400 underline">SECRET_MANUAL.pdf</h3>
          <button onClick={() => setShowManual(false)} className="bg-red-500 text-white px-3 py-1 border-2 border-black font-black">CLOSE</button>
        </div>
        <div className="space-y-4 font-mono text-xs max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(TEMPLATES).map(([name, code]) => (
            <div key={name} className="bg-black/40 p-3 border border-white/20 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="text-yellow-400 font-black uppercase">{name} part</p>
                <button
                  onClick={() => handleCopyTemplate(code)}
                  className="bg-white text-black px-3 py-1 text-[10px] font-black uppercase hover:bg-yellow-400 border-2 border-black"
                >
                  COPY
                </button>
              </div>
              <pre className="whitespace-pre-wrap opacity-70">{code}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F0F0] pt-32 pb-20 px-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showWipeModal && <WipeConfirmationModal />}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-500 border-4 border-black rounded-full flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000]">🧪</div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black">Admin <span className="text-red-500">Suite</span></h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setTab('blogs')} className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'blogs' ? 'bg-[#FF4B4B] text-white' : 'bg-white text-black'}`}>Blogs</button>
            <button onClick={() => setTab('achievements')} className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'achievements' ? 'bg-[#FFD600] text-black' : 'bg-white text-black'}`}>Badges</button>
            <button onClick={onBack} className="cartoon-btn bg-black text-white px-6 py-2 font-black uppercase">Exit</button>
          </div>
        </div>

        {tab === 'blogs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {!showManual ? (
                <button onClick={() => setShowManual(true)} className="w-full bg-[#00A1FF] text-white py-4 font-black uppercase border-4 border-black shadow-[6px_6px_0px_#000] hover:scale-105 transition-transform">📖 READ THE SECRET MANUAL</button>
              ) : (
                <BlueprintManual />
              )}

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
                    <select value={newBlog.color} onChange={e => setNewBlog({ ...newBlog, color: e.target.value })} className="p-4 border-4 border-black font-bold text-black">
                      <option value="#FF4B4B">Red Alert</option>
                      <option value="#00A1FF">Sonic Blue</option>
                      <option value="#FFD600">Golden Yellow</option>
                    </select>
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

                  <div className={`p-4 bg-gray-50 border-4 border-black ${errors.sectionsJSON ? 'border-red-500' : ''}`}>
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                      <p className="text-xs font-black uppercase text-black">The Assembly Board</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => smartInsert(TEMPLATES.heading)} className="bg-black text-white px-3 py-1 text-[10px] font-black border-2 border-black">+ HEADING</button>
                        <button onClick={() => smartInsert(TEMPLATES.subheading)} className="bg-red-500 text-white px-3 py-1 text-[10px] font-black border-2 border-black">+ SUB-H</button>
                        <button onClick={() => smartInsert(TEMPLATES.paragraph)} className="bg-white text-black px-3 py-1 text-[10px] font-black border-2 border-black">+ PARA</button>

                        {/* Image Uploader for Sections */}
                        <label className="bg-[#00A1FF] text-white px-3 py-1 text-[10px] font-black border-2 border-black cursor-pointer hover:bg-blue-400">
                          + IMG FILE
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 800 * 1024) {
                                showFeedback("FILE TOO BIG! Max 800KB! 🛑", "error");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  const imgId = `IMG_${Date.now()}`;
                                  setImageMap(prev => ({ ...prev, [imgId]: reader.result as string }));
                                  smartInsert(`{ "type": "image", "content": "{{${imgId}}}", "caption": "Uploaded Image" }`);
                                }
                              };
                              reader.readAsDataURL(file);
                              // Reset value so same file can be selected again
                              e.target.value = '';
                            }}
                          />
                        </label>

                        <button onClick={() => smartInsert(TEMPLATES.image)} className="bg-[#e346d3] text-white px-3 py-1 text-[10px] font-black border-2 border-black ">+ IMG URL</button>
                        <button onClick={() => smartInsert(TEMPLATES.code)} className="bg-[#FFD600] text-black px-3 py-1 text-[10px] font-black border-2 border-black">+ CODE</button>
                        <button onClick={clearEditor} className="bg-gray-400 text-white px-3 py-1 text-[10px] font-black border-2 border-black">WIPE</button>
                      </div>
                    </div>
                    <textarea
                      value={newBlog.sectionsJSON}
                      onChange={e => { setNewBlog({ ...newBlog, sectionsJSON: e.target.value }); setErrors({ ...errors, sectionsJSON: false }) }}
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-black">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <h2 className="text-2xl font-black uppercase mb-6">Badge Forge</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Title..." value={newAch.title} onChange={e => setNewAch({ ...newAch, title: e.target.value })} className="w-full p-4 border-4 border-black font-bold" />
                  <input type="text" placeholder="Issuer..." value={newAch.issuer} onChange={e => setNewAch({ ...newAch, issuer: e.target.value })} className="w-full p-4 border-4 border-black font-bold" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="Year" value={newAch.date} onChange={e => setNewAch({ ...newAch, date: e.target.value })} className="p-4 border-4 border-black font-bold" />
                    <input type="text" placeholder="Emoji" value={newAch.icon} onChange={e => setNewAch({ ...newAch, icon: e.target.value })} className="p-4 border-4 border-black font-bold" />
                    <select value={newAch.color} onChange={e => setNewAch({ ...newAch, color: e.target.value })} className="p-4 border-4 border-black font-bold">
                      <option value="#FFD600">Yellow</option>
                      <option value="#00A1FF">Blue</option>
                      <option value="#FF4B4B">Red</option>
                    </select>
                  </div>
                  <button onClick={handleSaveAch} className="cartoon-btn w-full bg-[#6B4BFF] text-white py-4 font-black uppercase text-xl shadow-[8px_8px_0px_#000]">FORGE BADGE</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4">Earned Badges</h3>
              <div className="overflow-y-auto max-h-[800px] space-y-3">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-white border-4 border-black p-4 flex justify-between items-center gap-4 shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center gap-3 font-black uppercase text-sm min-w-0 flex-1">
                      <span className="text-xl flex-shrink-0">{ach.icon}</span>
                      <span className="truncate">{ach.title}</span>
                    </div>
                    <button
                      aria-label="Delete badge"
                      onClick={() => setAchievements(deleteAchievement(ach.id))}
                      className="w-10 h-10 bg-red-500 text-white border-2 border-black font-black text-lg flex-shrink-0 hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #eee; border: 2px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #eee; }
      `}</style>
    </div>
  );
};

export default Admin;
