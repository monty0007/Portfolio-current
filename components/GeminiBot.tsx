import React, { useState, useRef, useEffect } from 'react';
import { askPortfolioAssistant } from '../services/gemini';

const GeminiBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Buriburi! Ask me anything about this awesome portfolio! 🐷✨' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading, isOpen]);

  // Hide bot when inside #projects section
  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const isInsideProjects = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
        setIsHidden(isInsideProjects);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askPortfolioAssistant(userMsg);
    setChat(prev => [...prev, { role: 'bot', text: response || 'Uh oh, gadget failed!' }]);
    setLoading(false);
  };

  const handleClear = () => {
    setChat([{ role: 'bot', text: 'Buriburi! Chat cleared! Ready for new questions! 🐷' }]);
  };

  if (isHidden && !isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] transition-opacity duration-300 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {isOpen ? (
        <div className="w-[350px] max-w-[90vw] bg-white border-4 border-black shadow-[8px_8px_0px_#000] h-[450px] flex flex-col mb-4 overflow-hidden">
          <div className="bg-[#FFD600] p-4 border-b-4 border-black flex justify-between items-center">
            <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 rounded-full border-2 border-black"></span>
              POCKET ASSISTANT
            </h3>
            <div className="flex gap-2">
              <button onClick={handleClear} aria-label="Clear chat history" className="font-bold text-xs bg-black text-white px-2 py-1 hover:bg-red-500 uppercase">Clear</button>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-black border-2 border-black hover:bg-black hover:scale-90 transition-all shadow-[2px_2px_0px_#000]">×</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-yellow-50">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 border-2 border-black shadow-[4px_4px_0px_#000] font-medium ${msg.role === 'user' ? 'bg-[#00A1FF] text-white' : 'bg-white text-black'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-black p-3 animate-pulse">Thinking... 🧠</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t-4 border-black flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something..."
              className="flex-1 p-2 border-2 border-black focus:outline-none"
            />
            <button onClick={handleSend} aria-label="Send message" className="bg-black text-white px-4 py-2 font-bold hover:bg-red-500 transition-colors">
              SEND
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="w-20 h-20 bg-[#FFD600] border-4 border-black cartoon-border-hover transition-all cartoon-border rounded-full flex items-center justify-center overflow-hidden"
        >
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=ShinchanAssistant" className="w-14 h-14" alt="Bot" />
        </button>
      )}
    </div>
  );
};

export default GeminiBot;
