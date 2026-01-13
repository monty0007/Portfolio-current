
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
    <nav className={`fixed top-6 left-1/2 z-[110] w-[90%] max-w-5xl transition-all duration-500 ease-in-out ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] px-8 py-4 flex items-center justify-between">
        <div
          className="text-2xl font-black tracking-tighter flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          <div className="w-10 h-10 bg-[#FFD600] border-4 border-black rounded-full flex items-center justify-center font-black group-hover:rotate-12 transition-transform">
            MY
          </div>
          <span className="hidden sm:inline uppercase">Manish Yadav</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-10 font-black uppercase text-xs sm:text-sm">
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
          <button
            onClick={() => navigate('/blog')}
            className={`hover:text-green-500 transition-colors uppercase font-black ${currentView === 'blog' ? 'text-green-500 underline decoration-4' : 'text-black'}`}
          >
            Blog
          </button>
          <a
            href="mailto:monty.my1234@gmail.com"
            className="cartoon-btn bg-black text-white px-4 sm:px-6 py-2 rounded-none hover:bg-[#FFD600] hover:text-black shadow-none active:translate-y-1"
          >
            PING ME!
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
