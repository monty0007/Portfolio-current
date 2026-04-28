import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import Projects from './Projects';
import Skills from './Skills';
import Arcade from './Arcade';
import Achievements from './Achievements';
import ContactForm from './ContactForm';

interface HomeProps {
    targetSection: string | null;
    setTargetSection: (section: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ targetSection, setTargetSection }) => {
    const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');

    useEffect(() => {
        const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
        window.addEventListener('portfolioThemeChange', handler);
        return () => window.removeEventListener('portfolioThemeChange', handler);
    }, []);

    useEffect(() => {
        if (targetSection) {
            const timer = setTimeout(() => {
                const element = document.getElementById(targetSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTargetSection(null);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [targetSection, setTargetSection]);

    return (
        <>
            <Hero />

            <section id="about" className={`px-6 ${isDark ? 'bg-black border-b-8 border-[#FFD600]' : 'bg-[#FFF9E6] border-b-8 border-black'} relative z-10 overflow-hidden`}>
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 py-20 relative z-10">
                    <div className={`w-full md:w-1/3 aspect-square overflow-hidden rotate-[-3deg] hover:rotate-0 transition-transform bg-[#FF4B4B] ${isDark ? 'border-4 border-[#FFD600] shadow-[8px_8px_0px_rgba(255,214,0,0.3)]' : 'border-4 border-black shadow-[8px_8px_0px_#000]'}`}>
                        <img
                            src="/weeww.webp"
                            alt="Manish Yadav"
                            width={534}
                            height={534}
                            fetchPriority="high"
                            loading="eager"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`inline-block px-5 py-2 bg-[#FFD600] text-black ${isDark ? 'border-4 border-[#FFD600] shadow-[4px_4px_0px_rgba(255,214,0,0.3)]' : 'border-4 border-black shadow-[4px_4px_0px_#000]'} font-black uppercase text-lg transform -rotate-1`}>
                                The Architect
                            </div>
                            <div className="flex gap-1">
                                <div className={`w-3 h-3 bg-[#FF4B4B] rounded-full border-2 ${isDark ? 'border-white/20' : 'border-black/20'}`}></div>
                                <div className={`w-3 h-3 bg-[#FFD600] rounded-full border-2 ${isDark ? 'border-white/20' : 'border-black/20'}`}></div>
                                <div className={`w-3 h-3 bg-[#00A1FF] rounded-full border-2 ${isDark ? 'border-white/20' : 'border-black/20'}`}></div>
                            </div>
                        </div>
                        <p className={`text-3xl md:text-5xl font-black leading-tight mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                            I build AI-powered systems that <span className="text-[#FFD600] underline decoration-8 decoration-[#FFD600]/40">simplify</span> work.
                        </p>
                        <p className={`text-xl md:text-2xl font-medium ${isDark ? 'text-white/60' : 'text-black/60'} leading-relaxed mb-8`}>
                            I design and connect intelligent workflows using Power Platform, GenAI, automation, and modern full-stack tools—turning complex logic into solutions that feel simple to use.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className={`px-3 py-1.5 font-black uppercase text-xs border-2 transition-colors ${isDark ? 'bg-white/10 text-white border-white/20 hover:border-white/50' : 'bg-black text-white border-black hover:bg-black/80'}`}>Power Platform</span>
                            <span className={`px-3 py-1.5 font-black uppercase text-xs border-2 transition-colors ${isDark ? 'bg-[#FF4B4B]/20 text-white border-[#FF4B4B]/50 hover:border-[#FF4B4B]' : 'bg-[#FF4B4B] text-white border-black hover:bg-red-400'}`}>GenAI</span>
                            <span className={`px-3 py-1.5 font-black uppercase text-xs border-2 transition-colors ${isDark ? 'bg-[#00A1FF]/20 text-white border-[#00A1FF]/50 hover:border-[#00A1FF]' : 'bg-[#00A1FF] text-white border-black hover:bg-blue-400'}`}>Agentic Workflows</span>
                            <span className={`px-3 py-1.5 font-black uppercase text-xs border-2 transition-colors ${isDark ? 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/50 hover:border-[#FFD600]' : 'bg-[#FFD600] text-black border-black hover:bg-yellow-300'}`}>Full-Stack</span>
                        </div>
                    </div>
                </div>
            </section>

            <Projects />

            <div className="bg-[#FFD600]/40 backdrop-blur-sm border-y-8 border-black">
                <Achievements />
            </div>

            <div className="bg-[#00A1FF]/40 backdrop-blur-sm">
                <Skills />
            </div>

            <Arcade />

            <section id="contact-banner" className="py-24 px-6 text-center bg-[#FF4B4B]/80 backdrop-blur-lg relative z-10 border-t-8 border-black text-white">
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
    );
};

export default Home;
