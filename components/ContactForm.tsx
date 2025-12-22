
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'RAG Gadget',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => {
      setFormState('success');
      setFormData({ name: '', email: '', subject: 'RAG Gadget', message: '' });
      setTimeout(() => setFormState('idle'), 5000);
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="bg-white border-[6px] md:border-[8px] border-black p-8 md:p-12 shadow-[15px_15px_0px_#000] md:shadow-[20px_20px_0px_#000] rotate-1 animate-in zoom-in duration-300 text-black mx-auto max-w-xl">
        <div className="text-6xl md:text-8xl mb-6">🚀</div>
        <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 italic">Action Bastion!</h3>
        <p className="text-lg md:text-xl font-bold text-gray-700">Message beamed to Manishi's Lab. Expect a ping soon!</p>
        <button 
          onClick={() => setFormState('idle')}
          className="mt-10 cartoon-btn bg-black text-white px-8 py-3 font-black uppercase w-full sm:w-auto"
        >
          Send Another Signal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white border-[6px] md:border-[8px] border-black p-6 md:p-12 shadow-[15px_15px_0px_#000] md:shadow-[25px_25px_0px_#000] relative text-left text-black">
      <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 bg-[#FFD600] border-2 md:border-4 border-black px-3 md:px-4 py-1 font-black uppercase text-[10px] md:text-sm -rotate-2">
        Secret Mission Protocol
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 text-black">Ninja Name</label>
            <input 
              required
              type="text" 
              placeholder="Who are you?"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 md:p-4 border-[3px] md:border-4 border-black font-bold focus:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all text-black placeholder-gray-400 text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 text-black">Signal (Email)</label>
            <input 
              required
              type="email" 
              placeholder="How do I reach you?"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 md:p-4 border-[3px] md:border-4 border-black font-bold focus:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all text-black placeholder-gray-400 text-sm md:text-base"
            />
          </div>
        </div>

        <div>
          <label className="block font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 text-black">Gadget of Interest</label>
          <div className="relative">
            <select 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full p-3 md:p-4 border-[3px] md:border-4 border-black font-bold focus:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white text-black text-sm md:text-base appearance-none"
            >
              <option>RAG Gadget</option>
              <option>Agentic Workflow</option>
              <option>Visual Prompting</option>
              <option>Custom AI Magic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="block font-black uppercase text-[10px] md:text-xs mb-1 md:mb-2 text-black">Mission Brief (Message)</label>
          <textarea 
            required
            rows={4}
            placeholder="Tell me about your project..."
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full p-3 md:p-4 border-[3px] md:border-4 border-black font-bold focus:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all text-black placeholder-gray-400 text-sm md:text-base"
          />
        </div>

        <button 
          disabled={formState === 'sending'}
          type="submit" 
          className="cartoon-btn w-full bg-[#00A1FF] text-white py-4 md:py-6 font-black text-xl md:text-3xl uppercase tracking-tighter shadow-[6px_6px_0px_#000] md:shadow-[10px_10px_0px_#000] hover:bg-[#FF4B4B] disabled:opacity-50"
        >
          {formState === 'sending' ? 'BEAMING...' : 'SEND SIGNAL →'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
