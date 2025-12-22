
import React, { useState, useEffect, useRef } from 'react';

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game Constants (Percentage-based units)
  const GRAVITY = 0.4;
  const JUMP_FORCE = -11;
  const PLAYER_SPEED = 0.6;
  
  // Game State Refs for high-performance updates
  const gameRunning = useRef(false);
  const keys = useRef<{ [key: string]: boolean }>({});
  const playerRef = useRef({ x: 10, y: 50, vy: 0, isJumping: false, facing: 'right' as 'left' | 'right' });
  const cameraRef = useRef(0);
  const coinsRef = useRef<{ x: number, y: number, collected: boolean }[]>([]);
  
  // Static World Data
  const platforms = useRef([
    { x: 0, y: 80, w: 40 },
    { x: 50, y: 70, w: 25 },
    { x: 85, y: 55, w: 20 },
    { x: 115, y: 75, w: 30 },
    { x: 155, y: 60, w: 25 },
    { x: 195, y: 45, w: 20 },
    { x: 230, y: 75, w: 45 },
    { x: 290, y: 60, w: 25 },
    { x: 330, y: 50, w: 20 },
    { x: 360, y: 70, w: 40 },
    { x: 420, y: 80, w: 100 },
  ]);

  // React State for rendering (updated via game loop)
  const [renderState, setRenderState] = useState({
    player: { x: 10, y: 50, facing: 'right', isJumping: false },
    cameraX: 0,
    coins: [] as { x: number, y: number, collected: boolean }[]
  });

  const startGame = () => {
    playerRef.current = { x: 10, y: 50, vy: 0, isJumping: false, facing: 'right' };
    cameraRef.current = 0;
    coinsRef.current = [
      { x: 55, y: 60, collected: false },
      { x: 95, y: 45, collected: false },
      { x: 125, y: 65, collected: false },
      { x: 165, y: 50, collected: false },
      { x: 205, y: 35, collected: false },
      { x: 340, y: 40, collected: false },
    ];
    setScore(0);
    gameRunning.current = true;
    setGameState('PLAYING');
  };

  const handleGameOver = () => {
    gameRunning.current = false;
    setGameState('GAMEOVER');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let frameId: number;

    const loop = () => {
      if (!gameRunning.current) return;

      const p = playerRef.current;
      let nextX = p.x;
      let nextY = p.y;
      let nextVy = p.vy + GRAVITY;
      let nextFacing = p.facing;

      // Input Handling
      if (keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['MobileRight']) {
        nextX += PLAYER_SPEED;
        nextFacing = 'right';
      }
      if (keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['MobileLeft']) {
        nextX -= PLAYER_SPEED;
        nextFacing = 'left';
      }
      if ((keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['MobileJump']) && !p.isJumping) {
        nextVy = JUMP_FORCE;
        p.isJumping = true;
      }

      nextY += nextVy;

      // Simple Collision with platforms
      let onPlatform = false;
      for (const plat of platforms.current) {
        // Check if player is within horizontal bounds of platform
        if (nextX + 2 > plat.x && nextX - 2 < plat.x + plat.w) {
          // Check if player was above and is now below or on the platform surface
          if (p.y <= plat.y && nextY >= plat.y) {
            nextY = plat.y;
            nextVy = 0;
            onPlatform = true;
            break;
          }
        }
      }

      // Check for death (falling)
      if (nextY > 110) {
        handleGameOver();
        return;
      }

      // Update Camera
      if (nextX > cameraRef.current + 60) cameraRef.current = nextX - 60;
      if (nextX < cameraRef.current + 20) cameraRef.current = Math.max(0, nextX - 20);

      // Collect Coins
      coinsRef.current.forEach(c => {
        if (!c.collected && Math.abs(c.x - nextX) < 4 && Math.abs(c.y - nextY) < 8) {
          c.collected = true;
          setScore(s => s + 100);
        }
      });

      // Update refs
      playerRef.current = {
        x: Math.max(0, nextX),
        y: nextY,
        vy: nextVy,
        isJumping: !onPlatform,
        facing: nextFacing
      };

      // Sync React state for render (only what's needed for the visual)
      setRenderState({
        player: { x: playerRef.current.x, y: playerRef.current.y, facing: playerRef.current.facing, isJumping: playerRef.current.isJumping },
        cameraX: cameraRef.current,
        coins: [...coinsRef.current]
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Mobile Button Handlers
  const handleBtnDown = (key: string) => (keys.current[key] = true);
  const handleBtnUp = (key: string) => (keys.current[key] = false);

  return (
    <section className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-xl mb-4 rotate-[-1deg] shadow-[4px_4px_0px_#FF4B4B]">
            MANISHI'S SECRET LAB
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            SUPER <span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '6px 6px 0px #00A1FF' }}>MANISHI</span>
          </h2>
        </header>

        {/* iPad Visual Frame - Enhanced Pro Look */}
        <div className="w-full max-w-[950px] aspect-[4/3] bg-gradient-to-br from-gray-800 to-black border-[14px] border-black rounded-[4rem] shadow-[30px_30px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col p-4">
          
          {/* Top Notch / FaceID Area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-[60] flex items-center justify-center gap-4">
            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            <div className="w-3 h-1 bg-gray-800 rounded-full"></div>
          </div>
          
          <div className="flex-1 rounded-[3rem] bg-sky-400 overflow-hidden relative border-4 border-black/20 crt-screen">
            {/* World Container */}
            <div 
              className="absolute inset-0 will-change-transform"
              style={{ transform: `translateX(-${renderState.cameraX}%)` }}
            >
              {/* Parallax Clouds */}
              <div className="absolute top-10 left-[10%] text-6xl opacity-30 select-none">☁️</div>
              <div className="absolute top-32 left-[50%] text-7xl opacity-30 select-none">☁️</div>
              <div className="absolute top-16 left-[90%] text-6xl opacity-30 select-none">☁️</div>
              <div className="absolute top-40 left-[130%] text-7xl opacity-30 select-none">☁️</div>
              <div className="absolute top-20 left-[180%] text-6xl opacity-30 select-none">☁️</div>

              {/* Platforms */}
              {platforms.current.map((p, i) => (
                <div 
                  key={i}
                  className="absolute bg-[#8B4513] border-t-8 border-green-500 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: '100%' }}
                >
                  <div className="w-full h-full opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
                </div>
              ))}

              {/* Coins */}
              {renderState.coins.map((c, i) => !c.collected && (
                <div 
                  key={i}
                  className="absolute text-3xl animate-bounce drop-shadow-md"
                  style={{ left: `${c.x}%`, top: `${c.y-5}%`, transform: 'translateX(-50%)' }}
                >
                  🟡
                </div>
              ))}

              {/* Player - Character Avatar */}
              <div 
                className="absolute transition-transform duration-75 ease-out"
                style={{ 
                  left: `${renderState.player.x}%`, 
                  top: `${renderState.player.y}%`, 
                  transform: `translate(-50%, -100%) scaleX(${renderState.player.facing === 'left' ? -1 : 1})`,
                  width: '8%',
                  height: '12%'
                }}
              >
                <img 
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=ManishiYadav&backgroundColor=FF4B4B" 
                  className={`w-full h-full drop-shadow-[0_6px_0_rgba(0,0,0,0.4)] ${renderState.player.isJumping ? 'scale-110 -rotate-12' : ''}`}
                  alt="Manishi" 
                />
              </div>
            </div>

            {/* Score HUD */}
            <div className="absolute top-8 left-8 z-50 flex gap-4 pointer-events-none">
              <div className="bg-black text-white px-5 py-2 font-black text-2xl border-4 border-white shadow-[6px_6px_0px_#000] rotate-[-2deg]">
                SCORE: {score}
              </div>
              <div className="bg-[#FFD600] border-4 border-black px-5 py-2 font-black text-2xl shadow-[6px_6px_0px_#000] rotate-[1deg]">
                TOP: {highScore}
              </div>
            </div>

            {/* Screens Overlay */}
            {gameState === 'START' && (
              <div className="absolute inset-0 z-[70] bg-black/40 flex items-center justify-center backdrop-blur-md">
                <div className="bg-white border-[10px] border-black p-12 shadow-[20px_20px_0px_#FFD600] text-center rotate-1 max-w-sm">
                  <h3 className="text-6xl font-black mb-6 italic tracking-tighter uppercase">START?</h3>
                  <p className="font-bold text-gray-500 mb-10 leading-tight uppercase">Collect gadgets and don't fall off the clouds!</p>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-black text-white py-6 font-black text-3xl uppercase tracking-widest"
                  >
                    PLAY NOW
                  </button>
                </div>
              </div>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 z-[70] bg-red-600/50 flex items-center justify-center backdrop-blur-md">
                <div className="bg-white border-[10px] border-black p-12 shadow-[20px_20px_0px_#000] text-center -rotate-1">
                  <h3 className="text-6xl font-black mb-4 italic tracking-tighter uppercase text-red-600">GAME OVER!</h3>
                  <p className="text-2xl font-black mb-10 text-gray-800 uppercase">GADGETS LOST: {score}</p>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-[#00A1FF] text-white py-6 font-black text-3xl uppercase tracking-widest"
                  >
                    REBOOT
                  </button>
                </div>
              </div>
            )}
            
            {/* On-Screen Controls for the iPad feel */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-[80] pointer-events-none">
              <div className="flex gap-6 pointer-events-auto">
                <button 
                  onMouseDown={() => handleBtnDown('MobileLeft')}
                  onMouseUp={() => handleBtnUp('MobileLeft')}
                  onMouseLeave={() => handleBtnUp('MobileLeft')}
                  onTouchStart={(e) => { e.preventDefault(); handleBtnDown('MobileLeft'); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleBtnUp('MobileLeft'); }}
                  className="w-24 h-24 bg-black/20 border-4 border-white/30 rounded-3xl flex items-center justify-center text-white text-5xl hover:bg-black/40 active:scale-90 transition-all shadow-xl backdrop-blur-sm"
                >
                  ◀
                </button>
                <button 
                  onMouseDown={() => handleBtnDown('MobileRight')}
                  onMouseUp={() => handleBtnUp('MobileRight')}
                  onMouseLeave={() => handleBtnUp('MobileRight')}
                  onTouchStart={(e) => { e.preventDefault(); handleBtnDown('MobileRight'); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleBtnUp('MobileRight'); }}
                  className="w-24 h-24 bg-black/20 border-4 border-white/30 rounded-3xl flex items-center justify-center text-white text-5xl hover:bg-black/40 active:scale-90 transition-all shadow-xl backdrop-blur-sm"
                >
                  ▶
                </button>
              </div>
              <div className="pointer-events-auto">
                <button 
                  onMouseDown={() => handleBtnDown('MobileJump')}
                  onMouseUp={() => handleBtnUp('MobileJump')}
                  onMouseLeave={() => handleBtnUp('MobileJump')}
                  onTouchStart={(e) => { e.preventDefault(); handleBtnDown('MobileJump'); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleBtnUp('MobileJump'); }}
                  className="w-28 h-28 bg-[#FF4B4B] border-[6px] border-black rounded-full flex items-center justify-center text-white font-black text-3xl shadow-[0_12px_0_#000] active:shadow-none active:translate-y-3 transition-all"
                >
                  JUMP
                </button>
              </div>
            </div>
          </div>

          {/* iPad Home Indicator Bar */}
          <div className="h-2 w-48 bg-white/20 rounded-full mx-auto mt-4 self-center"></div>
        </div>

        <div className="mt-12 flex items-center gap-6">
           <div className="bg-black text-white px-4 py-2 font-black uppercase text-xs">Keyboard Controls: [←][→] Move | [Space] Jump</div>
           <div className="w-10 h-10 animate-bounce text-3xl">👇</div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
