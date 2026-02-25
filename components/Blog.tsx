
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getPosts, getPostBySlug, BlogPost } from '../services/blogService';
import { BlogSection } from '../types';

const SectionRenderer: React.FC<{ section: BlogSection }> = ({ section }) => {
  switch (section.type) {
    case 'heading':
      return <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-10 mb-4 text-black leading-tight">{section.content}</h2>;

    case 'subheading':
      return <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mt-8 mb-3 text-[#FF4B4B]">{section.content}</h3>;

    case 'paragraph':
    case 'text':
    case 'markdown':
      return <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">{section.content}</p>;

    case 'image':
      return (
        <div className="my-8">
          <div className="border-4 border-black shadow-[8px_8px_0px_#00A1FF] overflow-hidden bg-white">
            <img src={section.content} alt={section.caption} className="w-full h-auto object-cover" />
          </div>
          {section.caption && (
            <div className="mt-3 bg-black text-white px-3 py-1.5 inline-block font-bold uppercase text-xs">
              FIG: {section.caption}
            </div>
          )}
        </div>
      );

    case 'code':
      return (
        <div className="my-8 bg-[#1A1A1A] border-3 border-black rounded-lg overflow-hidden shadow-[6px_6px_0px_#000] relative">
          <div className="bg-white border-b-3 border-black px-3 py-1.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></div>
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-black"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <span className="font-bold text-[10px] uppercase tracking-wider">{section.language || 'Terminal'}</span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-[#00FF41] font-mono text-sm">{section.content}</code>
          </pre>
        </div>
      );

    case 'note':
      return (
        <div className="my-8 bg-[#FFD600] border-3 border-black p-5 shadow-[6px_6px_0px_#000] relative group hover:shadow-[8px_8px_0px_#000] transition-all">
          <div className="absolute -top-4 -left-4 text-3xl">📌</div>
          <h4 className="font-bold uppercase text-sm mb-2 underline decoration-2 text-black">Pro Tip:</h4>
          <p className="font-medium text-base text-black">{section.content}</p>
        </div>
      );

    case 'link':
      return (
        <div className="my-8 bg-[#10B981] border-3 border-black p-5 shadow-[6px_6px_0px_#000] relative group hover:shadow-[8px_8px_0px_#000] transition-all">
          <div className="absolute -top-4 -left-4 text-3xl">🔗</div>
          <h4 className="font-bold uppercase text-sm mb-2 text-white">External Link: <span className="font-black normal-case">{section.content}</span></h4>
          <a
            href={section.content}
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-lg text-white hover:text-black transition-colors flex items-center gap-2 underline decoration-2"
          >
            {section.caption || 'Visit Link'}
            <span className="text-xl">→</span>
          </a>
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

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBlogs = blogs.filter(b => {
    // Hide drafts from public view
    if (b.isDraft) return false;

    // Hide posts scheduled for the future
    if (b.scheduledDate && b.scheduledDate > todayStr) return false;

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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-16 px-4 sm:px-6 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="cartoon-btn bg-black text-white px-4 py-2 font-bold mb-8 uppercase text-sm hover:bg-gray-800 transition-colors"
          >
            ← Back to Blogs
          </button>

          {/* Header Section */}
          <header className="mb-10">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-[#FF4B4B] text-white border-3 border-black font-bold uppercase text-xs shadow-[4px_4px_0px_#000] inline-block">
                {(selectedPost as any).category || 'Blog'}
              </span>

              {selectedPost.liveLink && (
                <a
                  href={selectedPost.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cartoon-btn bg-[#00A1FF] text-white px-4 py-1.5 font-bold uppercase text-xs hover:bg-blue-400 transition-colors flex items-center gap-2 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] border-3 border-black"
                >
                  🔗 LIVE LINK
                </a>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mt-5 leading-tight tracking-tight text-black">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 bg-[#FFD600] border-3 border-black rounded-full flex items-center justify-center font-bold text-xs">MY</div>
              <div className="flex flex-col">
                <span className="text-gray-800 font-bold text-sm">Manish Yadav</span>
                <span className="text-gray-500 text-xs">{selectedPost.date}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <article className="space-y-2">
            {selectedPost.sections && selectedPost.sections.length > 0 ? (
              selectedPost.sections.map((section, idx) => (
                <SectionRenderer key={idx} section={section} />
              ))
            ) : (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">{selectedPost.content}</p>
            )}
          </article>

          {/* Footer */}
          <footer className="pt-12 mt-12 border-t-4 border-black text-center">
            <div className="text-5xl mb-3">🏮</div>
            <p className="font-bold uppercase text-lg tracking-tight text-gray-600">
              End of Article
            </p>
            <button
              onClick={() => {
                navigate('/blog');
                window.scrollTo(0, 0);
              }}
              className="mt-6 cartoon-btn bg-[#FFD600] text-black px-8 py-3 font-bold uppercase text-sm hover:shadow-[6px_6px_0px_#000] transition-all"
            >
              ← Browse More Articles
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] pt-48 pb-20 px-6 relative overflow-hidden">
      {/* Decorative cross pattern background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute inset-0 pointer-events-none">
        {/* Scattered plus signs */}
        <div className="absolute top-20 left-[10%] text-6xl text-black/5 font-black select-none">+</div>
        <div className="absolute top-40 right-[15%] text-8xl text-black/5 font-black select-none rotate-12">+</div>
        <div className="absolute top-[60%] left-[5%] text-7xl text-black/5 font-black select-none -rotate-6">+</div>
        <div className="absolute top-[30%] right-[8%] text-5xl text-black/5 font-black select-none rotate-45">+</div>
        <div className="absolute bottom-40 left-[20%] text-9xl text-black/5 font-black select-none">+</div>
        <div className="absolute bottom-20 right-[25%] text-6xl text-black/5 font-black select-none -rotate-12">+</div>
        <div className="absolute top-[45%] left-[50%] text-8xl text-black/5 font-black select-none rotate-6">+</div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
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
            <a
              key={post.id}
              href={`/blog/${post.slug || post.id}`}
              onClick={(e) => {
                // Allow middle-click and ctrl/cmd+click to work naturally
                if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  navigate(`/blog/${post.slug || post.id}`);
                }
              }}
              // Applying dynamic CSS variables to the group so child elements can inherit them
              style={{ '--post-color': (post as any).color || '#FF4B4B' } as React.CSSProperties}
              className="blog-card-group bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col hover:-translate-y-2 hover:shadow-[15px_15px_0px_#000] transition-all duration-200 ease-out cursor-pointer group h-full no-underline"
            >
              <div
                className="w-full h-12 mb-6 border-b-4 border-black font-black uppercase flex items-center justify-between"
                style={{ color: (post as any).color || '#000' }}
              >
                <span>{(post as any).category || 'Blog'}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3
                className="text-3xl font-black uppercase mb-4 leading-tight transition-colors duration-200 text-black group-hover:text-[var(--post-color)]"
              >
                {post.title}
              </h3>
              <p className="text-gray-700 font-bold mb-8 flex-1">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-black text-xs uppercase underline decoration-2 text-black">Read Decrypted File</span>
                <div
                  className="w-10 h-10 bg-black text-white flex items-center justify-center font-black transition-colors duration-200 group-hover:bg-[var(--post-color)]"
                >→</div>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-40 text-center border-8 border-dashed border-black/10">
              <div className="text-8xl mb-4 grayscale opacity-20">📂</div>
              <h3 className="text-4xl font-black uppercase opacity-20 text-black">Log file not found!</h3>
            </div>
          )}
        </div>
      </div >
    </div >
  );
};

export default Blog;
