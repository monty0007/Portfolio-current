
import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/dataService';
import { BlogPost } from '../types';

const Blog: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setBlogs(getBlogs());
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-6 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedPost(null)}
            className="cartoon-btn bg-black text-white px-6 py-2 font-black mb-12 uppercase"
          >
            ← Back to Logs
          </button>
          
          <div className="mb-12">
            <span className="px-4 py-1 bg-yellow-400 border-2 border-black font-black uppercase text-sm">
              {selectedPost.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase mt-6 leading-none">
              {selectedPost.title}
            </h1>
            <p className="text-gray-500 font-bold mt-4">{selectedPost.date}</p>
          </div>

          <div className="prose prose-2xl max-w-none font-medium text-gray-800 leading-relaxed space-y-8">
            {selectedPost.content ? (
              selectedPost.content.split('\n').map((para, i) => (
                <p key={i} className="mb-6">{para}</p>
              ))
            ) : (
              <p>{selectedPost.excerpt}</p>
            )}
            <p className="pt-12 border-t-4 border-black text-center font-black italic">
              -- END OF LOG ENTRY --
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <header>
            <button 
              onClick={onBack}
              className="cartoon-btn bg-white text-black px-6 py-2 font-black mb-8 uppercase"
            >
              ← Back to Lab
            </button>
            <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-none">
              GOSSIP <br /> <span className="text-[#FF4B4B]" style={{ WebkitTextStroke: '2px black' }}>LOGS</span>
            </h1>
          </header>
          
          <div className="w-full md:w-96">
            <label className="block font-black uppercase text-xs mb-2">Search Gadgets & Intel</label>
            <input 
              type="text" 
              placeholder="Filter by title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_#000] focus:outline-none focus:shadow-none transition-all font-bold"
            />
          </div>
        </div>

        {/* Space on page */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBlogs.length > 0 ? filteredBlogs.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col hover:-translate-y-2 hover:shadow-[15px_15px_0px_#000] transition-all cursor-pointer group"
            >
              <div 
                className="w-full h-12 mb-6 border-b-4 border-black font-black uppercase flex items-center justify-between"
                style={{ color: post.color }}
              >
                <span>{post.category}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight group-hover:text-[#FF4B4B] transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-700 font-bold mb-8 flex-1">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-black text-xs uppercase underline decoration-2">Read Decrypted File</span>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">→</div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-40 text-center border-8 border-dashed border-black/10">
              <div className="text-8xl mb-4 grayscale opacity-20">📂</div>
              <h3 className="text-4xl font-black uppercase opacity-20">Log file not found!</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
