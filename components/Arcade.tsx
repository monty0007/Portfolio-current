
import React, { useState, useEffect, useRef, useCallback } from 'react';

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [obstacles, setObstacles] = useState<{ id: number, x: number, y: number, type: 'BUG' | 'COIN' }[]>([]);
  const [isPressingLeft, setIsPressingLeft] = useState(false);
  const [isPressingRight, setIsPressingRight] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const requestRef = useRef<number>(null);
  const frameCountRef = useRef<number>(0);

  const moveLeft = useCallback(() => setPlayerX(prev => Math.max(15, prev - 2.8)), []);
  const moveRight = useCallback(() => setPlayerX(prev => Math.min(85, prev + 2.8)), []);

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const update = () => {
      frameCountRef.current++;
      
      // Steering logic
      if (isPressingLeft) moveLeft();
      if (isPressingRight) moveRight();

      setObstacles(prev => {
        // Obstacles fall faster as speed increases
        const fallSpeed = 2.5 + speed;
        const moved = prev.map(obs => ({ ...obs, y: obs.y + fallSpeed }));
        const filtered = moved.filter(obs => obs.y < 120);

        // Dynamic spawning
        if (Math.random() < (0.04 + speed * 0.005) && frameCountRef.current % 8 === 0) {
          filtered.push({
            id: Math.random(),
            x: 20 + Math.random() * 60,
            y: -20,
            type: Math.random() > 0.25 ? 'BUG' : 'COIN'
          });
        }

        // Collision detection (fine-tuned hitboxes)
        filtered.forEach((obs, index) => {
          if (obs.y > 72 && obs.y < 92 && Math.abs(obs.x - playerX) < 10) {
            if (obs.type === 'COIN') {
              setScore(s => s + 50);
              filtered.splice(index, 1);
            } else {
              setGameState('GAMEOVER');
            }
          }
        });

        return filtered;
      });

      // Progression
      if (frameCountRef.current % 60 === 0) {
        setScore(s => s + 1);
        setSpeed(s => Math.min(8, s + 0.01));
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, isPressingLeft, isPressingRight, playerX, speed, moveLeft, moveRight]);

  // Global Key Listeners
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
    setObstacles([]);
    setPlayerX(50);
    setSpeed(1);
    setGameState('PLAYING');
    frameCountRef.current = 0;
  };

  return (
    <section className="py-20 px-4 bg-[#FF4B4B] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none" style={{ WebkitTextStroke: '2px black', textShadow: '6px 6px 0px #000' }}>
            TURBO <span className="text-[#FFD600]">GEN-AI</span> RACER
          </h2>
          <p className="text-white/80 font-black mt-4 uppercase tracking-[0.2em] text-xs">Awwwards Game Edition v2.0</p>
        </div>

        {/* Arcade Cabinet */}
        <div className="mx-auto w-full max-w-[440px] transform scale-[0.85] sm:scale-100 transition-all origin-top">
          <div className="bg-[#1A1A1A] border-[8px] border-black shadow-[15px_15px_0px_#000] rounded-t-[50px] overflow-hidden">
            
            <div className="bg-[#333] h-16 border-b-8 border-black flex items-center justify-between px-8">
              <div className="text-[#FFD600] font-black italic text-lg tracking-tighter">MANISHI.EXE</div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              </div>
            </div>

            <div className="p-3 bg-[#222]">
              <div className="crt-screen aspect-[4/5] relative bg-[#0f172a] rounded-xl border-4 border-[#333] overflow-hidden">
                
                {gameState === 'START' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
                    <div className="text-5xl mb-4 floating">🏎️</div>
                    <h3 className="text-[#FFD600] text-3xl font-black mb-2 italic">DRIVE FOR COMPUTE</h3>
                    <p className="text-white/60 font-bold uppercase text-[10px] mb-8 leading-tight tracking-widest">
                      Dodge the Bugs (👾) <br/> Collect Cells (🔋)
                    </p>
                    <button 
                      onClick={startGame}
                      className="cartoon-btn bg-[#FFD600] text-black px-8 py-3 font-black text-lg uppercase shadow-[4px_4px_0px_#000]"
                    >
                      Play Now
                    </button>
                  </div>
                )}

                {gameState === 'PLAYING' && (
                  <div className="w-full h-full relative bg-[#1e293b]">
                    <div className="absolute top-4 left-0 w-full flex justify-between px-4 z-40">
                      <div className="bg-black/40 backdrop-blur px-2 py-1 border-2 border-[#FFD600] text-[#FFD600] font-black text-xs uppercase">
                        Score: {score}
                      </div>
                      <div className="bg-black/40 backdrop-blur px-2 py-1 border-2 border-blue-400 text-blue-400 font-black text-xs uppercase">
                        Speed: {speed.toFixed(1)}x
                      </div>
                    </div>

                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-1/2 -translate-x-1/2 w-2 h-full flex flex-col gap-12 opacity-20" 
                           style={{ animation: `slideDown ${0.8 / speed}s linear infinite` }}>
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-full h-16 bg-white"></div>
                        ))}
                      </div>
                    </div>

                    <div 
                      className="absolute bottom-8 w-14 h-20 transition-all duration-75 ease-out z-20 flex flex-col items-center"
                      style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="w-full h-full bg-blue-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,0.5)] relative">
                        <div className="absolute top-1 left-1 w-3 h-4 bg-blue-300 border-2 border-black rounded-sm"></div>
                        <div className="absolute top-1 right-1 w-3 h-4 bg-blue-300 border-2 border-black rounded-sm"></div>
                        <div className="absolute -left-1.5 top-2 w-2 h-4 bg-black rounded-sm"></div>
                        <div className="absolute -right-1.5 top-2 w-2 h-4 bg-black rounded-sm"></div>
                        <div className="absolute -left-1.5 bottom-2 w-2 h-4 bg-black rounded-sm"></div>
                        <div className="absolute -right-1.5 bottom-2 w-2 h-4 bg-black rounded-sm"></div>
                      </div>
                      {speed > 3 && <div className="w-2 h-6 bg-red-500 animate-pulse mt-1 rounded-full blur-[2px]"></div>}
                    </div>

                    {obstacles.map(obs => (
                      <div 
                        key={obs.id}
                        className="absolute w-12 h-12 flex items-center justify-center text-3xl z-10"
                        style={{ left: `${obs.x}%`, top: `${obs.y}%` }}
                      >
                        {obs.type === 'BUG' ? (
                          <div className="p-1 bg-red-500 border-2 border-black rounded">👾</div>
                        ) : (
                          <div className="animate-bounce">🔋</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {gameState === 'GAMEOVER' && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-50">
                    <h3 className="text-red-500 text-4xl font-black mb-1 italic tracking-tighter">ENGINE BLOWN!</h3>
                    <p className="text-white text-lg font-bold mb-8 uppercase tracking-widest">Score: {score}</p>
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

            <div className="bg-[#444] p-8 border-t-8 border-black flex items-center justify-between relative shadow-[inset_0px_5px_15px_rgba(0,0,0,0.5)]">
              <div className="w-20 h-20 bg-[#222] rounded-full border-4 border-black flex items-center justify-center overflow-hidden">
                 <div className={`w-12 h-12 border-4 border-white rounded-full transition-transform duration-150 ${isPressingLeft ? '-rotate-45' : isPressingRight ? 'rotate-45' : ''}`}>
                    <div className="w-0.5 h-6 bg-red-500 mx-auto"></div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onMouseDown={() => setIsPressingLeft(true)}
                  onMouseUp={() => setIsPressingLeft(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsPressingLeft(true); }}
                  onTouchEnd={() => setIsPressingLeft(false)}
                  className="w-16 h-16 bg-red-600 rounded-full border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center text-white font-black text-2xl"
                >
                  L
                </button>
                <button 
                  onMouseDown={() => setIsPressingRight(true)}
                  onMouseUp={() => setIsPressingRight(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsPressingRight(true); }}
                  onTouchEnd={() => setIsPressingRight(false)}
                  className="w-16 h-16 bg-[#00A1FF] rounded-full border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center text-white font-black text-2xl"
                >
                  R
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100px); }
          to { transform: translateY(100px); }
        }
      `}</style>
    </section>
  );
};

export default Arcade;
