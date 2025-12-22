
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import FloatingIcons from './components/FloatingIcons';
import GeminiBot from './components/GeminiBot';
import Arcade from './components/Arcade';
import Footer from './components/Footer';
import Blog from './components/Blog';
import Admin from './components/Admin';
import Achievements from './components/Achievements';
import ContactForm from './components/ContactForm';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'blog' | 'admin'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // Handle scrolling to a specific section after the home view is rendered
  useEffect(() => {
    if (view === 'home' && targetSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setTargetSection(null);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, targetSection]);

  const handleNavigate = (newView: 'home' | 'blog' | 'admin', sectionId?: string) => {
    if (newView === 'admin') {
      setShowLoginModal(true);
      return;
    }

    if (sectionId) {
      setTargetSection(sectionId);
    }

    if (view !== newView) {
      setView(newView);
      // Only scroll to top if we're not targeting a specific section
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sectionId) {
      // Already on the right view, just scroll
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordInput === 'actionbastion') {
      setView('admin');
      setShowLoginModal(false);
      setPasswordInput('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("WRONG CODE! Ninja Hattori is watching you! 🥷");
      setPasswordInput('');
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingIcons />
      <Navbar onNavigate={handleNavigate} currentView={view} />
      
      <main>
        {view === 'home' && (
          <>
            <Hero />
            <section id="about" className="py-32 px-6 bg-white border-y-8 border-black relative z-10 overflow-hidden">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/3 aspect-square cartoon-border overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform bg-[#FF4B4B] border-4 border-black shadow-[8px_8px_0px_#000]">
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
                </div>
              </div>
            </section>
            <Projects />
            <Achievements />
            <Arcade />
            <Skills />
            <section id="contact-banner" className="py-24 px-6 text-center bg-[#FF4B4B] relative z-10 border-t-8 border-black text-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 leading-none tracking-tighter">
                  Deploy <br /> <span className="text-[#FFD600]" style={{ WebkitTextStroke: '2px black' }}>With Me</span>
                </h2>
                
                <ContactForm />

                <div className="mt-20 flex flex-wrap justify-center gap-8 text-black font-black uppercase">
                  <div className="bg-white border-4 border-black px-6 py-2 rotate-1">Available 24/7</div>
                  <div className="bg-[#FFD600] border-4 border-black px-6 py-2 -rotate-1">Action Bastion Energy</div>
                  <div className="bg-[#00A1FF] text-white border-4 border-black px-6 py-2 rotate-2">22nd Century Tech</div>
                </div>
              </div>
            </section>
          </>
        )}
        {view === 'blog' && <Blog onBack={() => handleNavigate('home')} />}
        {view === 'admin' && <Admin onBack={() => handleNavigate('home')} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      
      {/* Secret Access Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border-[8px] border-black shadow-[20px_20px_0px_#FFD600] p-10 max-w-md w-full relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-6 -right-6 w-12 h-12 bg-red-500 text-white border-4 border-black font-black text-2xl flex items-center justify-center hover:scale-110 transition-transform"
            >
              ×
            </button>
            <h2 className="text-4xl font-black uppercase mb-6 tracking-tighter italic">Top Secret <br/> <span className="text-blue-600 underline">Access Required</span></h2>
            <p className="font-bold text-gray-600 mb-8">Enter the secret command to enter the Lab.</p>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <input 
                autoFocus
                type="password"
                placeholder="SECRET_KEY"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-4 border-4 border-black font-black text-2xl uppercase tracking-widest focus:bg-yellow-50 outline-none"
              />
              <button 
                type="submit"
                className="cartoon-btn w-full bg-black text-white py-4 font-black text-xl uppercase tracking-widest hover:bg-[#FF4B4B]"
              >
                Authenticate →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Improved Secret Door Trigger */}
      <div className="fixed bottom-0 left-0 z-[250] p-4 group">
        <button 
          onClick={() => handleNavigate('admin')}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] px-3 py-2 font-black uppercase border-2 border-white shadow-[4px_4px_0px_#FFD600] cursor-pointer"
        >
          Open Secret Lab
        </button>
      </div>
      
      <GeminiBot />
    </div>
  );
};

export default App;
