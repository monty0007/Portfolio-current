
import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
    window.addEventListener('portfolioThemeChange', handler);
    return () => window.removeEventListener('portfolioThemeChange', handler);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // High-quality vector SVG data URIs for Microsoft Power Platform
  // const powerAppsSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzc0Mjc3NCIgZD0iTTEyLjQ0IDM1LjJsMTIuNCAxMi40Yy41NS41NSAxLjQ0LjU1IDEuOTkgMGwxNy44MS0xNy44MWMuNTUtLjU1LjU1LTEuNDQgMC0xLjk5TDMyLjI0IDE1LjQgMTIuNDQgMzUuMnoiLz48cGF0aCBmaWxsPSIjQzE2QUMxIiBkPSJNMzUuMSAxMi4zNWwtMTIuNC0xMi40Yy0uNTUtLjU1LTEuNDQtLjU1LTEuOTkgMEwyLjg5IDE3Ljc2Yy0uNTUuNTUtLjU1IDEuNDQgMCAxLjk5bDEyLjQgMTIuNCAxOS44MS0xOS44eiIvPjxwYXRoIGZpbGw9IiNEOTk5RDkiIGQ9Ik0zMi4yNCAxNS40TDE1LjMgMzIuMzVsMTIuNCAxMi40Yy41NS41NSAxLjQ0LjU1IDEuOTkgMGwxMi40LTEyLjRjLjU1LS41NS41NS0xLjQ0IDAtMS45OUwzMi4yNCAxNS40eiIvPjwvc3ZnPg==`;
  // const powerAutomateSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCI+PHBhdGggZmlsbD0iIzAwNUE5RSIgZD0iTTMuNyAxMS4zbDEyLjQtMTIuNGMuNS0uNSAxLjQtLjUgMS45IDBMNDQuMyAyNS4yYy41LjUuNSAxLjQgMCAxLjlsLTEyLjQgMTIuNE0zLjcgMTEuM3oiLz48cGF0aCBmaWxsPSIjMTA2RUJFIiBkPSJNMjEgMjguNmwxMi40IDEyLjRjLjUuNSAxLjQuNSAxLjkgMGwxMi40LTEyLjRjLjUtLjUuNS0xLjQgMC0xLjlMMjEgMjguNnoiLz48cGF0aCBmaWxsPSIjM0E5NkREIiBkPSJNMjEgMjguNkw0LjcgMTIuM2MtLjUtLjUtLjUtMS40IDAtMS45bDEyLjQtMTIuNGMuNS0uNSAxLjQtLjUgMS45IDBsMzEuNyAzMS43Yy41LjUuNSAxLjQgMCAxLjlsLTEyLjQgMTIuNEwyMSAyOC42eiIvPjwvc3ZnPg==`;


  const powerAppsSvg = 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Powerapps-logo.svg'
  const powerAutomateSvg = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Microsoft_Power_Automate.svg'

  const techStack = [
    // LEFT SIDE
    { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', pos: 'top-[10%] left-[5%]', size: 'w-24 h-24', delay: '0s', factor: 1.2 },
    { name: 'NodeJS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', pos: 'bottom-[15%] left-[8%]', size: 'w-24 h-24', delay: '2s', factor: 1.5 },
    { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', pos: 'top-[45%] left-[2%]', size: 'w-16 h-16', delay: '1s', factor: 2.5 },
    { name: 'Power Automate', url: powerAutomateSvg, pos: 'bottom-[45%] left-[12%]', size: 'w-24 h-24', delay: '3s', factor: 1.8 },

    // RIGHT SIDE
    { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', pos: 'top-[15%] right-[8%]', size: 'w-28 h-28', delay: '1.5s', factor: -0.8 },
    { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', pos: 'bottom-[10%] right-[12%]', size: 'w-24 h-24', delay: '3.5s', factor: -1.4 },
    { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', pos: 'top-[50%] right-[3%]', size: 'w-20 h-20', delay: '4s', factor: -2.2 },
    { name: 'Power Apps', url: powerAppsSvg, pos: 'bottom-[40%] right-[25%]', size: 'w-24 h-24', delay: '2.5s', factor: 0.5 },
  ];

  return (
    <section className={`min-h-[85vh] md:min-h-screen pt-16 md:pt-24 pb-0 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden ${isDark ? 'bg-black border-b-8 border-[#FFD600]' : 'bg-[#FFF9E6] border-b-8 border-black'}`}>

      {/* Ghost background text */}
      <div className={`absolute -bottom-6 -left-6 text-[22vw] font-black ${isDark ? 'text-white/[0.07]' : 'text-black/[0.04]'} select-none pointer-events-none uppercase leading-none italic whitespace-nowrap`}>
        GENAI
      </div>
      <div className={`absolute -top-4 -right-4 text-[16vw] font-black text-[#FFD600]/[0.06] select-none pointer-events-none uppercase leading-none italic whitespace-nowrap`}>
        AI
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Interactive Tech Logos Layer */}
      {techStack.map((tech, i) => (
        <div
          key={i}
          className={`absolute ${tech.pos} ${tech.size} floating opacity-40 md:opacity-70 z-0 pointer-events-none transition-transform duration-300 ease-out p-1`}
          style={{
            animationDelay: tech.delay,
            transform: `translate(${mousePos.x * tech.factor}px, ${mousePos.y * tech.factor}px)`
          }}
        >
          <img
            src={tech.url}
            alt={tech.name}
            className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,214,0,0.3)]"
          />
        </div>
      ))}

      <div className="max-w-6xl w-full text-center z-20 relative">
        {/* Top label */}
        <div className="flex items-center justify-center gap-3 mb-5 md:mb-7">
          <div className={`h-px w-12 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
          <div className="inline-block bg-[#FF4B4B] text-white px-4 md:px-6 py-2 text-sm md:text-base font-black border-4 border-[#FF4B4B] rotate-[-1deg] shadow-[4px_4px_0px_rgba(255,75,75,0.3)] cursor-default">
            Hi, I'm Manish Yadav
          </div>
          <div className={`h-px w-12 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
        </div>

        <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-black leading-[0.9] mb-4 md:mb-6 uppercase tracking-tighter break-words ${isDark ? 'text-white' : 'text-black'}`}>
          GEN AI <br className="hidden sm:block" />
          <span
            className="text-[#f0cc00] hover:scale-105 transition-transform inline-block cursor-pointer px-2"
            style={{ WebkitTextStroke: '2px #000', textShadow: '4px 4px 0px rgba(255,75,75,0.6)' }}
          >
            ENGINEER
          </span>
        </h1>

        <p className={`max-w-2xl mx-auto text-base md:text-xl lg:text-2xl font-bold mb-6 md:mb-10 ${isDark ? 'text-white/70' : 'text-black/70'} leading-tight px-4`}>
          Crafting production-ready AI systems with <br className="hidden md:block" />
          <span className={`px-2 inline-block my-1 ${isDark ? 'bg-[#FFD600] text-black border-2 border-[#FFD600]' : 'bg-[#FFD600] text-black border-2 border-black'}`}>Engineering Precision</span>
          {' '}and real-world impact.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 px-6">
          <a href="#projects" className="cartoon-btn bg-[#FFD600] text-black text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto border-4 border-[#FFD600] shadow-[6px_6px_0px_rgba(255,214,0,0.3)] hover:shadow-[3px_3px_0px_rgba(255,214,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            View My Lab 🔬
          </a>
          <a href="mailto:monty.my1234@gmail.com" className={`cartoon-btn text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto border-4 transition-all ${isDark ? 'bg-white/10 text-white border-white/30 hover:bg-white hover:text-black' : 'bg-black text-white border-black hover:bg-[#FFD600] hover:text-black hover:border-[#FFD600]'}`}>
            Collaborate
          </a>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 border-2 transition-all ${isDark ? 'bg-white/5 text-white border-white/20 hover:border-[#FFD600] hover:bg-white/10' : 'bg-black/5 text-black border-black/20 hover:border-[#FFD600] hover:bg-black/10'}`}>
            <span className={`font-black text-lg leading-none ${isDark ? 'text-[#FFD600]' : 'text-black'}`}>10+</span>
            <span className="font-black uppercase text-[10px] tracking-widest">Projects Built</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 border-2 transition-all ${isDark ? 'bg-[#FF4B4B]/20 text-white border-[#FF4B4B]/50 hover:border-[#FF4B4B] hover:bg-[#FF4B4B]/30' : 'bg-[#FF4B4B] text-white border-black hover:bg-red-400'}`}>
            <span className="font-black text-lg leading-none">8+</span>
            <span className="font-black uppercase text-[10px] tracking-widest">Certifications</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 border-2 transition-all ${isDark ? 'bg-[#00A1FF]/20 text-white border-[#00A1FF]/50 hover:border-[#00A1FF] hover:bg-[#00A1FF]/30' : 'bg-[#00A1FF] text-white border-black hover:bg-blue-400'}`}>
            <span className="font-black text-lg leading-none">3</span>
            <span className="font-black uppercase text-[10px] tracking-widest">Arcade Games</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 border-2 transition-all ${isDark ? 'bg-white/5 text-white border-white/20 hover:border-green-400' : 'bg-white text-black border-black/20 hover:border-green-400'}`}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
            <span className="font-black uppercase text-[10px] tracking-widest">Available Now</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce z-20 pointer-events-none">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-black/30'}`}>Scroll</span>
        <div className={`w-6 h-10 rounded-full flex items-start justify-center p-1.5 border-2 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
          <div className="w-1.5 h-2.5 bg-[#FFD600] rounded-full" style={{ animation: 'scrollDot 2s ease-in-out infinite' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
