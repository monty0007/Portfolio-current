
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import FloatingIcons from './components/FloatingIcons';
import GeminiBot from './components/GeminiBot';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <FloatingIcons />
      <Navbar />
      
      <main>
        <Hero />
        
        <section id="about" className="py-32 px-6 bg-white border-y-8 border-black relative z-10 overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/3 aspect-square cartoon-border overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform bg-[#FF4B4B]">
               <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=ManishiYadav&backgroundColor=FF4B4B" alt="Manishi Yadav" className="w-full h-full scale-110" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-6 py-2 bg-yellow-400 border-4 border-black font-black uppercase text-xl mb-8 transform -rotate-1">
                The Architect
              </div>
              <p className="text-3xl md:text-5xl font-black leading-tight mb-8">
                I build machines that <span className="text-blue-600 underline decoration-8">imagine</span> things.
              </p>
              <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed mb-12">
                Manishi Yadav here! Based in the digital clouds. I turn complex neural architectures into playful, robust tools that feel as intuitive as Doraemon's magic pocket gadgets.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-black bg-red-400"></div>
                <div className="w-12 h-12 rounded-full border-4 border-black bg-blue-400"></div>
                <div className="w-12 h-12 rounded-full border-4 border-black bg-yellow-400"></div>
              </div>
            </div>
          </div>
        </section>

        <Projects />
        <Skills />

        <section id="contact" className="py-40 px-6 text-center bg-[#FF4B4B] relative z-10 border-t-8 border-black text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-7xl md:text-9xl font-black uppercase mb-12 leading-none">
              Deploy <br /> <span className="text-[#FFD600]" style={{ WebkitTextStroke: '2px black' }}>With Me</span>
            </h2>
            <p className="text-3xl font-bold mb-16 max-w-2xl mx-auto leading-tight">
              Ready to optimize your workflow with custom AI agents? Drop a message in my magic pocket!
            </p>
            <a 
              href="mailto:monty.my1234@gmail.com" 
              className="cartoon-btn inline-block bg-white text-black text-4xl font-black px-16 py-10 uppercase hover:bg-black hover:text-white"
            >
              Email Manishi
            </a>
            
            <div className="mt-32 flex justify-center gap-16 font-black text-3xl uppercase underline decoration-8">
              <a href="#" className="hover:text-yellow-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-400 transition-colors">X (Twitter)</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-black text-white text-center font-black tracking-[0.3em] text-sm uppercase">
        © {new Date().getFullYear()} MANISHI YADAV — BUILT WITH GEN-AI MAGIC
      </footer>

      <GeminiBot />
    </div>
  );
};

export default App;
