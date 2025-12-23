
import React, { useState, useEffect, useRef } from 'react';

// Animated Sprite Component
const NeuralNinja: React.FC<{ 
  facing: 'left' | 'right', 
  isWalking: boolean, 
  isJumping: boolean,
  isPowered: boolean 
}> = ({ facing, isWalking, isJumping, isPowered }) => {
  return (
    <div className={`w-full h-full relative transition-all duration-300 ${isJumping ? 'scale-110 -rotate-3' : ''}`}>
      <div 
        className={`absolute inset-0 border-[3px] border-white rounded-xl flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.4)] transition-colors duration-300 ${isPowered ? 'bg-yellow-400' : 'bg-black'}`}
      >
        <div className={`absolute top-1 w-full h-4 border-y-2 border-white flex justify-center ${isPowered ? 'bg-red-500' : 'bg-[#FF4B4B]'}`}>
           <div className={`w-1 h-5 border-2 border-white absolute -right-1 rotate-12 ${isPowered ? 'bg-red-500' : 'bg-[#FF4B4B]'}`}></div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''} ${isPowered ? 'bg-black' : ''}`}></div>
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''} ${isPowered ? 'bg-black' : ''}`}></div>
        </div>
        {isPowered && (
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse"></div>
        )}
      </div>
      <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-1">
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`}></div>
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}></div>
      </div>
    </div>
  );
};

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'ENTER_NAME' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [powerTimeLeft, setPowerTimeLeft] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastSavedScore, setLastSavedScore] = useState<number | null>(null);

  // PHYSICS TWEAKS
  const GRAVITY = 0.6;
  const JUMP_FORCE = -9;
  const ACCELERATION = 0.04;
  const FRICTION = 0.88;
  const MAX_SPEED = 0.65;
  const POWER_MAX_SPEED = 1.1;

  const gameRunning = useRef(false);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const playerRef = useRef({ 
    x: 5, y: 50, vx: 0, vy: 0, 
    isJumping: false, 
    facing: 'right' as 'left' | 'right', 
    isWalking: false,
    isPowered: false,
    powerTimeout: 0
  });

  const cameraRef = useRef(0);
  const coinsRef = useRef<{ x: number, y: number, collected: boolean, type: 'coin' | 'power' }[]>([]);
  
  // EXTENDED LEVEL CONTENT - ADDED MANY MORE TO PREVENT "ENDING"
  const obstaclesRef = useRef([
    { x: 120, y: 75, range: 25, startX: 115, dir: 1, type: 'ground' },
    { x: 235, y: 75, range: 40, startX: 235, dir: 1, type: 'ground' },
    { x: 170, y: 30, range: 30, startX: 170, dir: 1, type: 'fly', phase: 0 },
    { x: 300, y: 20, range: 50, startX: 300, dir: -1, type: 'fly', phase: Math.PI },
    { x: 450, y: 65, range: 60, startX: 450, dir: 1, type: 'ground' },
    { x: 600, y: 35, range: 40, startX: 600, dir: -1, type: 'fly', phase: 0.5 },
    { x: 850, y: 70, range: 30, startX: 850, dir: 1, type: 'ground' },
    { x: 1100, y: 20, range: 80, startX: 1100, dir: 1, type: 'fly' },
    { x: 1400, y: 65, range: 40, startX: 1400, dir: -1, type: 'ground' },
    { x: 1750, y: 40, range: 100, startX: 1750, dir: 1, type: 'fly' },
    { x: 2100, y: 75, range: 50, startX: 2100, dir: 1, type: 'ground' },
    { x: 2400, y: 30, range: 120, startX: 2400, dir: -1, type: 'fly' },
    { x: 3000, y: 75, range: 200, startX: 3000, dir: 1, type: 'ground' },
    { x: 3500, y: 25, range: 150, startX: 3500, dir: -1, type: 'fly' },
    { x: 4000, y: 70, range: 50, startX: 4000, dir: 1, type: 'ground' },
  ]);

  const platforms = useRef([
    { x: 0, y: 80, w: 45 },
    { x: 55, y: 65, w: 25 },
    { x: 90, y: 50, w: 20 },
    { x: 120, y: 75, w: 80 },
    { x: 210, y: 60, w: 30 },
    { x: 250, y: 80, w: 150 },
    { x: 420, y: 60, w: 40 },
    { x: 480, y: 45, w: 40 },
    { x: 540, y: 75, w: 100 },
    { x: 660, y: 55, w: 60 },
    { x: 750, y: 80, w: 200 },
    { x: 980, y: 60, w: 50 },
    { x: 1050, y: 40, w: 30 },
    { x: 1100, y: 80, w: 300 },
    { x: 1450, y: 65, w: 80 },
    { x: 1550, y: 45, w: 40 },
    { x: 1620, y: 80, w: 500 },
    { x: 2150, y: 60, w: 60 },
    { x: 2250, y: 80, w: 1000 },
    { x: 3300, y: 60, w: 40 },
    { x: 3400, y: 40, w: 50 },
    { x: 3500, y: 80, w: 10000 }, // Ultra-long endgame platform to prevent accidental score cap
  ]);

  const [renderState, setRenderState] = useState({
    player: { x: 5, y: 50, facing: 'right' as 'left' | 'right', isJumping: false, isWalking: false, isPowered: false },
    cameraX: 0,
    coins: [] as { x: number, y: number, collected: boolean, type: string }[],
    obstacles: [] as { x: number, y: number, type: string }[]
  });

  // Load Leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ninja_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const saveScore = (finalScore: number) => {
    if (!playerName.trim()) return;
    
    setLeaderboard(prev => {
      const existingEntryIndex = prev.findIndex(e => e.name === playerName);
      let updatedList = [...prev];

      if (existingEntryIndex !== -1) {
        // If player already exists, only update if the new score is higher
        if (finalScore > updatedList[existingEntryIndex].score) {
          updatedList[existingEntryIndex] = { name: playerName, score: finalScore };
        }
      } else {
        // New player
        updatedList.push({ name: playerName, score: finalScore });
      }

      // Sort and keep top 5 unique players
      const updated = updatedList
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
        
      localStorage.setItem('ninja_leaderboard', JSON.stringify(updated));
      return updated;
    });
    setLastSavedScore(finalScore);
  };

  const startGame = () => {
    playerRef.current = { x: 5, y: 50, vx: 0, vy: 0, isJumping: false, facing: 'right', isWalking: false, isPowered: false, powerTimeout: 0 };
    cameraRef.current = 0;
    
    // GENERATE MANY COINS FOR HIGH SCORE POTENTIAL - INCREASED RANGE
    const manyCoins = [];
    for(let i=0; i<150; i++) {
        manyCoins.push({ 
            x: 50 + (i * 40), 
            y: 30 + Math.random() * 40, 
            collected: false, 
            type: (i % 12 === 0) ? 'power' : 'coin' 
        });
    }
    coinsRef.current = manyCoins;
    
    setScore(0);
    setPowerTimeLeft(0);
    setLastSavedScore(null);
    gameRunning.current = true;
    setGameState('PLAYING');
  };

  const handleGameOver = (currentScore: number) => {
    gameRunning.current = false;
    setGameState('GAMEOVER');
    saveScore(currentScore);
  };

  // Prevent browser scrolling when playing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const controlKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
      if (gameState === 'PLAYING' && controlKeys.includes(e.code)) {
        e.preventDefault();
      }
      keys.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    let frameId: number;

    const loop = () => {
      if (!gameRunning.current) return;

      const p = playerRef.current;
      const speedLimit = p.isPowered ? POWER_MAX_SPEED : MAX_SPEED;

      const moveRight = keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['BtnRight'];
      const moveLeft = keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['BtnLeft'];

      if (moveRight) {
        p.vx += ACCELERATION;
        p.facing = 'right';
        p.isWalking = true;
      } else if (moveLeft) {
        p.vx -= ACCELERATION;
        p.facing = 'left';
        p.isWalking = true;
      } else {
        p.vx *= FRICTION;
        if (Math.abs(p.vx) < 0.01) {
          p.vx = 0;
          p.isWalking = false;
        }
      }

      p.vx = Math.max(-speedLimit, Math.min(speedLimit, p.vx));
      p.x += p.vx;

      const isJumpPressed = keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['BtnJump'];
      
      if (isJumpPressed && !p.isJumping) {
        p.vy = JUMP_FORCE;
        p.isJumping = true;
      }

      if (!isJumpPressed && p.vy < -2) {
        p.vy *= 0.6;
      }

      p.vy += GRAVITY;
      p.y += p.vy;

      let onPlatform = false;
      for (const plat of platforms.current) {
        const withinPlatformX = p.x + 4 > plat.x && p.x - 4 < plat.x + plat.w;
        if (withinPlatformX) {
          if (p.vy >= 0 && p.y >= plat.y && p.y - p.vy <= plat.y) {
            p.y = plat.y;
            p.vy = 0;
            onPlatform = true;
            break;
          }
        }
      }
      p.isJumping = !onPlatform;

      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'ground') {
          obs.x += 0.18 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
        } else {
          obs.x += 0.25 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
          const phase = (obs as any).phase || 0;
          obs.y = 25 + Math.sin(Date.now() / 400 + phase) * 12;
        }
        
        const dx = Math.abs(obs.x - p.x);
        const dy = Math.abs(obs.y - (p.y - 5));
        if (dx < 5 && dy < 8) {
          if (p.isPowered) {
            obs.y = 500; // Knock out of screen
            setScore(s => s + 500);
          } else {
            handleGameOver(score);
          }
        }
      });

      if (p.y > 120) { handleGameOver(score); return; }

      const targetCam = p.x - 45;
      cameraRef.current += (targetCam - cameraRef.current) * 0.1;
      cameraRef.current = Math.max(0, cameraRef.current);

      coinsRef.current.forEach(c => {
        if (!c.collected && Math.abs(c.x - p.x) < 6 && Math.abs(c.y - p.y) < 12) {
          c.collected = true;
          if (c.type === 'coin') {
            setScore(s => s + 100);
          } else {
            p.isPowered = true;
            p.powerTimeout = Date.now() + 10000;
            setScore(s => s + 1000);
          }
        }
      });

      if (p.isPowered && Date.now() > p.powerTimeout) {
        p.isPowered = false;
        setPowerTimeLeft(0);
      } else if (p.isPowered) {
        setPowerTimeLeft(Math.ceil((p.powerTimeout - Date.now()) / 1000));
      }

      setRenderState({
        player: { ...p },
        cameraX: cameraRef.current,
        coins: [...coinsRef.current],
        obstacles: obstaclesRef.current.map(o => ({ x: o.x, y: o.y, type: o.type }))
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, score]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const setKey = (k: string, v: boolean) => (keys.current[k] = v);

  return (
    <section id="arcade" className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-xl mb-4 rotate-[-1deg] shadow-[6px_6px_0px_#00A1FF]">
            NEURAL ARCADE V5.4
          </div>
          <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-none">
            ACTION <span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '8px 8px 0px #FF4B4B' }}>BASTION</span>
          </h2>
        </header>

        {/* Game Cabinet */}
        <div className="w-full max-w-[1000px] aspect-[4/5] sm:aspect-[16/9] bg-[#111] border-[8px] sm:border-[12px] border-black rounded-[2rem] sm:rounded-[4rem] shadow-[15px_15px_0px_#000] sm:shadow-[40px_40px_0px_#000] relative overflow-hidden flex flex-col p-2 sm:p-4 mb-16">
          
          <div className="flex-1 rounded-[1.5rem] sm:rounded-[3rem] bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden relative border-2 sm:border-4 border-black/30 crt-screen">
            <div 
              className="absolute inset-0 transition-transform duration-75 ease-out"
              style={{ transform: `translateX(-${renderState.cameraX}%)` }}
            >
              {platforms.current.map((p, i) => (
                <div 
                  key={i}
                  className="absolute bg-[#3E2723] border-[4px] sm:border-[6px] border-black"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: '200%' }}
                >
                  <div className="w-full h-4 sm:h-8 bg-emerald-500 border-b-2 sm:border-b-4 border-black"></div>
                </div>
              ))}

              {renderState.coins.map((c, i) => !c.collected && (
                <div 
                  key={i}
                  className={`absolute text-3xl sm:text-5xl flex flex-col items-center justify-center animate-bounce`}
                  style={{ left: `${c.x}%`, top: `${c.y-8}%`, transform: 'translateX(-50%)' }}
                >
                  <span>{c.type === 'coin' ? '💎' : '⭐'}</span>
                </div>
              ))}

              {renderState.obstacles.map((obs, i) => (
                <div 
                  key={i}
                  className="absolute w-[10%] sm:w-[6%] h-[12%] sm:h-[10%] flex flex-col items-center justify-center text-4xl sm:text-6xl"
                  style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <div className="animate-bounce">
                    {obs.type === 'fly' ? '👾' : '😈'}
                  </div>
                </div>
              ))}

              <div 
                className="absolute"
                style={{ 
                  left: `${renderState.player.x}%`, 
                  top: `${renderState.player.y}%`, 
                  transform: `translate(-50%, -100%) scaleX(${renderState.player.facing === 'left' ? -1 : 1})`,
                  width: '14%', 
                  height: '20%', 
                  zIndex: 50
                }}
              >
                 <NeuralNinja 
                    facing={renderState.player.facing} 
                    isWalking={renderState.player.isWalking} 
                    isJumping={renderState.player.isJumping} 
                    isPowered={renderState.player.isPowered}
                  />
              </div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 z-[110] flex justify-between pointer-events-none items-start">
              <div className="bg-black text-white px-3 sm:px-6 py-1 sm:py-2 font-black text-lg sm:text-3xl border-2 sm:border-4 border-white shadow-[4px_4px_0px_#000]">
                {score}
              </div>
              <div className="bg-white border-2 sm:border-4 border-black px-3 sm:px-6 py-1 sm:py-2 font-black text-lg sm:text-3xl shadow-[4px_4px_0px_#000]">
                {playerName ? `${playerName}: ` : ''} {highScore}
              </div>
            </div>

            {/* Screens */}
            {gameState === 'START' && (
              <div className="absolute inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                <div className="bg-white border-[8px] border-black p-6 sm:p-12 shadow-[15px_15px_0px_#FFD600] text-center rotate-1 w-full max-w-lg">
                  <h3 className="text-5xl sm:text-8xl font-black mb-4 italic uppercase leading-none">READY?</h3>
                  <button onClick={() => setGameState('ENTER_NAME')} className="cartoon-btn w-full bg-black text-white py-4 sm:py-8 font-black text-3xl sm:text-5xl uppercase">DEPLOY!</button>
                </div>
              </div>
            )}

            {gameState === 'ENTER_NAME' && (
              <div className="absolute inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                <div className="bg-white border-[8px] border-black p-6 sm:p-10 shadow-[15px_15px_0px_#00A1FF] text-center -rotate-1 w-full max-w-lg">
                  <h3 className="text-3xl sm:text-5xl font-black mb-6 uppercase tracking-tight">LOG IN, NINJA</h3>
                  <input 
                    type="text"
                    maxLength={10}
                    placeholder="NAME..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                    className="w-full p-4 border-4 border-black font-black text-2xl sm:text-4xl text-center uppercase focus:bg-yellow-50 outline-none mb-6"
                  />
                  <button 
                    disabled={!playerName.trim()}
                    onClick={startGame} 
                    className="cartoon-btn w-full bg-[#FF4B4B] text-white py-4 sm:py-6 font-black text-3xl uppercase disabled:opacity-50"
                  >
                    START SEQUENCE
                  </button>
                </div>
              </div>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 z-[150] bg-red-600/80 flex items-center justify-center p-4">
                <div className="bg-white border-[8px] border-black p-6 sm:p-12 shadow-[15px_15px_0px_#000] text-center -rotate-1 w-full max-w-lg">
                  <h3 className="text-4xl sm:text-7xl font-black mb-4 text-red-600 uppercase leading-none">SYSTEM CRASHED</h3>
                  <div className="mb-2 font-black text-2xl uppercase">SCORE: {score}</div>
                  {lastSavedScore !== null && (
                    <div className="mb-6 text-green-600 font-black text-sm uppercase">✅ RECORDED ON LEADERBOARD</div>
                  )}
                  <button onClick={startGame} className="cartoon-btn w-full bg-[#00A1FF] text-white py-4 sm:py-8 font-black text-3xl sm:text-5xl uppercase">REBOOT</button>
                </div>
              </div>
            )}
            
            {/* Mobile Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-[200] pointer-events-none">
              <div className="flex gap-4 pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnLeft', true)}
                  onPointerUp={() => setKey('BtnLeft', false)}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md border-4 border-white/50 rounded-2xl flex items-center justify-center text-white text-3xl active:scale-90"
                >◀</button>
                <button 
                  onPointerDown={() => setKey('BtnRight', true)}
                  onPointerUp={() => setKey('BtnRight', false)}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md border-4 border-white/50 rounded-2xl flex items-center justify-center text-white text-3xl active:scale-90"
                >▶</button>
              </div>
              <div className="pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnJump', true)}
                  onPointerUp={() => setKey('BtnJump', false)}
                  className="w-20 h-20 bg-[#FF4B4B]/80 border-[4px] border-black rounded-full flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-none"
                >JUMP</button>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="w-full max-w-3xl">
          <div className="bg-black text-[#FFD600] px-6 py-2 font-black uppercase text-xl inline-block rotate-1 shadow-[6px_6px_0px_#000] mb-4">
            TOP 5 NINJA SQUAD
          </div>
          <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_#000] -rotate-1">
            {leaderboard.length === 0 ? (
              <div className="text-center py-6 text-gray-400 font-black uppercase text-xl">No stats found. Be the first!</div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, i) => (
                  <div key={i} className={`flex items-center justify-between border-b-4 border-black/5 pb-2 ${entry.name === playerName ? 'bg-yellow-50' : ''}`}>
                    <div className="flex items-center gap-6">
                      <span className="text-4xl font-black text-[#FF4B4B]">#{i + 1}</span>
                      <span className="text-2xl font-black uppercase">{entry.name}</span>
                      {entry.name === playerName && entry.score === lastSavedScore && (
                         <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black">NEW BEST!</span>
                      )}
                    </div>
                    <div className="text-3xl font-black text-[#00A1FF]">{entry.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 border-t-4 border-black pt-4 flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
               <span>V-ARCHIVE_LOCAL</span>
               <span>SYNC_STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
