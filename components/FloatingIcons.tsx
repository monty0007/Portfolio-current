
import React from 'react';
import { CARTOON_ICONS } from '../constants';

const FloatingIcons: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {CARTOON_ICONS.map((icon) => (
        <div
          key={icon.id}
          className="absolute floating"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: `${100 * icon.scale}px`,
            height: `${100 * icon.scale}px`,
            transition: 'all 0.5s ease-out',
          }}
        >
          <img 
            src={icon.url} 
            alt={icon.id} 
            className="w-full h-full object-contain filter drop-shadow-xl"
          />
        </div>
      ))}
      {/* Random shapes */}
      <div className="absolute top-[40%] left-[60%] w-32 h-32 bg-[#FFD600] rounded-full border-4 border-black -z-10 opacity-30 animate-pulse"></div>
      <div className="absolute top-[10%] left-[20%] w-24 h-24 bg-[#00A1FF] rotate-45 border-4 border-black -z-10 opacity-30"></div>
      <div className="absolute bottom-[20%] left-[10%] w-40 h-20 bg-[#FF4B4B] rounded-xl border-4 border-black -z-10 opacity-30 rotate-12"></div>
    </div>
  );
};

export default FloatingIcons;
