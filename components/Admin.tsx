
import React, { useState, useEffect } from 'react';
import { getBlogs, addBlog, deleteBlog, getAchievements, addAchievement, deleteAchievement } from '../services/dataService';
import { BlogPost, Achievement } from '../types';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'blogs' | 'achievements'>('blogs');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Blog Form State
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Engineering',
    excerpt: '',
    content: '',
    color: '#FF4B4B'
  });

  // Achievement Form State
  const [newAch, setNewAch] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    icon: '🏆',
    color: '#FFD600'
  });

  useEffect(() => {
    setBlogs(getBlogs());
    setAchievements(getAchievements());
  }, []);

  const handleSaveBlog = () => {
    if (!newBlog.title || !newBlog.content) return alert("Fill everything, Action Bastion!");
    const blog: BlogPost = {
      ...newBlog,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBlogs(addBlog(blog));
    setNewBlog({ title: '', category: 'Engineering', excerpt: '', content: '', color: '#FF4B4B' });
  };

  const handleSaveAch = () => {
    if (!newAch.title || !newAch.issuer) return alert(" Milestones need data!");
    const ach: Achievement = {
      ...newAch,
      id: Date.now().toString()
    };
    setAchievements(addAchievement(ach));
    setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Command <span className="text-red-500">Center</span></h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setTab('blogs')}
              className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'blogs' ? 'bg-[#FF4B4B] text-white' : 'bg-white'}`}
            >
              Logs
            </button>
            <button 
              onClick={() => setTab('achievements')}
              className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'achievements' ? 'bg-[#FFD600] text-black' : 'bg-white'}`}
            >
              Badges
            </button>
            <button onClick={onBack} className="cartoon-btn bg-black text-white px-6 py-2 font-black uppercase">Exit</button>
          </div>
        </div>

        {tab === 'blogs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <h2 className="text-2xl font-black uppercase mb-6">New Blog Entry</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Blog Title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-4 border-2 border-black font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="p-4 border-2 border-black font-bold" />
                    <select value={newBlog.color} onChange={e => setNewBlog({...newBlog, color: e.target.value})} className="p-4 border-2 border-black font-bold">
                      <option value="#FF4B4B">Red</option><option value="#00A1FF">Blue</option><option value="#FFD600">Yellow</option>
                    </select>
                  </div>
                  <textarea placeholder="Excerpt" value={newBlog.excerpt} onChange={e => setNewBlog({...newBlog, excerpt: e.target.value})} className="w-full p-4 border-2 border-black font-bold h-24" />
                  <textarea placeholder="Full Content" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full p-4 border-2 border-black font-bold h-64" />
                  <button onClick={handleSaveBlog} className="cartoon-btn w-full bg-[#FFD600] text-black py-4 font-black uppercase">Publish Log</button>
                </div>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[800px]">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white border-4 border-black p-4 flex justify-between items-center">
                  <div className="truncate font-black uppercase text-sm">{blog.title}</div>
                  <button onClick={() => setBlogs(deleteBlog(blog.id))} className="w-8 h-8 bg-red-100 text-red-600 border-2 border-black">×</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <h2 className="text-2xl font-black uppercase mb-6">Forge New Badge</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Achievement Title" value={newAch.title} onChange={e => setNewAch({...newAch, title: e.target.value})} className="w-full p-4 border-2 border-black font-bold" />
                  <input type="text" placeholder="Issuer (e.g. Google Cloud)" value={newAch.issuer} onChange={e => setNewAch({...newAch, issuer: e.target.value})} className="w-full p-4 border-2 border-black font-bold" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="Year" value={newAch.date} onChange={e => setNewAch({...newAch, date: e.target.value})} className="p-4 border-2 border-black font-bold" />
                    <input type="text" placeholder="Icon (Emoji)" value={newAch.icon} onChange={e => setNewAch({...newAch, icon: e.target.value})} className="p-4 border-2 border-black font-bold" />
                    <select value={newAch.color} onChange={e => setNewAch({...newAch, color: e.target.value})} className="p-4 border-2 border-black font-bold">
                      <option value="#FFD600">Yellow</option><option value="#00A1FF">Blue</option><option value="#FF4B4B">Red</option><option value="#6B4BFF">Purple</option>
                    </select>
                  </div>
                  <button onClick={handleSaveAch} className="cartoon-btn w-full bg-[#6B4BFF] text-white py-4 font-black uppercase">Create Badge</button>
                </div>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[800px]">
              {achievements.map(ach => (
                <div key={ach.id} className="bg-white border-4 border-black p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3 font-black uppercase text-sm">
                    <span>{ach.icon}</span>
                    <span className="truncate max-w-[150px]">{ach.title}</span>
                  </div>
                  <button onClick={() => setAchievements(deleteAchievement(ach.id))} className="w-8 h-8 bg-red-100 text-red-600 border-2 border-black">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
