
import React, { useState, useEffect } from 'react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'blog' | 'admin', sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 relative overflow-hidden border-t-8 border-black">
      {/* Background oversized name */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
        Manish Yadav
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Main Hook */}
          <div className="md:col-span-1">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
              Build <br /> <span className="text-[#FFD600]">Future</span> <br /> Today.
            </h2>
            <div className="flex gap-3 items-center">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Available for projects</span>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-xs font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Sitemap</h4>
              <ul className="space-y-3 text-lg font-bold">
                <li>
                  <button
                    onClick={() => onNavigate?.('home', 'about')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full"
                  >
                    Mission
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('home', 'projects')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full"
                  >
                    Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('blog')}
                    className="hover:text-[#FFD600] transition-all uppercase text-left w-full"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Socials</h4>
              <ul className="space-y-3 text-lg font-bold">
                <li><a href="https://github.com/monty0007" target="_blank" rel="noopener noreferrer" className="hover:underline hover:decoration-[#FF4B4B]">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/manish-yadav-8a5667202/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:decoration-[#00A1FF]">LinkedIn</a></li>
                <li>
                  <button
                    onClick={() => onNavigate?.('admin')}
                    className="lg:hidden text-white/40 hover:text-[#FFD600] transition-all text-sm uppercase font-black border-b-2 border-white/20 hover:border-[#FFD600]"
                  >
                    Admin Access
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Marquee effect */}
        <div className="w-full h-px bg-white/20 mb-8"></div>
        <div className="overflow-hidden whitespace-nowrap mb-8 select-none">
          <div className="inline-block animate-[marquee_20s_linear_infinite] text-sm font-black uppercase tracking-[0.3em] text-gray-400">
            GENAI • AGENTIC WORKFLOWS • POWER PLATFORM • REACT • PROMPT ENGINEER • BUSINESS AUTOMATION • &nbsp;
          </div>
          <div className="inline-block animate-[marquee_20s_linear_infinite] text-sm font-black uppercase tracking-[0.3em] text-gray-400">
            GENAI • AGENTIC WORKFLOWS • POWER PLATFORM • REACT • PROMPT ENGINEER • BUSINESS AUTOMATION • &nbsp;
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-gray-500 font-black uppercase tracking-[0.2em] text-[9px] mb-1">Local Time</span>
            <div className="text-xl font-black">{time}</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-xl font-black uppercase tracking-tight">© {new Date().getFullYear()} MEOWNTY😸</div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mt-1">Built with high-frequency energy</div>
          </div>

          <button
            onClick={scrollToTop}
            className="cartoon-btn w-14 h-14 bg-[#00A1FF] text-white flex items-center justify-center hover:bg-white hover:text-black transition-all group border-4 border-black"
          >
            <span className="text-2xl group-hover:-translate-y-1 transition-transform">↑</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
