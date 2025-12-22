
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="bg-white cartoon-border px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <span className="w-8 h-8 bg-yellow-400 border-2 border-black rounded-full inline-block"></span>
          CARTOON_DEV
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#about" className="hover:text-yellow-500 transition-colors uppercase">About</a>
          <a href="#projects" className="hover:text-blue-500 transition-colors uppercase">Projects</a>
          <a href="#skills" className="hover:text-red-500 transition-colors uppercase">Skills</a>
          <a 
            href="#contact" 
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all"
          >
            LET'S TALK
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
