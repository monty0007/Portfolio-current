
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  const data = SKILLS.map(s => ({ subject: s.name, A: s.level, fullMark: 100 }));

  return (
    <section id="skills" className="py-24 px-6 bg-[#00A1FF] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-white">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-none">
            My Ninja <br /> Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SKILLS.map(skill => (
              <div key={skill.name} className="bg-white p-6 cartoon-border text-black">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-xl uppercase">{skill.name}</span>
                  <span className="font-black text-2xl text-[#FF4B4B]">{skill.level}%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-[500px] h-[500px] bg-white cartoon-border p-8 flex items-center justify-center relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 rotate-12 z-20">
            <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Stats&backgroundColor=FF4B4B" className="w-full h-full" alt="Icon" />
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#000" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontWeight: 'bold' }} />
              <Radar
                name="Developer"
                dataKey="A"
                stroke="#00A1FF"
                fill="#00A1FF"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Skills;
