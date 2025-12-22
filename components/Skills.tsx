
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  const [currentSkills, setCurrentSkills] = useState(SKILLS);

  const data = currentSkills.map(s => ({ subject: s.name, A: s.level, fullMark: 100 }));

  const handleSkillChange = (name: string, newValue: number) => {
    // Constrain value between 0 and 100
    const level = Math.max(0, Math.min(100, Math.round(newValue)));
    setCurrentSkills(prev => 
      prev.map(s => s.name === name ? { ...s, level } : s)
    );
  };

  const handleReset = () => {
    setCurrentSkills(SKILLS);
  };

  return (
    <section id="skills" className="py-24 px-6 bg-[#00A1FF] relative z-10 overflow-hidden border-y-8 border-black">
      {/* Dynamic Background Text */}
      <div className="absolute -bottom-10 -left-10 text-[20vw] font-black text-black/10 select-none pointer-events-none uppercase leading-none">
        POWER
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-white w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <h2 className="text-6xl md:text-8xl font-black uppercase leading-none">
              Ninja <br /> Stats
            </h2>
            <button 
              onClick={handleReset}
              className="cartoon-btn bg-white text-black px-6 py-3 font-black uppercase text-sm hover:bg-yellow-400 active:translate-y-2 transition-all shadow-[6px_6px_0px_#000]"
            >
              Reset Stats 🔄
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentSkills.map(skill => (
              <div key={skill.name} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_#000] text-black group relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-xl uppercase tracking-tighter">{skill.name}</span>
                  <span className="font-black text-3xl text-[#FF4B4B]">{skill.level}%</span>
                </div>
                
                {/* Interactive Bar */}
                <div 
                  className="w-full h-8 bg-gray-100 border-4 border-black cursor-crosshair relative overflow-hidden group-hover:bg-yellow-50 transition-colors"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    handleSkillChange(skill.name, percentage);
                  }}
                >
                  <div 
                    className="h-full bg-[#FF4B4B] transition-all duration-300 ease-out relative"
                    style={{ width: `${skill.level}%` }}
                  >
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-white/20 h-1/2"></div>
                    {/* Action lines pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-black uppercase text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click on bar to adjust power level
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-[550px] h-[550px] bg-white border-8 border-black shadow-[20px_20px_0px_#000] p-10 flex items-center justify-center relative rotate-1">
          {/* Animated floating badges */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rotate-12 z-20 drop-shadow-2xl animate-bounce">
            <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Stats&backgroundColor=FF4B4B" className="w-full h-full" alt="Icon" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 -rotate-12 z-20 opacity-40">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Radar&backgroundColor=00A1FF" className="w-full h-full" alt="Icon" />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#000" strokeWidth={2} strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#000', fontWeight: '900', fontSize: 14, textAnchor: 'middle' }} 
              />
              <Radar
                name="Manishi"
                dataKey="A"
                stroke="#FF4B4B"
                strokeWidth={4}
                fill="#FF4B4B"
                fillOpacity={0.5}
                animationDuration={500}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Skills;
