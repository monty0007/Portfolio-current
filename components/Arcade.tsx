
import React, { useState, useEffect, useRef, useCallback } from 'react';

type GameType = 'RACER' | 'SNAKE' | 'PACMAN' | 'COLLECTOR';

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('RACER');
  const [isBooting, setIsBooting] = useState(false);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [moveDir, setMoveDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [entities, setEntities] = useState<any[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [speed, setSpeed] = useState(1);

  const requestRef = useRef<number>(null);
  const frameCountRef = useRef<number>(0);

  const switchGame = (type: GameType) => {
    if (activeGame === type || isBooting) return;
    setIsBooting(true);
    setGameState('START');
    setTimeout(() => {
      setActiveGame(type);
      setIsBooting(false);
    }, 800);
  };

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    setSpeed(1);
    frameCountRef.current = 0;

    if (activeGame === 'RACER') {
      setPlayerPos({ x: 50, y: 80 });
      setEntities([]);
      setMoveDir({ x: 0, y: 0 });
    } else if (activeGame === 'SNAKE') {
      setPlayerPos({ x: 50, y: 50 });
      setMoveDir({ x: 5, y: 0 });
      setEntities([{ x: 45, y: 50 }, { x: 40, y: 50 }, { x: 80, y: 50, type: 'FOOD' }]);
    } else if (activeGame === 'PACMAN') {
      setPlayerPos({ x: 50, y: 80 });
      setMoveDir({ x: 0, y: 0 });
      const dots = Array.from({ length: 15 }, () => ({
        id: Math.random(),
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 65,
        type: 'DOT'
      }));
      setEntities([...dots, { id: 'ghost', x: 50, y: 20, type: 'GHOST' }]);
    } else if (activeGame === 'COLLECTOR') {
      setPlayerPos({ x: 50, y: 85 });
      setEntities([]);
      setMoveDir({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const update = () => {
      frameCountRef.current++;

      if (activeGame === 'RACER') {
        setPlayerPos(prev => ({ ...prev, x: Math.max(15, Math.min(85, prev.x + (moveDir.x * 2.5))) }));
        setEntities(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + (3 + speed) }));
          const filtered = moved.filter(e => e.y < 110);
          if (Math.random() < 0.1 && frameCountRef.current % 8 === 0) {
            filtered.push({ id: Math.random(), x: 20 + Math.random() * 60, y: -10, type: Math.random() > 0.3 ? 'BUG' : 'COIN' });
          }
          filtered.forEach((e, i) => {
            if (e.y > 75 && e.y < 95 && Math.abs(e.x - playerPos.x) < 8) {
              if (e.type === 'COIN') { setScore(s => s + 100); filtered.splice(i, 1); }
              else { setGameState('GAMEOVER'); }
            }
          });
          return filtered;
        });
        setSpeed(s => Math.min(8, s + 0.002));
      } 
      
      else if (activeGame === 'SNAKE') {
        const snakeSpeed = Math.max(3, 10 - Math.floor(score / 4));
        if (frameCountRef.current % snakeSpeed === 0) {
          setPlayerPos(prevHead => {
            const nextHead = { x: prevHead.x + moveDir.x, y: prevHead.y + moveDir.y };
            if (nextHead.x < 0 || nextHead.x > 95 || nextHead.y < 0 || nextHead.y > 95) { setGameState('GAMEOVER'); return prevHead; }
            setEntities(ents => {
              const body = ents.filter(e => !e.type);
              const food = ents.find(e => e.type === 'FOOD');
              if (body.some(s => Math.abs(s.x - nextHead.x) < 2 && Math.abs(s.y - nextHead.y) < 2)) { setGameState('GAMEOVER'); return ents; }
              if (food && Math.abs(food.x - nextHead.x) < 5 && Math.abs(food.y - nextHead.y) < 5) {
                setScore(s => s + 1);
                return [prevHead, ...body, { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80, type: 'FOOD' }];
              }
              return [prevHead, ...body.slice(0, -1), food];
            });
            return nextHead;
          });
        }
      }

      else if (activeGame === 'PACMAN') {
        setPlayerPos(p => ({ x: Math.max(5, Math.min(95, p.x + moveDir.x * 2)), y: Math.max(5, Math.min(95, p.y + moveDir.y * 2)) }));
        setEntities(prev => {
          const next = prev.map(e => {
            if (e.type === 'GHOST') {
              const dx = playerPos.x - e.x;
              const dy = playerPos.y - e.y;
              const angle = Math.atan2(dy, dx);
              const nx = e.x + Math.cos(angle) * 0.85;
              const ny = e.y + Math.sin(angle) * 0.85;
              if (Math.abs(nx - playerPos.x) < 5 && Math.abs(ny - playerPos.y) < 5) setGameState('GAMEOVER');
              return { ...e, x: nx, y: ny };
            }
            return e;
          });
          const remaining = next.filter(e => {
            if (e.type === 'DOT') {
              const hit = Math.abs(e.x - playerPos.x) < 5 && Math.abs(e.y - playerPos.y) < 5;
              if (hit) setScore(s => s + 10);
              return !hit;
            }
            return true;
          });
          if (remaining.filter(e => e.type === 'DOT').length === 0) {
             setScore(s => s + 500);
             return [...remaining, ...Array.from({length: 15}, () => ({ id: Math.random(), x: 15 + Math.random() * 70, y: 15 + Math.random() * 65, type: 'DOT' }))];
          }
          return remaining;
        });
      }

      else if (activeGame === 'COLLECTOR') {
        setPlayerPos(p => ({ ...p, x: Math.max(10, Math.min(90, p.x + moveDir.x * 3)) }));
        setEntities(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + (2 + speed * 0.6) }));
          const filtered = moved.filter(e => e.y < 110);
          if (Math.random() < 0.1 && frameCountRef.current % 12 === 0) {
            filtered.push({ id: Math.random(), x: 10 + Math.random() * 80, y: -5, type: Math.random() > 0.2 ? 'GADGET' : 'GHOST' });
          }
          filtered.forEach((e, i) => {
            if (e.y > 80 && e.y < 95 && Math.abs(e.x - playerPos.x) < 10) {
              if (e.type === 'GADGET') { setScore(s => s + 100); filtered.splice(i, 1); }
              else { setGameState('GAMEOVER'); }
            }
          });
          return filtered;
        });
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, activeGame, moveDir, playerPos, speed, entities, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (activeGame === 'SNAKE') {
        if (e.key === 'ArrowLeft' && moveDir.x === 0) setMoveDir({ x: -5, y: 0 });
        if (e.key === 'ArrowRight' && moveDir.x === 0) setMoveDir({ x: 5, y: 0 });
        if (e.key === 'ArrowUp' && moveDir.y === 0) setMoveDir({ x: 0, y: -5 });
        if (e.key === 'ArrowDown' && moveDir.y === 0) setMoveDir({ x: 0, y: 5 });
      } else {
        if (e.key === 'ArrowLeft') setMoveDir({ x: -1, y: 0 });
        if (e.key === 'ArrowRight') setMoveDir({ x: 1, y: 0 });
        if (e.key === 'ArrowUp') setMoveDir({ x: 0, y: -1 });
        if (e.key === 'ArrowDown') setMoveDir({ x: 0, y: 1 });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (activeGame !== 'SNAKE') {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) setMoveDir(p => ({ ...p, x: 0 }));
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) setMoveDir(p => ({ ...p, y: 0 }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [gameState, activeGame, moveDir]);

  return (
    <section className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">
        
        <div className="flex lg:flex-col gap-4 order-2 lg:order-1">
          {(['RACER', 'SNAKE', 'PACMAN', 'COLLECTOR'] as GameType[]).map(type => (
            <button key={type} onClick={() => switchGame(type)}
              className={`cartoon-btn px-6 py-4 font-black text-sm uppercase transition-all duration-300 min-w-[140px] ${activeGame === type ? 'bg-[#FF4B4B] text-white -translate-x-2' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {type === 'RACER' && '🏎️ Racer'}
              {type === 'SNAKE' && '🐍 Snake'}
              {type === 'PACMAN' && '🟡 Pacman'}
              {type === 'COLLECTOR' && '🚁 Gadget'}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[480px] order-1 lg:order-2 perspective-1000">
          <div className="bg-[#1A1A1A] border-[10px] border-black shadow-[25px_25px_0px_#000] rounded-t-[60px] overflow-hidden relative">
            <div className="bg-[#333] h-14 border-b-8 border-black flex items-center justify-between px-10">
              <div className="text-[#FFD600] font-black italic text-lg tracking-tighter uppercase">NEURAL_ARCADE v5.0</div>
            </div>

            <div className="p-4 bg-[#222]">
              <div className="crt-screen aspect-[4/5] relative bg-[#000] rounded-2xl border-4 border-[#333] overflow-hidden">
                {isBooting ? (
                  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8 z-[60]">
                    <div className="text-[#0f0] font-mono text-xs w-full overflow-hidden whitespace-nowrap animate-typing">
                      {'>'} BOOTING SECTOR 0xFF...<br/>{'>'} SYNCING NEURAL NET...
                    </div>
                  </div>
                ) : (
                  <>
                    {gameState === 'START' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-30 bg-black/40 backdrop-blur-[2px]">
                        <div className="text-7xl mb-6 floating drop-shadow-[0_0_15px_white]">
                          {activeGame === 'RACER' && '🏎️'} {activeGame === 'SNAKE' && '🐍'} {activeGame === 'PACMAN' && '🟡'} {activeGame === 'COLLECTOR' && '🚁'}
                        </div>
                        <h3 className="text-white text-4xl font-black mb-1 italic uppercase tracking-tighter" style={{ WebkitTextStroke: '1px black' }}>{activeGame}</h3>
                        <button onClick={startGame} className="cartoon-btn bg-[#FF4B4B] text-white px-12 py-5 font-black text-2xl uppercase mt-8">PUSH START</button>
                      </div>
                    )}

                    {gameState === 'PLAYING' && (
                      <div className="w-full h-full relative">
                        <div className="absolute top-4 left-4 z-40 bg-black/80 border-2 border-[#FFD600] px-3 py-1 text-[#FFD600] font-black text-xs uppercase shadow-lg">
                          SC: {score} | HI: {highScore}
                        </div>
                        {activeGame === 'RACER' && (
                          <div className="w-full h-full bg-[#1e293b] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                              <div className="absolute left-1/2 -translate-x-1/2 w-3 h-full flex flex-col gap-10 opacity-40 animate-roadMove">
                                {[...Array(15)].map((_, i) => <div key={i} className="w-full h-12 bg-white"></div>)}
                              </div>
                            </div>
                            <div className="absolute bottom-10 w-12 h-16 bg-[#00A1FF] border-2 border-black rounded shadow-[3px_3px_0px_#000] z-20" style={{ left: `${playerPos.x}%`, transform: 'translateX(-50%)' }}></div>
                            {entities.map(e => <div key={e.id} className="absolute text-2xl z-10" style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>{e.type === 'BUG' ? '👾' : '🔋'}</div>)}
                          </div>
                        )}
                        {activeGame === 'SNAKE' && (
                          <div className="w-full h-full bg-black relative border-4 border-green-900/40">
                            <div className="absolute w-4 h-4 bg-green-400 border border-black z-30" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}></div>
                            {entities.map((ent, i) => (
                              <div key={i} className={`absolute ${ent.type === 'FOOD' ? 'w-5 h-5 bg-red-500 animate-pulse rounded-full border border-white' : 'w-4 h-4 bg-green-700 opacity-60 border border-black'}`} style={{ left: `${ent.x}%`, top: `${ent.y}%` }}></div>
                            ))}
                          </div>
                        )}
                        {activeGame === 'PACMAN' && (
                          <div className="w-full h-full bg-[#000033] relative border-4 border-blue-900/50 overflow-hidden">
                            <div className="absolute text-3xl z-30" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}>🟡</div>
                            {entities.map((e, i) => (
                              <div key={i} className={`absolute flex items-center justify-center ${e.type === 'GHOST' ? 'text-2xl animate-bounce' : 'w-2 h-2 bg-yellow-100 rounded-full'}`} style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>{e.type === 'GHOST' ? '👻' : ''}</div>
                            ))}
                          </div>
                        )}
                        {activeGame === 'COLLECTOR' && (
                          <div className="w-full h-full bg-[#FFF9E6] relative overflow-hidden">
                            <div className="absolute bottom-6 w-16 h-16 z-20" style={{ left: `${playerPos.x}%`, transform: 'translateX(-50%)' }}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan" className="w-full h-full" alt="P" /></div>
                            {entities.map(e => <div key={e.id} className="absolute text-3xl z-10" style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}>{e.type === 'GADGET' ? '🚁' : '👹'}</div>)}
                          </div>
                        )}
                      </div>
                    )}

                    {gameState === 'GAMEOVER' && (
                      <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-50">
                        <h3 className="text-white text-5xl font-black mb-10 italic tracking-tighter uppercase">WASTED!</h3>
                        <button onClick={startGame} className="cartoon-btn bg-white text-black px-12 py-5 font-black text-2xl uppercase hover:bg-[#FFD600]">TRY AGAIN</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#444] px-8 py-12 border-t-[10px] border-black shadow-[inset_0px_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-8 relative z-10">
                <div className="relative w-36 h-36 flex items-center justify-center">
                   <div className="absolute w-12 h-32 bg-[#222] border-4 border-black rounded-lg"></div>
                   <div className="absolute w-32 h-12 bg-[#222] border-4 border-black rounded-lg"></div>
                   <button onMouseDown={() => { if (activeGame === 'SNAKE' && moveDir.y === 0) setMoveDir({x: 0, y: -5}); else if (activeGame !== 'SNAKE') setMoveDir({x: 0, y: -1}); }} className="absolute top-1 w-10 h-10 text-white text-xl">▲</button>
                   <button onMouseDown={() => { if (activeGame === 'SNAKE' && moveDir.y === 0) setMoveDir({x: 0, y: 5}); else if (activeGame !== 'SNAKE') setMoveDir({x: 0, y: 1}); }} className="absolute bottom-1 w-10 h-10 text-white text-xl">▼</button>
                   <button onMouseDown={() => { if (activeGame === 'SNAKE' && moveDir.x === 0) setMoveDir({x: -5, y: 0}); else if (activeGame !== 'SNAKE') setMoveDir({x: -1, y: 0}); }} className="absolute left-1 w-10 h-10 text-white text-xl">◀</button>
                   <button onMouseDown={() => { if (activeGame === 'SNAKE' && moveDir.x === 0) setMoveDir({x: 5, y: 0}); else if (activeGame !== 'SNAKE') setMoveDir({x: 1, y: 0}); }} className="absolute right-1 w-10 h-10 text-white text-xl">▶</button>
                </div>
                <button onClick={() => gameState !== 'PLAYING' && startGame()} className="w-20 h-20 bg-red-600 rounded-full border-[6px] border-black shadow-[8px_8px_0px_#000] active:translate-y-2 text-white font-black text-xl">A</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes roadMove {
          from { transform: translate(-50%, -50px); }
          to { transform: translate(-50%, 0px); }
        }
        .animate-roadMove { animation: roadMove 0.4s linear infinite; }
      `}</style>
    </section>
  );
};

export default Arcade;
