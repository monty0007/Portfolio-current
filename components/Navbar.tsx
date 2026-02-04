
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (view: 'home' | 'blog' | 'admin', sectionId?: string) => void;
  currentView: 'home' | 'blog' | 'admin';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar if inside #projects section
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const isInsideProjects = rect.top < window.innerHeight * 0.3 && rect.bottom > window.innerHeight * 0.3;
        if (isInsideProjects) {
          setIsVisible(false);
          setLastScrollY(currentScrollY);
          return;
        }
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      // We need to wait for navigation to home before scrolling, 
      // effectively this is solved by passing the ID to parent or handling it via effect in Home/App
      // For now, I'll rely on the onNavigate prop passed from App which handles this logic perfectly
      onNavigate('home', id);
    } else {
      onNavigate('home', id);
    }
  };

  return (
    <nav className={`fixed top-4 sm:top-6 left-1/2 z-[110] w-[95%] sm:w-[90%] max-w-5xl transition-all duration-500 ease-in-out ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
      <div className="bg-white border-[3px] sm:border-[4px] border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div
          className="text-2xl font-black tracking-tighter flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFD600] border-2 sm:border-4 border-black rounded-full flex items-center justify-center font-black group-hover:rotate-12 transition-transform text-xs sm:text-base">
            MY
          </div>
          <span className="hidden sm:inline uppercase">Manish Yadav</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 font-black uppercase text-[10px] sm:text-sm">
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className={`hover:text-blue-600 transition-colors ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleLinkClick(e, 'projects')}
            className={`hover:text-red-500 transition-colors ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
          >
            Works
          </a>
          <a
            href="#achievements"
            onClick={(e) => handleLinkClick(e, 'achievements')}
            className={`hover:text-purple-500 transition-colors ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
          >
            Badges
          </a>
          <a
            href="#arcade"
            onClick={(e) => handleLinkClick(e, 'arcade')}
            className={`hidden sm:block hover:text-yellow-500 transition-colors ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
          >
            Games
          </a>
          <a
            href="/blog"
            onClick={(e) => {
              // Allow middle-click and ctrl/cmd+click to work naturally
              if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onNavigate('blog');
              }
            }}
            className={`cursor-pointer hover:text-green-500 transition-colors uppercase font-black ${currentView === 'blog' ? 'text-green-500 underline decoration-4' : 'text-black'}`}
          >
            Blog
          </a>
          <a
            href="#contact-banner"
            onClick={(e) => handleLinkClick(e, 'contact-banner')}
            className="cartoon-btn bg-black text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-none hover:bg-[#FFD600] hover:text-black shadow-none active:translate-y-1 whitespace-nowrap"
          >
            PING ME!
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
