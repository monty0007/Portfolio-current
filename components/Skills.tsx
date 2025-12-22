
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  const [currentSkills, setCurrentSkills] = useState(SKILLS);
  const [isResetting, setIsResetting] = useState(false);

  const data = currentSkills.map(s => ({ subject: s.name, A: s.level, fullMark: 100 }));

  const handleSkillChange = (name: string, newValue: number) => {
    const level = Math.max(0, Math.min(100, Math.round(newValue)));
    setCurrentSkills(prev => 
      prev.map(s => s.name === name ? { ...s, level } : s)
    );
  };

  const handleReset = () => {
    setIsResetting(true);
    setCurrentSkills(SKILLS);
    setTimeout(() => setIsResetting(false), 800);
  };

  return (
    <section id="skills" className="py-20 px-6 bg-[#00A1FF] relative z-10 overflow-hidden border-y-8 border-black">
      {/* Background oversized graphics */}
      <div className="absolute -bottom-10 -left-10 text-[20vw] font-black text-black/10 select-none pointer-events-none uppercase leading-none italic">
        SKILLS
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 relative z-10">
        <div className="flex-1 text-white w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter">
              Ninja <br /> <span className="text-white" style={{ WebkitTextStroke: '2px black' }}>Stats</span>
            </h2>
            
            <button 
              onClick={handleReset}
              className={`relative cartoon-btn bg-[#FFD600] text-black px-6 py-3 font-black uppercase text-xl transition-all shadow-[8px_8px_0px_#000] border-[4px] border-black active:translate-y-1 active:translate-x-1 active:shadow-none ${isResetting ? 'animate-bounce' : ''}`}
            >
              REBOOT POWER
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSkills.map(skill => (
              <div key={skill.name} className="bg-white p-5 border-[4px] border-black shadow-[8px_8px_0px_#000] text-black group relative hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-xl uppercase tracking-tighter">{skill.name}</span>
                  <span className="font-black text-2xl text-[#FF4B4B]">{skill.level}%</span>
                </div>
                
                <div 
                  className="w-full h-8 bg-gray-100 border-2 border-black cursor-pointer relative overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    handleSkillChange(skill.name, percentage);
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF4B4B] to-red-600 transition-all duration-500 ease-out"
                    style={{ width: `${skill.level}%` }}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Radar Chart Container - Optimized for scrollability */}
        <div className="w-full lg:w-[450px] max-h-[500px] lg:max-h-none aspect-square bg-white border-[8px] border-black shadow-[15px_15px_0px_#000] p-6 flex items-center justify-center relative rotate-1 self-center">
          <div className="w-full h-full pointer-events-none lg:pointer-events-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid stroke="#000" strokeWidth={2} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#000', fontWeight: '900', fontSize: 12 }} 
                />
                <Radar
                  name="Stats"
                  dataKey="A"
                  stroke="#FF4B4B"
                  strokeWidth={4}
                  fill="#FF4B4B"
                  fillOpacity={0.5}
                  animationDuration={600}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
