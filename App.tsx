import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingIcons from './components/FloatingIcons';
import GeminiBot from './components/GeminiBot';
import Footer from './components/Footer';
import Blog from './components/Blog';
import Admin from './components/Admin';
import Home from './components/Home';

const AppContent: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleNavigate = (newView: 'home' | 'blog' | 'admin', sectionId?: string) => {
    if (newView === 'admin') {
      setShowLoginModal(true);
      return;
    }

    if (newView === 'blog') {
       navigate('/blog');
       return;
    }

    if (newView === 'home') {
      if (location.pathname !== '/') {
         navigate('/');
         if (sectionId) setTargetSection(sectionId);
         else window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
         if (sectionId) {
           const element = document.getElementById(sectionId);
           element?.scrollIntoView({ behavior: 'smooth' });
         } else {
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }
      }
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordInput === '1234') { 
      setShowLoginModal(false);
      setPasswordInput('');
      navigate('/admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      alert("WRONG CODE! Ninja Hattori is watching you! 🥷");
      setPasswordInput('');
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingIcons />
      <Navbar onNavigate={handleNavigate} currentView={location.pathname === '/blog' ? 'blog' : location.pathname === '/admin' ? 'admin' : 'home'} />
      
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home targetSection={targetSection} setTargetSection={setTargetSection} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin onBack={() => handleNavigate('home')} />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} />
      
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
            <p className="font-bold text-gray-600 mb-8">Enter the secret command to enter the Lab. Hint: 1234</p>
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

      <div className="fixed bottom-0 left-0 z-[250] p-4 group">
        <button 
          onClick={() => setShowLoginModal(true)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] px-3 py-2 font-black uppercase border-2 border-white shadow-[4px_4px_0px_#FFD600] cursor-pointer"
        >
          Open Secret Lab
        </button>
      </div>
      
      <GeminiBot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
