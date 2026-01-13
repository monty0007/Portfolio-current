
import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    <section className="min-h-[85vh] md:min-h-screen pt-16 md:pt-24 pb-6 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
      {/* Interactive Tech Logos Layer */}
      {techStack.map((tech, i) => (
        <div
          key={i}
          className={`absolute ${tech.pos} ${tech.size} floating opacity-40 md:opacity-90 z-20 pointer-events-none transition-transform duration-300 ease-out p-1`}
          style={{
            animationDelay: tech.delay,
            transform: `translate(${mousePos.x * tech.factor}px, ${mousePos.y * tech.factor}px)`
          }}
        >
          <img
            src={tech.url}
            alt={tech.name}
            className="w-full h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]"
          />
        </div>
      ))}

      <div className="max-w-6xl w-full text-center z-10">
        <div className="inline-block bg-[#FF4B4B] text-white px-4 md:px-6 py-2 text-sm md:text-base font-black cartoon-btn mb-4 md:mb-6 rotate-[-2deg] shadow-[4px_4px_0px_#000] cursor-default">
          HI! I'M Manish Yadav
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-black leading-[0.9] mb-4 md:mb-6 uppercase tracking-tighter break-words">
          GEN AI <br className="hidden sm:block" />
          <span
            className="text-[#00A1FF] hover:scale-105 transition-transform inline-block cursor-pointer px-2"
            style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #000' }}
          >
            ENGINEER
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-xl lg:text-2xl font-bold mb-6 md:mb-8 text-gray-800 leading-tight px-4">
          Crafting production-ready AI systems with <br className="hidden md:block" />
          <span className="bg-[#FFD600] border-2 border-black px-2 inline-block my-1">Engineering Precision</span>and real-world impact.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6">
          <a href="#projects" className="cartoon-btn bg-[#FFD600] text-black text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto">
            View My Lab 🔬
          </a>
          <a href="mailto:monty.my1234@gmail.com" className="cartoon-btn bg-white text-black text-base md:text-xl font-black px-8 md:px-10 py-3 md:py-4 uppercase no-underline w-full sm:w-auto">
            Collaborate
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
