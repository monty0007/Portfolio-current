
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';

const ProjectRow: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 mb-40 last:mb-0`}
    >
      {/* Large Image Container with Parallax hover */}
      <div className={`flex-1 w-full opacity-0 ${isVisible ? (isEven ? 'animate-project-left' : 'animate-project-right') : ''}`}>
        <div 
          className="relative cartoon-border overflow-hidden bg-white aspect-video group"
          style={{ 
            transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 font-black cartoon-border shadow-none">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Content Side */}
      <div className={`flex-1 space-y-8 opacity-0 ${isVisible ? (isEven ? 'animate-project-right' : 'animate-project-left') : ''}`}>
        <div className="inline-block px-4 py-1 bg-white border-4 border-black font-black uppercase tracking-widest text-sm">
          Project Deployment
        </div>
        
        <h3 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
          {project.title.split(' ').map((word, i) => (
            <span key={i} className="block last:text-blue-600 first:hover:text-red-500 transition-colors cursor-default">
              {word}
            </span>
          ))}
        </h3>

        <p className="text-2xl font-bold text-gray-700 leading-relaxed border-l-8 border-black pl-8 max-w-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4">
          {project.tags.map(tag => (
            <span key={tag} className="px-4 py-2 bg-yellow-400 border-2 border-black font-black uppercase shadow-[4px_4px_0px_#000]">
              {tag}
            </span>
          ))}
        </div>

        <button className="cartoon-btn px-10 py-5 bg-black text-white font-black text-xl uppercase inline-block">
          Visit Gadget →
        </button>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 px-6 relative z-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-32 text-center md:text-left">
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-8">
            GenAI <br /> <span className="text-[#FFD600]" style={{ WebkitTextStroke: '2px black' }}>Showcase</span>
          </h2>
          <div className="h-4 w-40 bg-black mx-auto md:mx-0"></div>
        </header>

        <div className="space-y-64">
          {PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Background oversized text for Awwwards feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/5 select-none -z-10 uppercase pointer-events-none whitespace-nowrap">
        GenAI Artifacts
      </div>
    </section>
  );
};

export default Projects;
