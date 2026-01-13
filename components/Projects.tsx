
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';

const Scribble: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={`absolute fill-none stroke-current ${className}`} style={{ strokeWidth: 3, strokeLinecap: 'round' }}>
    <path d="M5,15 Q25,5 45,15 T85,10" />
  </svg>
);

const ProjectCard: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex-shrink-0 w-[90vw] h-[75vh] md:h-[80vh] flex items-center justify-center px-4 md:px-12 relative group"
      style={{ perspective: '2000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out flex flex-col md:flex-row items-center gap-8 md:gap-0"
        style={{
          transform: `rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 5}deg)`
        }}
      >
        <div className="absolute -top-10 left-0 text-[12rem] md:text-[25rem] font-black text-black opacity-[0.03] select-none pointer-events-none leading-none z-0">
          0{index + 1}
        </div>

        <div className="relative w-full md:w-[65%] h-[45%] md:h-[85%] z-20 group/img">
          <div className="absolute -top-4 md:-top-6 left-6 md:left-10 bg-black text-[#FFD600] px-4 md:px-6 py-1 font-black uppercase text-[10px] md:text-xs skew-x-[-15deg] border-t-2 border-x-2 border-black z-30">
            SCHEMA_DATA_{index + 1}
          </div>

          <div className="absolute inset-0 bg-white border-[4px] md:border-[10px] border-black shadow-[10px_10px_0px_#000] md:shadow-[15px_15px_0px_#000] overflow-hidden group-hover/img:shadow-[5px_5px_0px_#000] transition-all">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700 scale-105 group-hover/img:scale-100"
            />
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
          </div>
        </div>

        <div className="w-full md:w-[45%] bg-white border-[4px] md:border-[6px] border-black p-6 md:p-12 shadow-[10px_10px_0px_#00A1FF] md:shadow-[15px_15px_0px_#00A1FF] z-40 md:-ml-20 transform -rotate-1 group-hover:rotate-0 transition-all">
          <h3 className="text-3xl md:text-7xl font-black uppercase leading-[0.85] mb-4 md:mb-6 tracking-tighter text-black">
            {project.title}
          </h3>
          <div className="bg-yellow-50 border-2 border-dashed border-black/20 p-3 md:p-4 mb-6 md:mb-8 relative">
            <Scribble className="w-10 md:w-12 text-[#FF4B4B] -top-3 -right-1" />
            <p className="font-bold text-gray-800 italic leading-tight text-base md:text-xl">
              "{project.description}"
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 md:mb-10">
            {project.tags.map(tag => (
              <span key={tag} className="bg-black text-white px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-black uppercase tracking-tighter border-2 border-black">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.disabled ? undefined : project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (project.disabled) e.preventDefault();
            }}
            className={`cartoon-btn w-full group/btn flex flex-col items-center justify-center gap-1 md:gap-2 py-3 md:py-5 font-black uppercase border-4 border-black transition-all
    ${project.disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-[6px_6px_0px_#000]'
                : 'bg-[#FFD600] text-black shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] hover:bg-black hover:text-[#FFD600] active:translate-y-1 active:shadow-none'
              }`}
          >
            {/* Main label */}
            <div className="flex items-center gap-2 text-lg md:text-2xl">
              {project.disabled ? 'ENTERPRISE ONLY ⭐' : 'VIEW PROJECT'}
              {!project.disabled && (
                <span className="text-2xl md:text-4xl group-hover/btn:translate-x-3 transition-transform">
                  →
                </span>
              )}
            </div>

            {/* Subtext (only when disabled) */}
            {project.disabled && (
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-80">
                Contact me for more information
              </span>
            )}
          </a>



        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;
      const progress = Math.min(Math.max(-rect.top / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let pinProgress = 0;
  if (scrollProgress > 0.20) {
    pinProgress = Math.min((scrollProgress - 0.20) / 0.25, 1);
  }

  let galleryProgress = 0;
  if (scrollProgress > 0.30) {
    galleryProgress = Math.min((scrollProgress - 0.30) / 0.60, 1);
  }

  const titleX = 50 - (pinProgress * 44);
  const titleScale = 1 - (pinProgress * 0.55);
  const titleRotation = pinProgress * -90;

  const translationDistance = 330;
  const currentTranslate = 100 - (galleryProgress * translationDistance);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative h-[450vh] bg-[#FFF9E6] border-y-8 border-black"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none  top-0 h-screen"
        style={{
          backgroundImage: `linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)`,
          backgroundSize: '80px 80px'
        }}>
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">

        {/* THE "WORKS" HEADER - RESPONSIVE SIZING */}
        <div
          className="absolute z-[60] pointer-events-none flex items-center justify-center whitespace-nowrap"
          style={{
            left: `${titleX}%`,
            top: '50%',
            transform: `translate(-50%, -50%) scale(${titleScale}) rotate(${titleRotation}deg)`,
            width: '100vw'
          }}
        >
          <div className="relative">
            <h2 className="text-[5.5rem] sm:text-[10rem] md:text-[15rem] lg:text-[18rem] xl:text-[22rem] font-black uppercase tracking-tighter leading-none italic">
              W<span className="text-white" style={{ WebkitTextStroke: 'clamp(2px, 0.5vw, 5px) black', textShadow: 'clamp(6px, 1vw, 12px) clamp(6px, 1vw, 12px) 0px #FF4B4B' }}>OR</span>KS
            </h2>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[45%] bg-[#FFD600] border-y-4 md:border-y-8 border-black -rotate-1 -z-10 shadow-[10px_10px_0px_#000] md:shadow-[25px_25px_0px_#000]"
            ></div>
          </div>
        </div>

        <div
          className="flex items-center h-full transition-all duration-75 ease-out"
          style={{
            transform: `translateX(${currentTranslate}vw)`,
            opacity: Math.min(pinProgress * 3, 1),
          }}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}

          <div className="flex-shrink-0 w-[50vw] flex items-center justify-center ml-10">
            <div className="bg-white border-[8px] md:border-[12px] border-black p-8 md:p-16 rotate-3 shadow-[15px_15px_0px_#FFD600] md:shadow-[30px_30px_0px_#FFD600] text-center">
              <h4 className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic mb-2 md:mb-4">FIN_DATA</h4>
              <p className="font-bold text-sm md:text-2xl uppercase tracking-widest text-[#FF4B4B]">Sequence Complete!</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 z-[70] pointer-events-none">
          <span className="font-black uppercase text-[10px] tracking-widest bg-black text-white px-3 py-1">
            {scrollProgress < 0.2 ? 'System Ready' : scrollProgress < 0.45 ? 'Syncing...' : `Intel: ${Math.round(galleryProgress * 100)}%`}
          </span>
          <div className="w-48 h-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
            <div
              className="h-full bg-[#00A1FF] transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
