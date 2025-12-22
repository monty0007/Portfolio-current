
import React, { useState, useEffect } from 'react';
import { getAchievements } from '../services/dataService';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(getAchievements());
  }, []);

  return (
    <section id="achievements" className="py-32 px-6 bg-[#FFF9E6] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-8 bg-black"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-block bg-[#6B4BFF] text-white px-8 py-3 font-black uppercase text-2xl cartoon-btn transform rotate-1 mb-6">
            Hall of Fame
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            BADGES OF <br /> <span className="text-[#FF4B4B]" style={{ WebkitTextStroke: '2px black' }}>HONOR</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id}
              className="relative group"
              style={{ transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})` }}
            >
              <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_#000] group-hover:shadow-[18px_18px_0px_#000] group-hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                {/* Sticker "Peel" Effect */}
                <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#000] clip-path-sticker group-hover:w-14 group-hover:h-14 transition-all"></div>
                
                <div 
                  className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center text-5xl mb-6 shadow-inner"
                  style={{ backgroundColor: achievement.color }}
                >
                  {achievement.icon}
                </div>
                
                <h3 className="text-2xl font-black uppercase mb-2 leading-tight">
                  {achievement.title}
                </h3>
                
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                  {achievement.issuer}
                </p>
                
                <div className="mt-auto px-4 py-1 bg-black text-white font-black text-xs uppercase rounded-full">
                  Issued {achievement.date}
                </div>
              </div>

              {/* Background Accent */}
              <div 
                className="absolute -inset-4 border-4 border-dashed opacity-0 group-hover:opacity-20 transition-opacity rounded-xl -z-10"
                style={{ borderColor: achievement.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .clip-path-sticker {
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
      `}</style>
    </section>
  );
};

export default Achievements;
