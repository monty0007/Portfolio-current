
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getPosts, getPostBySlug, BlogPost } from '../services/blogService';
import { BlogSection } from '../types';

const SectionRenderer: React.FC<{ section: BlogSection }> = ({ section }) => {
  switch (section.type) {
    case 'heading':
      return <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-12 mb-6 text-black leading-none">{section.content}</h2>;

    case 'subheading':
      return <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mt-10 mb-4 text-[#FF4B4B]">{section.content}</h3>;

    case 'paragraph':
    case 'text':
    case 'markdown':
      return <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-8">{section.content}</p>;

    case 'image':
      return (
        <div className="my-12">
          <div className="border-[6px] border-black shadow-[15px_15px_0px_#00A1FF] overflow-hidden bg-white rotate-1">
            <img src={section.content} alt={section.caption} className="w-full h-auto object-cover" />
          </div>
          {section.caption && (
            <div className="mt-4 bg-black text-white px-4 py-2 inline-block font-black uppercase text-sm -rotate-1">
              FIG: {section.caption}
            </div>
          )}
        </div>
      );

    case 'code':
      return (
        <div className="my-10 bg-[#1A1A1A] border-4 border-black rounded-xl overflow-hidden shadow-[10px_10px_0px_#000] relative">
          <div className="bg-white border-b-4 border-black px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{section.language || 'Terminal'}</span>
          </div>
          <pre className="p-6 overflow-x-auto">
            <code className="text-[#00FF41] font-mono text-lg">{section.content}</code>
          </pre>
        </div>
      );

    case 'note':
      return (
        <div className="my-10 bg-[#FFD600] border-4 border-black p-8 shadow-[10px_10px_0px_#000] -rotate-1 relative group hover:rotate-0 transition-transform">
          <div className="absolute -top-6 -left-6 text-5xl group-hover:scale-125 transition-transform">📌</div>
          <h4 className="font-black uppercase text-xl mb-2 underline decoration-4 text-black">Gadget Insight:</h4>
          <p className="font-bold text-xl italic text-black">{section.content}</p>
        </div>
      );

    default:
      return null;
  }
};

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>(); // Get slug from URL
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Reset view when receiving reset signal from Navbar
  useEffect(() => {
    if (location.state?.reset) {
      navigate('/blog', { replace: true });
      window.scrollTo(0, 0);
    }
  }, [location.state, navigate]);

  // Initial load
  useEffect(() => {
    const fetchBlogs = async () => {
      const posts = await getPosts();
      setBlogs(posts);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  // Sync slug with selectedPost
  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        // Check if we already have it in list to avoid extra request
        const existing = blogs.find(b => b.slug === slug);
        if (existing) {
          setSelectedPost(existing);
        } else {
          // Fallback to fetch individual if not in list (deep link)
          const post = await getPostBySlug(slug);
          setSelectedPost(post);
        }
        window.scrollTo(0, 0);
      } else {
        setSelectedPost(null);
      }
    };
    if (!loading) loadPost();
  }, [slug, blogs, loading]);

  const filteredBlogs = blogs.filter(b => {
    const searchLower = searchTerm.toLowerCase();
    return (
      b.title.toLowerCase().includes(searchLower) ||
      (b as any).category?.toLowerCase().includes(searchLower) ||
      b.excerpt.toLowerCase().includes(searchLower) ||
      (b.tags && b.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white pt-48 pb-20 px-6 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/blog')}
            className="cartoon-btn bg-black text-white px-6 py-3 font-black mb-12 uppercase text-xl"
          >
            ← BACK TO LOGS
          </button>

          <div className="mb-16">
            <span className="px-6 py-2 bg-[#FF4B4B] text-white border-4 border-black font-black uppercase text-lg shadow-[6px_6px_0px_#000] inline-block -rotate-2">
              {(selectedPost as any).category || 'Blog'}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase mt-8 leading-[0.85] tracking-tighter text-black">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 bg-[#FFD600] border-4 border-black rounded-full flex items-center justify-center font-black">MY</div>
              <p className="text-gray-500 font-black uppercase text-sm tracking-widest">{selectedPost.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            {selectedPost.sections && selectedPost.sections.length > 0 ? (
              selectedPost.sections.map((section, idx) => (
                <SectionRenderer key={idx} section={section} />
              ))
            ) : (
              <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-8">{selectedPost.content}</p>
            )}

            <div className="pt-20 mt-20 border-t-8 border-black text-center">
              <div className="text-8xl mb-4">🏮</div>
              <p className="font-black uppercase text-2xl tracking-tighter italic text-black">
                Transmission Terminated.
              </p>
              <button
                onClick={() => {
                  navigate('/blog');
                  window.scrollTo(0, 0);
                }}
                className="mt-8 cartoon-btn bg-[#FFD600] text-black px-12 py-4 font-black uppercase text-2xl"
              >
                RETURN TO LAB
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] pt-48 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <header>
            <button
              onClick={() => navigate('/')}
              className="cartoon-btn bg-white text-black px-6 py-2 font-black mb-8 uppercase"
            >
              ← Back to Lab
            </button>
            <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-none text-black">
              GOSSIP <br /> <span className="text-[#FF4B4B]" style={{ WebkitTextStroke: '2px black' }}>LOGS</span>
            </h1>
          </header>

          <div className="w-full md:w-96">
            <label className="block font-black uppercase text-xs mb-2 text-black">Search Gadgets & Intel</label>
            <input
              type="text"
              placeholder="Filter by title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_#000] focus:outline-none focus:shadow-none transition-all font-bold text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            // Loading Skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] p-8 h-64 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredBlogs.length > 0 ? filteredBlogs.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col hover:-translate-y-2 hover:shadow-[15px_15px_0px_#000] transition-all duration-200 ease-out cursor-pointer group h-full"
            >
              <div
                className="w-full h-12 mb-6 border-b-4 border-black font-black uppercase flex items-center justify-between"
                style={{ color: (post as any).color || '#000' }}
              >
                <span>{(post as any).category || 'Blog'}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight group-hover:text-[#FF4B4B] transition-colors duration-200 text-black">
                {post.title}
              </h3>
              <p className="text-gray-700 font-bold mb-8 flex-1">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-black text-xs uppercase underline decoration-2 text-black">Read Decrypted File</span>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black group-hover:bg-[#FF4B4B] transition-colors duration-200">→</div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-40 text-center border-8 border-dashed border-black/10">
              <div className="text-8xl mb-4 grayscale opacity-20">📂</div>
              <h3 className="text-4xl font-black uppercase opacity-20 text-black">Log file not found!</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
