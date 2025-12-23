
import React from 'react';

const FloatingIcons: React.FC = () => {
  // Vector SVG data URIs
  const powerAppsSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzc0Mjc3NCIgZD0iTTEyLjQ0IDM1LjJsMTIuNCAxMi40Yy41NS41NSAxLjQ0LjU1IDEuOTkgMGwxNy44MS0xNy44MWMuNTUtLjU1LjU1LTEuNDQgMC0xLjk5TDMyLjI0IDE1LjQgMTIuNDQgMzUuMnoiLz48cGF0aCBmaWxsPSIjQzE2QUMxIiBkPSJNMzUuMSAxMi4zNWwtMTIuNC0xMi40Yy0uNTUtLjU1LTEuNDQtLjU1LTEuOTkgMEwyLjg5IDE3Ljc2Yy0uNTUuNTUtLjU1IDEuNDQgMCAxLjk5bDEyLjQgMTIuNCAxOS44MS0xOS44eiIvPjxwYXRoIGZpbGw9IiNEOTk5RDkiIGQ9Ik0zMi4yNCAxNS40TDE1LjMgMzIuMzVsMTIuNCAxMi40Yy41NS41NSAxLjQ0LjU1IDEuOTkgMGwxMi40LTEyLjRjLjU1LS41NS41NS0xLjQ0IDAtMS45OUwzMi4yNCAxNS40eiIvPjwvc3ZnPg==`;
  const powerAutomateSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCI+PHBhdGggZmlsbD0iIzAwNUE5RSIgZD0iTTMuNyAxMS4zbDEyLjQtMTIuNGMuNS0uNSAxLjQtLjUgMS45IDBMNDQuMyAyNS4yYy41LjUuNSAxLjQgMCAxLjlsLTEyLjQgMTIuNE0zLjcgMTEuM3oiLz48cGF0aCBmaWxsPSIjMTA2RUJFIiBkPSJNMjEgMjguNmwxMi40IDEyLjRjLjUuNSAxLjQuNSAxLjkgMGwxMi40LTEyLjRjLjUtLjUuNS0xLjQgMC0xLjlMMjEgMjguNnoiLz48cGF0aCBmaWxsPSIjM0E5NkREIiBkPSJNMjEgMjguNkw0LjcgMTIuM2MtLjUtLjUtLjUtMS40IDAtMS45bDEyLjQtMTIuNGMuNS0uNSAxLjQtLjUgMS45IDBsMzEuNyAzMS43Yy41LjUuNSAxLjQgMCAxLjlsLTEyLjQgMTIuNEwyMSAyOC42eiIvPjwvc3ZnPg==`;

  // Tech Logos that move/float
  const techLogos = [
    { id: 'react', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', x: '2%', y: '10%', size: '200px', rotate: '-15deg', opacity: 0.08, delay: '0s' },
    { id: 'mongo', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', x: '80%', y: '15%', size: '250px', rotate: '12deg', opacity: 0.08, delay: '2s' },
    { id: 'python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', x: '5%', y: '45%', size: '180px', rotate: '5deg', opacity: 0.06, delay: '4s' },
    { id: 'node', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', x: '85%', y: '50%', size: '150px', rotate: '-8deg', opacity: 0.08, delay: '1s' },
    { id: 'docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', x: '10%', y: '80%', size: '220px', rotate: '10deg', opacity: 0.06, delay: '3s' },
    { id: 'ts', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', x: '75%', y: '85%', size: '180px', rotate: '-12deg', opacity: 0.05, delay: '5s' },
    { id: 'powerapps', url: powerAppsSvg, x: '25%', y: '30%', size: '150px', rotate: '20deg', opacity: 0.07, delay: '2.5s' },
    { id: 'powerauto', url: powerAutomateSvg, x: '65%', y: '20%', size: '160px', rotate: '-10deg', opacity: 0.07, delay: '3.5s' },
  ];

  // Static Tech Stamps (Subtle printed blueprint layer)
  const stamps = [
    { name: 'javascript', x: '15%', y: '25%' }, { name: 'postgresql', x: '65%', y: '35%' },
    { name: 'tailwindcss', x: '45%', y: '5%' }, { name: 'googlecloud', x: '35%', y: '55%' },
    { name: 'github', x: '75%', y: '65%' }, { name: 'vscode', x: '55%', y: '85%' },
    { name: 'npm', x: '25%', y: '75%' }, { name: 'linux', x: '90%', y: '95%' },
    { name: 'firebase', x: '5%', y: '60%' }, { name: 'graphql', x: '95%', y: '10%' },
    { name: 'rust', x: '50%', y: '30%' }, { name: 'java', x: '10%', y: '90%' },
    { name: 'figma', x: '88%', y: '40%' }, { name: 'swift', x: '30%', y: '15%' },
    { name: 'sass', x: '70%', y: '75%' }, { name: 'amazonwebservices', x: '20%', y: '40%' },
  ];

  const actionText = [
    { text: 'BUILD!', x: '12%', y: '18%', rotate: '-15deg' },
    { text: 'DEPLOY!', x: '78%', y: '42%', rotate: '12deg' },
    { text: 'SCALE!', x: '45%', y: '82%', rotate: '-8deg' },
    { text: 'DEBUG!', x: '25%', y: '62%', rotate: '15deg' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#FFF9E6]">
      {/* Base Patterns */}
      <div className="absolute inset-0 halftone-bg opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_0)] bg-[size:40px_40px] opacity-[0.05]"></div>
      
      {/* Blueprint Stamped Layer */}
      {stamps.map((stamp, i) => (
        <div 
          key={i} 
          className="absolute grayscale opacity-[0.04] saturate-0"
          style={{ left: stamp.x, top: stamp.y, width: '100px', height: '100px' }}
        >
          <img 
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${stamp.name}/${stamp.name}-original.svg`} 
            alt="stamp" 
            className="w-full h-full object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      ))}

      {/* Action Text Stamps */}
      {actionText.map((item, i) => (
        <div 
          key={i} 
          className="absolute font-black text-6xl md:text-9xl text-black/5 select-none"
          style={{ left: item.x, top: item.y, transform: `rotate(${item.rotate})` }}
        >
          {item.text}
        </div>
      ))}

      {/* Floating Interactive Tech Logos */}
      {techLogos.map((char) => (
        <div
          key={char.id}
          className="absolute floating select-none transition-all duration-1000"
          style={{
            left: char.x,
            top: char.y,
            width: char.size,
            height: char.size,
            opacity: char.opacity,
            transform: `rotate(${char.rotate})`,
            animationDelay: char.delay,
          }}
        >
          <img 
            src={char.url} 
            alt={char.id} 
            className="w-full h-full object-contain filter contrast-[0.8] grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      ))}

      {/* Neubrutalist Decorative Lines */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[2px] bg-black/5"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[2px] bg-black/5"></div>
    </div>
  );
};

export default FloatingIcons;
