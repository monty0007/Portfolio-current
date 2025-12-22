
import React, { useState, useEffect, useRef, useCallback } from 'react';

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<{ id: number, x: number, y: number, type: 'CHOCO' | 'PEPPER' }[]>([]);
  const [isPressingLeft, setIsPressingLeft] = useState(false);
  const [isPressingRight, setIsPressingRight] = useState(false);
  
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  const moveLeft = useCallback(() => setPlayerX(prev => Math.max(5, prev - 3)), []);
  const moveRight = useCallback(() => setPlayerX(prev => Math.min(95, prev + 3)), []);

  // Game Loop for smooth movement
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const update = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        if (isPressingLeft) moveLeft();
        if (isPressingRight) moveRight();

        setItems(prev => {
          const moved = prev.map(item => ({ ...item, y: item.y + 1.2 }));
          const filtered = moved.filter(item => item.y < 100);

          // Spawn items
          if (Math.random() < 0.03) {
            filtered.push({
              id: Math.random(),
              x: 10 + Math.random() * 80,
              y: -10,
              type: Math.random() > 0.3 ? 'CHOCO' : 'PEPPER'
            });
          }

          // Collisions
          filtered.forEach((item, index) => {
            if (item.y > 85 && item.y < 95 && Math.abs(item.x - playerX) < 12) {
              if (item.type === 'CHOCO') {
                setScore(s => s + 50);
                filtered.splice(index, 1);
              } else {
                setGameState('GAMEOVER');
              }
            }
          });

          return filtered;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, isPressingLeft, isPressingRight, playerX, moveLeft, moveRight]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIsPressingLeft(true);
      if (e.key === 'ArrowRight') setIsPressingRight(true);
      if (e.key === ' ' && gameState !== 'PLAYING') startGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIsPressingLeft(false);
      if (e.key === 'ArrowRight') setIsPressingRight(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setItems([]);
    setPlayerX(50);
    setGameState('PLAYING');
  };

  return (
    <section className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full halftone-bg opacity-20 pointer-events-none"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-black text-white px-6 py-2 font-black text-xl mb-4 transform -rotate-1">
            ARCADE MODE
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none">
            SHINCHAN <br /> <span className="text-white" style={{ WebkitTextStroke: '2px black' }}>CHOCO-DASH</span>
          </h2>
        </div>

        {/* Arcade Cabinet Container */}
        <div className="mx-auto w-full max-w-[450px] transform scale-[0.85] sm:scale-100 transition-transform">
          <div className="bg-[#1A1A1A] border-[8px] border-black shadow-[15px_15px_0px_#000] rounded-t-[50px] overflow-hidden">
            
            {/* Cabinet Header */}
            <div className="bg-[#333] h-16 border-b-8 border-black flex items-center justify-between px-8">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-[#FFD600] font-black italic tracking-widest text-sm">HI-SCORE: 99999</span>
            </div>

            {/* Screen Area */}
            <div className="p-6 bg-[#222]">
              <div className="crt-screen aspect-[4/3] relative bg-[#0a0a0a] rounded-xl border-4 border-[#333] overflow-hidden">
                
                {gameState === 'START' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600" className="w-32 h-32 mb-6 floating" alt="Shinchan" />
                    <h3 className="text-[#FFD600] text-3xl font-black mb-4 animate-pulse">INSERT COIN</h3>
                    <p className="text-white text-xs font-bold opacity-70 uppercase mb-6">Collect Choco-Chips! <br/> Avoid Green Peppers!</p>
                    <button 
                      onClick={startGame}
                      className="cartoon-btn bg-[#FF4B4B] text-white px-8 py-3 font-black text-lg uppercase shadow-[4px_4px_0px_#000]"
                    >
                      Play Now
                    </button>
                  </div>
                )}

                {gameState === 'PLAYING' && (
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#001] to-[#112]">
                    <div className="absolute top-4 right-4 text-[#FFD600] font-black text-2xl z-20">
                      {score}
                    </div>
                    
                    {/* Player */}
                    <div 
                      className="absolute bottom-6 w-16 h-16 transition-all duration-100 ease-out z-20"
                      style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
                    >
                      <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600" className="w-full h-full" alt="Shinchan" />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 rounded-full blur-sm"></div>
                    </div>

                    {/* Falling Items */}
                    {items.map(item => (
                      <div 
                        key={item.id}
                        className="absolute w-10 h-10 flex items-center justify-center text-2xl"
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      >
                        {item.type === 'CHOCO' ? '🍪' : '🫑'}
                      </div>
                    ))}
                  </div>
                )}

                {gameState === 'GAMEOVER' && (
                  <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-white text-5xl font-black mb-2 tracking-tighter">GAME OVER</h3>
                    <p className="text-[#FFD600] text-2xl font-black mb-8">SCORE: {score}</p>
                    <button 
                      onClick={startGame}
                      className="cartoon-btn bg-white text-black px-8 py-3 font-black text-lg uppercase"
                    >
                      Restart
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel */}
            <div className="bg-[#444] p-10 border-t-8 border-black flex items-center justify-between relative">
              {/* Joystick */}
              <div className="relative w-24 h-24 bg-[#222] rounded-full border-4 border-black flex items-center justify-center">
                <div 
                  className={`w-12 h-12 bg-red-600 rounded-full border-4 border-black shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.5)] transition-transform ${isPressingLeft ? '-translate-x-4 rotate-[-20deg]' : isPressingRight ? 'translate-x-4 rotate-[20deg]' : ''}`}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6">
                <button 
                  onMouseDown={() => setIsPressingLeft(true)}
                  onMouseUp={() => setIsPressingLeft(false)}
                  onMouseLeave={() => setIsPressingLeft(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsPressingLeft(true); }}
                  onTouchEnd={() => setIsPressingLeft(false)}
                  className={`w-16 h-16 bg-[#FF4B4B] rounded-full border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center text-white font-black text-2xl`}
                >
                  L
                </button>
                <button 
                  onMouseDown={() => setIsPressingRight(true)}
                  onMouseUp={() => setIsPressingRight(false)}
                  onMouseLeave={() => setIsPressingRight(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsPressingRight(true); }}
                  onTouchEnd={() => setIsPressingRight(false)}
                  className={`w-16 h-16 bg-[#00A1FF] rounded-full border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center text-white font-black text-2xl`}
                >
                  R
                </button>
              </div>
            </div>
          </div>
          
          {/* Base */}
          <div className="h-10 bg-[#111] mx-4 border-x-8 border-black"></div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white border-4 border-black px-6 py-2 shadow-[6px_6px_0px_#000]">
            <span className="font-black">CONTROLS:</span>
            <kbd className="bg-gray-200 px-2 py-1 border-2 border-black font-bold">←</kbd>
            <kbd className="bg-gray-200 px-2 py-1 border-2 border-black font-bold">→</kbd>
            <span className="text-gray-400">|</span>
            <span className="font-bold">TAP BUTTONS ON SCREEN</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
