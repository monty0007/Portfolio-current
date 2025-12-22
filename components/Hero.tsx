
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-6xl w-full text-center z-10">
        <div className="inline-block bg-[#FF4B4B] text-white px-4 py-2 text-md font-black cartoon-btn mb-6 rotate-[-2deg] shadow-none">
          HELLO! I AM MANISHI YADAV
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black leading-tight mb-8 uppercase tracking-tighter">
          GEN AI <br />
          <span className="text-[#00A1FF] transition-all hover:scale-110 inline-block" style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px #000' }}>ENGINEER</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl md:text-3xl font-bold mb-12 text-gray-800 leading-relaxed bg-white/50 backdrop-blur-sm p-6 cartoon-border inline-block">
          Training models to think, creating agents to build, and <br />
          <span className="text-blue-600">Doraemon-ing</span> the future of software with Generative AI.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <button className="cartoon-btn bg-[#FFD600] text-black text-2xl font-black px-12 py-6 uppercase">
            See My Models
          </button>
          <button className="cartoon-btn bg-white text-black text-2xl font-black px-12 py-6 uppercase">
            Let's Talk Shop
          </button>
        </div>
      </div>
      
      {/* Interactive bouncy icons */}
      <div className="absolute top-[20%] left-[5%] w-32 h-32 bouncy cursor-pointer hover:rotate-12 transition-transform">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600" alt="Shinchan" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-[25%] right-[5%] w-40 h-40 bouncy cursor-pointer hover:-rotate-12 transition-transform" style={{ animationDelay: '1.5s' }}>
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF" alt="Doraemon" className="w-full h-full object-contain" />
      </div>
    </section>
  );
};

export default Hero;
