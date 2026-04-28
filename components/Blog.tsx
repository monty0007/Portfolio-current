
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
          <div className="border-4 border-black shadow-[8px_8px_0px_#00A1FF] overflow-hidden bg-white flex justify-center">
            <img src={section.content} alt={section.caption} className="w-full h-auto max-h-[500px] object-contain" />
          </div>
          {section.caption && (
            <div className="mt-3 bg-black text-white px-3 py-1.5 inline-block font-bold uppercase text-xs">
              FIG: {section.caption}
            </div>
          )}
        </div>
      );

    case 'image-grid':
      return (
        <div className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-4 border-black shadow-[6px_6px_0px_#FFD600] overflow-hidden bg-white flex justify-center h-full">
              <img src={section.content} alt={section.caption || 'Image 1'} className="w-full h-auto max-h-[500px] object-contain" />
            </div>
            {section.content2 && (
              <div className="border-4 border-black shadow-[6px_6px_0px_#FFD600] overflow-hidden bg-white flex justify-center h-full">
                <img src={section.content2} alt={section.caption || 'Image 2'} className="w-full h-auto max-h-[500px] object-contain" />
              </div>
            )}
          </div>
          {section.caption && (
            <div className="mt-4 bg-black text-white px-3 py-1.5 inline-block font-bold uppercase text-xs">
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
  const { slug } = useParams<{ slug: string }>();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
    window.addEventListener('portfolioThemeChange', handler);
    return () => window.removeEventListener('portfolioThemeChange', handler);
  }, []);

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

  // Sync slug with selectedPost — always fetch full post (sections not loaded in list)
  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        const post = await getPostBySlug(slug);
        setSelectedPost(post);
        window.scrollTo(0, 0);
      } else {
        setSelectedPost(null);
      }
    };
    if (!loading) loadPost();
  }, [slug, loading]);

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
    const postWordCount = (selectedPost.excerpt || '').split(' ').length +
      (selectedPost.sections?.reduce((acc: number, s: any) => acc + (s.content?.split(' ')?.length || 0), 0) || 0);
    const postReadMins = Math.max(1, Math.ceil(postWordCount / 200));

    return (
      <div className="min-h-screen bg-[#F0F0F0] animate-in slide-in-from-bottom duration-500">
        {/* Dark header band */}
        <div className={`${isDark ? 'bg-black border-b-4 border-[#FFD600]' : 'bg-[#FFF9E6] border-b-4 border-black'} pt-36 pb-12 px-4 sm:px-6 relative overflow-hidden`}>
          <div className={`absolute -right-10 -top-8 text-[20vw] font-black ${isDark ? 'text-white/[0.03]' : 'text-black/[0.03]'} select-none pointer-events-none uppercase leading-none`}>POST</div>
          <div className="max-w-4xl mx-auto relative z-10">
            <button
              onClick={() => navigate('/blog')}
              className={`flex items-center gap-2 ${isDark ? 'text-white/50 hover:text-[#FFD600]' : 'text-black/50 hover:text-[#FF4B4B]'} font-black uppercase text-xs tracking-widest mb-6 transition-colors group`}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> All Posts
            </button>
            <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-[#FF4B4B] text-white border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_rgba(255,75,75,0.3)] inline-block">
                  {(selectedPost as any).category || 'Blog'}
                </span>
                <span className="flex items-center gap-1.5 text-white/40 font-black text-xs uppercase tracking-widest border border-white/20 px-2.5 py-1">
                  <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 9.5h-1.5v-5h1.5v5zm0-6.5h-1.5V2.5h1.5V4z"/></svg>
                  {postReadMins} min read
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedPost.liveLink && (
                  <a
                    href={selectedPost.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cartoon-btn bg-[#00A1FF] text-white px-4 py-1.5 font-bold uppercase text-xs flex items-center gap-2 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] border-[3px] border-black"
                  >
                    🔗 LIVE LINK
                  </a>
                )}
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                  title="Copy link"
                  className="bg-white/10 text-white px-3 py-1.5 font-black uppercase text-xs border-[3px] border-white/20 hover:bg-white/20 transition-colors"
                >
                  Share 🔗
                </button>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter text-white">
              {selectedPost.title}
            </h1>
            {selectedPost.excerpt && (
              <p className="mt-4 text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                {selectedPost.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD600] border-2 border-black flex items-center justify-center font-bold text-sm text-black shadow-[3px_3px_0px_rgba(255,214,0,0.4)]">MY</div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Manish Yadav</span>
                  <span className="text-white/50 text-xs">{selectedPost.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
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
          <footer className="pt-12 mt-12 border-t-4 border-black">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="text-4xl mb-2">🏮</div>
                <p className="font-bold uppercase text-sm tracking-tight text-gray-500">
                  End of Article
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                  className="cartoon-btn bg-white text-black px-5 py-2.5 font-bold uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  Copy Link 🔗
                </button>
                <button
                  onClick={() => {
                    navigate('/blog');
                    window.scrollTo(0, 0);
                  }}
                  className="cartoon-btn bg-[#FFD600] text-black px-5 py-2.5 font-bold uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  ← Browse More
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Dark Admin-style banner header */}
      <div className={`${isDark ? 'bg-black border-b-4 border-[#FF4B4B]' : 'bg-[#FFF9E6] border-b-4 border-black'} pt-36 pb-12 px-6 relative overflow-hidden`}>
        <div className={`absolute -right-10 -top-8 text-[20vw] font-black ${isDark ? 'text-white/[0.03]' : 'text-black/[0.03]'} select-none pointer-events-none uppercase leading-none`}>LOGS</div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div>
            <p className={`${isDark ? 'text-[#FF4B4B]/60' : 'text-[#FF4B4B]'} font-black text-[10px] uppercase tracking-[0.3em] mb-1`}>Writing &amp; Devlogs</p>
            <h1 className={`text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
              GOSSIP <span className="text-[#FF4B4B]">LOGS</span>
            </h1>
            {!loading && (
              <p className={`mt-3 ${isDark ? 'text-white/40' : 'text-black/40'} font-black uppercase text-xs tracking-widest`}>
                {filteredBlogs.length} post{filteredBlogs.length !== 1 ? 's' : ''} {searchTerm ? 'found' : 'published'}
              </p>
            )}
          </div>
          <div className="w-full md:w-80 flex-shrink-0">
            <label className="block font-black uppercase text-[10px] mb-1.5 text-white/50">Filter Posts</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, tag, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 border-4 border-black focus:outline-none focus:border-[#FF4B4B] transition-all font-bold text-black bg-white pr-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black text-white font-black text-xs flex items-center justify-center hover:bg-[#FF4B4B] transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading Skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] overflow-hidden animate-pulse">
                <div className="h-3 bg-gray-200" />
                <div className="p-8">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredBlogs.length > 0 ? filteredBlogs.map((post) => {
            // Estimate reading time
            const wordCount = (post.excerpt || '').split(' ').length + (post.sections?.reduce((acc: number, s: any) => acc + (s.content?.split(' ')?.length || 0), 0) || 0);
            const readMins = Math.max(1, Math.ceil(wordCount / 200));
            return (
              <a
                key={post.id}
                href={`/blog/${post.slug || post.id}`}
                onClick={(e) => {
                  if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    navigate(`/blog/${post.slug || post.id}`);
                  }
                }}
                style={{ '--post-color': (post as any).color || '#FF4B4B' } as React.CSSProperties}
                className="blog-card-group bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] flex flex-col hover:shadow-[4px_4px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 ease-out cursor-pointer group h-full no-underline overflow-hidden"
              >
                {/* Color accent strip */}
                <div className="h-3 border-b-4 border-black flex-shrink-0" style={{ backgroundColor: (post as any).color || '#FF4B4B' }} />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black uppercase text-[10px] px-2.5 py-1 border-2 border-black bg-black text-white shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                      {(post as any).category || 'Blog'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">{post.date}</span>
                      <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">{readMins} min</span>
                    </div>
                  </div>
                  <h3
                    className="text-2xl font-black uppercase mb-3 leading-tight transition-colors duration-200 text-black group-hover:text-[var(--post-color)]"
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-700 font-bold mb-6 flex-1 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center border-t-2 border-black/10 pt-4">
                    <span className="font-black text-xs uppercase tracking-wide text-black">Read Decrypted File</span>
                    <div
                      className="w-9 h-9 bg-black text-white flex items-center justify-center font-black transition-all duration-200 group-hover:bg-[var(--post-color)] group-hover:scale-110"
                    >→</div>
                  </div>
                </div>
              </a>
            );
          }) : (
            <div className="col-span-full py-40 text-center border-8 border-dashed border-black/10">
              <div className="text-8xl mb-4 grayscale opacity-20">📂</div>
              <h3 className="text-4xl font-black uppercase opacity-20 text-black">
                {searchTerm ? 'No matching posts' : 'Log file not found!'}
              </h3>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-6 cartoon-btn bg-[#FF4B4B] text-white px-6 py-2 font-black uppercase text-sm opacity-60"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
