
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 lg:gap-12 relative z-10 items-start">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 lg:mb-10 gap-6 order-1 lg:col-start-1">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-2">
              Ninja <br /> <span className="text-white" style={{ WebkitTextStroke: '2px black' }}>Stats</span>
            </h2>
            <div className="bg-black text-yellow-400 px-3 py-1 inline-block text-[10px] font-black uppercase tracking-widest border-2 border-black rotate-[-1deg]">
              ⚠️ Drag logic initialized. Slide bars to adjust power levels.
            </div>
          </div>

          <button
            onClick={handleReset}
            className={`relative cartoon-btn bg-[#FFD600] text-black px-6 py-3 font-black uppercase text-xl transition-all shadow-[8px_8px_0px_#000] border-[4px] border-black active:translate-y-1 active:translate-x-1 active:shadow-none ${isResetting ? 'animate-bounce' : ''}`}
          >
            FACTORY RESET 🛠️
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 order-3 lg:col-start-1 lg:row-start-2">
          {currentSkills.map(skill => (
            <div key={skill.name} className="bg-white p-5 border-[4px] border-black shadow-[8px_8px_0px_#000] text-black group relative hover:-translate-y-1 transition-transform overflow-hidden">
              {/* Interaction Overlay Label */}
              <div className="absolute -right-12 top-2 bg-black text-white text-[9px] font-black px-10 py-1 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity">
                ADJUSTABLE
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-black text-xl uppercase tracking-tighter">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-black text-2xl text-[#FF4B4B]">{skill.level}%</span>
                </div>
              </div>

              <div
                className="w-full h-10 bg-gray-100 border-[3px] border-black cursor-crosshair relative group/bar transition-all touch-none select-none"
                onPointerDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = (x / rect.width) * 100;
                  handleSkillChange(skill.name, percentage);
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    handleSkillChange(skill.name, percentage);
                  }
                }}
                onPointerUp={(e) => {
                  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                }}
              >
                {/* The Progress Fill */}
                <div
                  className="h-full bg-gradient-to-r from-[#FF4B4B] to-red-600 transition-all duration-300 ease-out relative"
                  style={{ width: `${skill.level}%` }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>

                  {/* The "Draggable" Thumb Indicator */}
                  <div className="absolute top-0 right-0 h-full w-4 bg-black border-l-2 border-white/20 flex items-center justify-center translate-x-1/2 group-hover/bar:scale-y-110 transition-transform">
                    <div className="w-0.5 h-4 bg-white/40 rounded-full"></div>
                  </div>
                </div>

                {/* Click Cue (hidden by default, shows on hover if level is low) */}
                {skill.level < 10 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <span className="text-[10px] font-black uppercase">CLICK TO BOOST</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Radar Chart Container */}
        <div className="w-full lg:w-[450px] max-h-[500px] lg:max-h-none aspect-square bg-white border-[8px] border-black shadow-[15px_15px_0px_#000] p-6 flex items-center justify-center relative rotate-1 self-center order-2 lg:col-start-2 lg:row-span-2 lg:sticky lg:top-24">
          {/* Decorative Corner Labels */}
          <div className="absolute top-2 left-2 text-[10px] font-black uppercase bg-black text-white px-2">Live_Telemetry</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-black uppercase text-gray-400">Arch_v2.5</div>

          <div className="w-full h-full pointer-events-none lg:pointer-events-auto" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid stroke="#000" strokeWidth={1} strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#000', fontWeight: '900', fontSize: 10 }}
                />
                <Radar
                  name="Stats"
                  dataKey="A"
                  stroke="#FF4B4B"
                  strokeWidth={4}
                  fill="#FF4B4B"
                  fillOpacity={0.6}
                  animationDuration={600}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Skills;
