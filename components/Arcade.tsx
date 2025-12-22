
import React, { useState, useEffect, useRef } from 'react';

// Animated Sprite Component
const NeuralNinja: React.FC<{ facing: 'left' | 'right', isWalking: boolean, isJumping: boolean }> = ({ facing, isWalking, isJumping }) => {
  return (
    <div className={`w-full h-full relative transition-all duration-300 ${isJumping ? 'scale-110 -rotate-3' : ''}`}>
      <div className="absolute inset-0 bg-black border-[3px] border-white rounded-xl flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.4)]">
        <div className="absolute top-1 w-full h-4 bg-[#FF4B4B] border-y-2 border-white flex justify-center">
           <div className="w-1 h-5 bg-[#FF4B4B] border-2 border-white absolute -right-1 rotate-12"></div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''}`}></div>
          <div className={`w-2 h-2 bg-white rounded-full ${isWalking ? 'animate-pulse' : ''}`}></div>
        </div>
      </div>
      <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-1">
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`}></div>
        <div className={`w-3 h-4 bg-black border-2 border-white rounded-full ${isWalking ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}></div>
      </div>
    </div>
  );
};

const Arcade: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const GRAVITY = 0.75; 
  const JUMP_FORCE = -10.5;
  const PLAYER_SPEED = 0.9;

  const gameRunning = useRef(false);
  const keys = useRef<{ [key: string]: boolean }>({});
  const playerRef = useRef({ 
    x: 10, y: 50, vy: 0, 
    isJumping: false, 
    facing: 'right' as 'left' | 'right', 
    isWalking: false 
  });
  const cameraRef = useRef(0);
  const coinsRef = useRef<{ x: number, y: number, collected: boolean }[]>([]);
  
  const obstaclesRef = useRef([
    { x: 120, y: 75, range: 25, startX: 115, dir: 1, type: 'ground' },
    { x: 235, y: 75, range: 40, startX: 235, dir: 1, type: 'ground' },
    { x: 170, y: 30, range: 30, startX: 170, dir: 1, type: 'fly', phase: 0 },
    { x: 300, y: 20, range: 50, startX: 300, dir: -1, type: 'fly', phase: Math.PI },
    { x: 375, y: 65, range: 15, startX: 375, dir: 1, type: 'ground' },
  ]);

  const platforms = useRef([
    { x: 0, y: 80, w: 45 },
    { x: 55, y: 65, w: 25 },
    { x: 90, y: 50, w: 20 },
    { x: 120, y: 75, w: 40 },
    { x: 170, y: 60, w: 25 },
    { x: 205, y: 45, w: 20 },
    { x: 240, y: 75, w: 45 },
    { x: 300, y: 60, w: 25 },
    { x: 340, y: 45, w: 20 },
    { x: 370, y: 70, w: 45 },
    { x: 430, y: 80, w: 100 },
  ]);

  const [renderState, setRenderState] = useState({
    player: { x: 10, y: 50, facing: 'right' as 'left' | 'right', isJumping: false, isWalking: false },
    cameraX: 0,
    coins: [] as { x: number, y: number, collected: boolean }[],
    obstacles: [] as { x: number, y: number, type: string }[]
  });

  const startGame = () => {
    playerRef.current = { x: 10, y: 50, vy: 0, isJumping: false, facing: 'right', isWalking: false };
    cameraRef.current = 0;
    coinsRef.current = [
      { x: 58, y: 55, collected: false },
      { x: 95, y: 40, collected: false },
      { x: 130, y: 65, collected: false },
      { x: 175, y: 50, collected: false },
      { x: 250, y: 65, collected: false },
      { x: 350, y: 35, collected: false },
      { x: 450, y: 70, collected: false },
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
      let walking = false;

      const moveRight = keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['BtnRight'];
      const moveLeft = keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['BtnLeft'];

      if (moveRight) {
        nextX += PLAYER_SPEED;
        nextFacing = 'right';
        walking = true;
      }
      if (moveLeft) {
        nextX -= PLAYER_SPEED;
        nextFacing = 'left';
        walking = true;
      }

      const isJumpPressed = keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['BtnJump'];
      if (isJumpPressed && !p.isJumping) {
        nextVy = JUMP_FORCE;
        p.isJumping = true;
      }

      nextY += nextVy;

      let onPlatform = false;
      for (const plat of platforms.current) {
        const withinPlatformX = nextX + 2.5 > plat.x && nextX - 2.5 < plat.x + plat.w;
        if (withinPlatformX) {
          if (p.y <= plat.y && nextY >= plat.y) {
            nextY = plat.y;
            nextVy = 0;
            onPlatform = true;
            break;
          }
        }
      }

      p.isJumping = !onPlatform;

      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'ground') {
          obs.x += 0.25 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
        } else {
          obs.x += 0.35 * obs.dir;
          if (Math.abs(obs.x - obs.startX) > obs.range) obs.dir *= -1;
          const phase = (obs as any).phase || 0;
          obs.y = 25 + Math.sin(Date.now() / 400 + phase) * 12;
        }
        
        const dx = Math.abs(obs.x - nextX);
        const dy = Math.abs(obs.y - (nextY - 5));
        if (dx < 4 && dy < 7) {
          handleGameOver();
        }
      });

      if (nextY > 120) { handleGameOver(); return; }

      const targetCam = nextX - 45;
      cameraRef.current += (targetCam - cameraRef.current) * 0.12;
      cameraRef.current = Math.max(0, cameraRef.current);

      coinsRef.current.forEach(c => {
        if (!c.collected && Math.abs(c.x - nextX) < 4 && Math.abs(c.y - nextY) < 8) {
          c.collected = true;
          setScore(s => s + 100);
        }
      });

      playerRef.current = {
        x: Math.max(0, nextX),
        y: nextY,
        vy: nextVy,
        isJumping: p.isJumping,
        facing: nextFacing,
        isWalking: walking
      };

      setRenderState({
        player: { ...playerRef.current },
        cameraX: cameraRef.current,
        coins: [...coinsRef.current],
        obstacles: obstaclesRef.current.map(o => ({ x: o.x, y: o.y, type: o.type }))
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const setKey = (k: string, v: boolean) => (keys.current[k] = v);

  return (
    <section className="py-20 md:py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-8 md:mb-10">
          <div className="inline-block bg-black text-white px-4 md:px-6 py-2 font-black uppercase text-sm md:text-xl mb-4 rotate-[-1deg] shadow-[4px_4px_0px_#00A1FF]">
            NEURAL ARCADE V4.0
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
            SUPER <span className="text-white" style={{ WebkitTextStroke: '1px md:2px black', textShadow: '4px 4px 0px #FF4B4B' }}>NINJA</span>
          </h2>
        </header>

        <div className="w-full max-w-[950px] aspect-square md:aspect-[4/3] bg-[#222] border-[8px] md:border-[16px] border-black rounded-[2rem] md:rounded-[5rem] shadow-[20px_20px_0px_#000] md:shadow-[40px_40px_0px_#000] relative overflow-hidden flex flex-col p-2 md:p-4">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-48 h-6 md:h-10 bg-black rounded-b-[1rem] md:rounded-b-[2rem] z-[100] flex items-center justify-center gap-4 md:gap-6">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-gray-900 rounded-full"></div>
            <div className="w-3 md:w-4 h-1 bg-gray-800 rounded-full"></div>
            <div className="w-1 md:w-2 h-1 md:h-2 bg-gray-900 rounded-full"></div>
          </div>
          
          <div className="flex-1 rounded-[1.5rem] md:rounded-[4rem] bg-sky-300 overflow-hidden relative border-2 md:border-4 border-black/30 crt-screen">
            <div 
              className="absolute inset-0 transition-transform duration-75 ease-out"
              style={{ transform: `translateX(-${renderState.cameraX}%)` }}
            >
              {[10, 80, 150, 220, 290, 360, 430].map(x => (
                <div key={x} className="absolute text-5xl md:text-7xl opacity-30 select-none" style={{ left: `${x}%`, top: `${20 + (x % 20)}%` }}>☁️</div>
              ))}

              {platforms.current.map((p, i) => (
                <div 
                  key={i}
                  className="absolute bg-[#5D4037] border-t-4 md:border-t-8 border-emerald-400"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: '100%' }}
                >
                  <div className="w-full h-full opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent:15px)]"></div>
                </div>
              ))}

              {renderState.obstacles.map((obs, i) => (
                <div 
                  key={i}
                  className="absolute w-[8%] h-[8%] flex flex-col items-center justify-center text-3xl md:text-5xl"
                  style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <div className="animate-bounce">
                    {obs.type === 'fly' ? '👾' : '😈'}
                  </div>
                </div>
              ))}

              {renderState.coins.map((c, i) => !c.collected && (
                <div 
                  key={i}
                  className="absolute text-2xl md:text-4xl animate-bounce"
                  style={{ left: `${c.x}%`, top: `${c.y-6}%`, transform: 'translateX(-50%)' }}
                >
                  💎
                </div>
              ))}

              <div 
                className="absolute"
                style={{ 
                  left: `${renderState.player.x}%`, 
                  top: `${renderState.player.y}%`, 
                  transform: `translate(-50%, -100%) scaleX(${renderState.player.facing === 'left' ? -1 : 1})`,
                  width: '8%',
                  height: '14%',
                  zIndex: 50
                }}
              >
                <NeuralNinja 
                  facing={renderState.player.facing} 
                  isWalking={renderState.player.isWalking} 
                  isJumping={renderState.player.isJumping} 
                />
              </div>
            </div>

            <div className="absolute top-4 md:top-10 left-4 md:left-10 right-4 md:right-10 z-[110] flex justify-between pointer-events-none">
              <div className="bg-black text-white px-3 md:px-6 py-1 md:py-2 font-black text-sm md:text-2xl border-2 md:border-4 border-white shadow-[3px_3px_0px_#000] md:shadow-[6px_6px_0px_#000] rotate-[-1deg]">
                DATA: {score}
              </div>
              <div className="bg-[#FFD600] border-2 md:border-4 border-black px-3 md:px-6 py-1 md:py-2 font-black text-sm md:text-2xl shadow-[3px_3px_0px_#000] md:shadow-[6px_6px_0px_#000] rotate-[1deg]">
                PEAK: {highScore}
              </div>
            </div>

            {gameState === 'START' && (
              <div className="absolute inset-0 z-[150] bg-black/70 flex items-center justify-center backdrop-blur-md p-4">
                <div className="bg-white border-[6px] md:border-[12px] border-black p-6 md:p-12 shadow-[10px_10px_0px_#FFD600] md:shadow-[20px_20px_0px_#FFD600] text-center rotate-1 w-full max-w-sm">
                  <h3 className="text-4xl md:text-7xl font-black mb-4 italic tracking-tighter uppercase">READY?</h3>
                  <p className="font-bold text-gray-500 mb-6 md:mb-10 text-xs md:text-xl uppercase tracking-widest">ARROWS TO RUN • SPACE TO JUMP</p>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-black text-white py-4 md:py-6 font-black text-xl md:text-4xl uppercase tracking-tighter"
                  >
                    START!
                  </button>
                </div>
              </div>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 z-[150] bg-red-600/70 flex items-center justify-center backdrop-blur-md p-4">
                <div className="bg-white border-[6px] md:border-[12px] border-black p-6 md:p-12 shadow-[10px_10px_0px_#000] md:shadow-[20px_20px_0px_#000] text-center -rotate-1 w-full max-w-sm">
                  <h3 className="text-3xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase text-red-600">FAILED</h3>
                  <p className="text-xl md:text-3xl font-black mb-6 md:mb-10 text-gray-800 uppercase">SCORE: {score}</p>
                  <button 
                    onClick={startGame}
                    className="cartoon-btn w-full bg-[#00A1FF] text-white py-4 md:py-6 font-black text-xl md:text-4xl uppercase tracking-tighter"
                  >
                    REBOOT
                  </button>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 flex justify-between items-end z-[200] pointer-events-none">
              <div className="flex gap-2 md:gap-4 pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnLeft', true)}
                  onPointerUp={() => setKey('BtnLeft', false)}
                  className="w-12 h-12 md:w-24 md:h-24 bg-black/40 border-2 md:border-4 border-white/30 rounded-xl md:rounded-3xl flex items-center justify-center text-white text-2xl md:text-5xl active:scale-90 transition-all backdrop-blur-md"
                >
                  ◀
                </button>
                <button 
                  onPointerDown={() => setKey('BtnRight', true)}
                  onPointerUp={() => setKey('BtnRight', false)}
                  className="w-12 h-12 md:w-24 md:h-24 bg-black/40 border-2 md:border-4 border-white/30 rounded-xl md:rounded-3xl flex items-center justify-center text-white text-2xl md:text-5xl active:scale-90 transition-all backdrop-blur-md"
                >
                  ▶
                </button>
              </div>
              <div className="pointer-events-auto">
                <button 
                  onPointerDown={() => setKey('BtnJump', true)}
                  onPointerUp={() => setKey('BtnJump', false)}
                  className="w-16 h-16 md:w-32 md:h-32 bg-[#FF4B4B] border-[4px] md:border-[8px] border-black rounded-full flex items-center justify-center text-white font-black text-xl md:text-4xl shadow-[0_6px_0_#000] md:shadow-[0_12px_0_#000] active:shadow-none active:translate-y-1 md:active:translate-y-3 transition-all"
                >
                  JUMP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
