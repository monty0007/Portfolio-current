import React, { useState, useEffect, useRef } from 'react';

// Animated Sprite Component
const NeuralNinja: React.FC<{
    playerRef: React.RefObject<HTMLDivElement>;
}> = ({ playerRef }) => {
    return (
        <div ref={playerRef} className="w-full h-full relative">
            <div className="ninja-body absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 border-[3px] border-cyan-400 rounded-lg flex flex-col items-center justify-start overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                <div className="w-full h-[40%] bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 mt-1 mx-1 rounded-sm border-2 border-black flex items-center justify-center">
                    <div className="w-[60%] h-[60%] bg-black/80 rounded-sm flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
                <div className="w-[70%] h-[30%] bg-slate-800 border border-cyan-400/50 mt-1 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
            </div>
            <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-1">
                <div className="ninja-leg w-3 h-4 bg-slate-800 border-2 border-cyan-400/50 rounded-sm"></div>
                <div className="ninja-leg w-3 h-4 bg-slate-800 border-2 border-cyan-400/50 rounded-sm"></div>
            </div>
        </div>
    );
};

interface NinjaGameProps {
    playerName: string;
    onGameOver: (score: number) => void;
    onScoreChange: (score: number) => void;
    onNameChange?: (name: string) => void;
}

const NinjaGame: React.FC<NinjaGameProps> = ({ playerName, onGameOver, onScoreChange, onNameChange }) => {
    // Skip name entry if name already provided
    const [gameState, setGameState] = useState<'ENTER_NAME' | 'READY' | 'PLAYING' | 'GAMEOVER'>(playerName ? 'READY' : 'ENTER_NAME');
    const [localName, setLocalName] = useState(playerName || '');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [powerTimeLeft, setPowerTimeLeft] = useState(0);
    const confirmName = () => {
        if (localName.trim()) {
            onNameChange?.(localName.toUpperCase());
            setGameState('READY');
        }
    };

    const playerDivRef = useRef<HTMLDivElement>(null);
    const cameraDivRef = useRef<HTMLDivElement>(null);

    const GRAVITY = 0.6;
    const JUMP_FORCE = -9;
    const ACCELERATION = 0.04;
    const FRICTION = 0.88;
    const MAX_SPEED = 0.65;
    const POWER_MAX_SPEED = 1.1;

    const gameRunning = useRef(false);
    const keys = useRef<{ [key: string]: boolean }>({});

    const playerState = useRef({
        x: 5, y: 50, vx: 0, vy: 0,
        isJumping: false,
        facing: 'right' as 'left' | 'right',
        isWalking: false,
        isPowered: false,
        powerTimeout: 0
    });

    const cameraState = useRef(0);

    const coinsRef = useRef<{ id: number, x: number, y: number, collected: boolean, type: 'coin' | 'power' }[]>([]);
    const obstaclesRef = useRef<{ id: number, x: number, y: number, range: number, startX: number, dir: number, type: string, phase?: number }[]>([]);
    const platformsRef = useRef([
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
        { x: 3500, y: 80, w: 10000 },
    ]);

    // Initialize Game Objects
    useEffect(() => {
        const manyCoins = [];
        for (let i = 0; i < 60; i++) {
            manyCoins.push({
                id: i,
                x: 60 + (i * 65),
                y: 55 + (i % 3) * 10,
                collected: false,
                type: (i % 10 === 0) ? 'power' : 'coin' as 'power' | 'coin'
            });
        }
        coinsRef.current = manyCoins;

        obstaclesRef.current = [
            { id: 1, x: 140, y: 75, range: 15, startX: 140, dir: 1, type: 'ground' },
            { id: 2, x: 280, y: 75, range: 20, startX: 280, dir: 1, type: 'ground' },
            { id: 3, x: 170, y: 30, range: 20, startX: 170, dir: 1, type: 'fly', phase: 0 },
            { id: 4, x: 300, y: 20, range: 30, startX: 300, dir: -1, type: 'fly', phase: Math.PI },
            { id: 5, x: 470, y: 55, range: 15, startX: 470, dir: 1, type: 'ground' },
            { id: 6, x: 570, y: 70, range: 20, startX: 570, dir: 1, type: 'ground' },
            { id: 7, x: 700, y: 50, range: 20, startX: 700, dir: -1, type: 'fly', phase: 0.5 },
            { id: 8, x: 820, y: 75, range: 30, startX: 820, dir: 1, type: 'ground' },
            { id: 9, x: 1000, y: 55, range: 15, startX: 1000, dir: -1, type: 'ground' },
            { id: 10, x: 1200, y: 30, range: 40, startX: 1200, dir: 1, type: 'fly' },
        ];
    }, []);

    const startGame = () => {
        playerState.current = { x: 5, y: 50, vx: 0, vy: 0, isJumping: false, facing: 'right', isWalking: false, isPowered: false, powerTimeout: 0 };
        cameraState.current = 0;
        coinsRef.current.forEach(c => c.collected = false);
        setScore(0);
        setPowerTimeLeft(0);
        gameRunning.current = true;
        setGameState('PLAYING');
    };

    const handleGameOver = (finalScore: number) => {
        gameRunning.current = false;
        setGameState('GAMEOVER');
        onGameOver(finalScore);
    };

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const controlKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
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

    // GAME LOOP
    useEffect(() => {
        if (gameState !== 'PLAYING') return;
        let frameId: number;
        let lastTime = performance.now();
        let currentScore = 0;

        const pEl = playerDivRef.current;

        const loop = (time: number) => {
            if (!gameRunning.current) return;

            const deltaTime = (time - lastTime) / 16.67;
            lastTime = time;

            const p = playerState.current;
            const speedLimit = p.isPowered ? POWER_MAX_SPEED : MAX_SPEED;

            const moveRight = keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['BtnRight'];
            const moveLeft = keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['BtnLeft'];

            if (moveRight) {
                p.vx += ACCELERATION * deltaTime;
                p.facing = 'right';
                p.isWalking = true;
            } else if (moveLeft) {
                p.vx -= ACCELERATION * deltaTime;
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
            p.x += p.vx * deltaTime;

            const isJumpPressed = keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['BtnJump'];

            if (isJumpPressed && !p.isJumping) {
                p.vy = JUMP_FORCE;
                p.isJumping = true;
            }

            if (!isJumpPressed && p.vy < -2) {
                p.vy *= 0.6;
            }

            p.vy += GRAVITY * deltaTime;
            p.y += p.vy * deltaTime;

            // Platform collisions
            let onPlatform = false;
            const plats = platformsRef.current;
            for (let i = 0; i < plats.length; i++) {
                const plat = plats[i];
                const withinPlatformX = p.x + 4 > plat.x && p.x - 4 < plat.x + plat.w;
                if (withinPlatformX) {
                    if (p.vy >= 0 && p.y >= plat.y && p.y - p.vy * deltaTime <= plat.y + 2) {
                        p.y = plat.y;
                        p.vy = 0;
                        onPlatform = true;
                        break;
                    }
                }
            }
            p.isJumping = !onPlatform;

            // Obstacles
            obstaclesRef.current.forEach(obs => {
                if (obs.y > 200) return;

                if (obs.type === 'ground') {
                    obs.x += (0.18 * obs.dir) * deltaTime;
                    if (obs.x < obs.startX - obs.range || obs.x > obs.startX + obs.range) {
                        obs.dir *= -1;
                        obs.x = Math.max(obs.startX - obs.range, Math.min(obs.x, obs.startX + obs.range));
                    }
                } else {
                    obs.x += (0.25 * obs.dir) * deltaTime;
                    if (obs.x < obs.startX - obs.range || obs.x > obs.startX + obs.range) {
                        obs.dir *= -1;
                        obs.x = Math.max(obs.startX - obs.range, Math.min(obs.x, obs.startX + obs.range));
                    }
                    const phase = obs.phase || 0;
                    obs.y = 25 + Math.sin(time / 400 + phase) * 12;
                }

                const obsEl = document.getElementById(`ninja-obs-${obs.id}`);
                if (obsEl) {
                    if (obs.y > 200) {
                        obsEl.style.display = 'none';
                    } else {
                        obsEl.style.left = `${obs.x}%`;
                        obsEl.style.top = `${obs.y}%`;
                    }
                }

                const dx = Math.abs(obs.x - p.x);
                const dy = Math.abs(obs.y - (p.y - 5));
                if (dx < 4 && dy < 6) {
                    if (p.isPowered) {
                        obs.y = 500;
                        currentScore += 500;
                        setScore(currentScore);
                        onScoreChange(currentScore);
                        const el = document.getElementById(`ninja-obs-${obs.id}`);
                        if (el) el.style.display = 'none';
                    } else {
                        setScore(currentScore);
                        handleGameOver(currentScore);
                        return;
                    }
                }
            });

            if (p.y > 120) {
                setScore(currentScore);
                handleGameOver(currentScore);
                return;
            }

            // Camera
            const targetCam = p.x - 45;
            cameraState.current += (targetCam - cameraState.current) * 0.1;
            cameraState.current = Math.max(0, cameraState.current);

            if (cameraDivRef.current) {
                cameraDivRef.current.style.transform = `translateX(-${cameraState.current}%)`;
            }

            // Coins
            coinsRef.current.forEach(c => {
                if (!c.collected) {
                    if (Math.abs(c.x - p.x) < 6 && Math.abs(c.y - p.y) < 12) {
                        c.collected = true;
                        const coinEl = document.getElementById(`ninja-coin-${c.id}`);
                        if (coinEl) coinEl.style.display = 'none';

                        if (c.type === 'coin') {
                            currentScore += 100;
                        } else {
                            p.isPowered = true;
                            p.powerTimeout = Date.now() + 10000;
                            currentScore += 1000;
                        }
                        setScore(currentScore);
                        onScoreChange(currentScore);
                    }
                }
            });

            // Player render
            if (pEl) {
                pEl.style.left = `${p.x}%`;
                pEl.style.top = `${p.y}%`;
                pEl.style.transform = `translate(-50%, -100%) scaleX(${p.facing === 'left' ? -1 : 1})`;
            }

            // Power timer
            if (p.isPowered && Date.now() > p.powerTimeout) {
                p.isPowered = false;
                setPowerTimeLeft(0);
            } else if (p.isPowered) {
                if (Math.random() < 0.1) setPowerTimeLeft(Math.ceil((p.powerTimeout - Date.now()) / 1000));
            }

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [gameState]);

    const setKey = (k: string, v: boolean) => (keys.current[k] = v);

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200"></div>

            {/* Clouds */}
            <div className="absolute top-[5%] left-[10%] w-[15%] h-[8%] bg-white/80 rounded-full blur-sm"></div>
            <div className="absolute top-[8%] left-[35%] w-[20%] h-[10%] bg-white/70 rounded-full blur-sm"></div>

            {/* Game World */}
            <div ref={cameraDivRef} className="absolute inset-0">
                {/* Hills */}
                <div className="absolute bottom-[18%] w-[500%] h-[25%] pointer-events-none">
                    <svg viewBox="0 0 5000 200" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,150 Q200,50 400,120 T800,80 T1200,140 T1600,60 T2000,130 L5000,200 L0,200 Z" fill="#86efac" />
                    </svg>
                </div>

                {/* Platforms */}
                {platformsRef.current.map((p, i) => (
                    <div
                        key={i}
                        className="absolute bg-[#3E2723] border-[4px] sm:border-[6px] border-black"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: '200%' }}
                    >
                        <div className="w-full h-4 sm:h-8 bg-emerald-500 border-b-2 sm:border-b-4 border-black"></div>
                    </div>
                ))}

                {/* Coins */}
                {coinsRef.current.map((c) => (
                    <div
                        key={c.id}
                        id={`ninja-coin-${c.id}`}
                        className="absolute text-2xl sm:text-4xl"
                        style={{ left: `${c.x}%`, top: `${c.y - 8}%`, transform: 'translateX(-50%)', display: c.collected ? 'none' : 'flex' }}
                    >
                        {c.type === 'coin' ? '💎' : '⚡'}
                    </div>
                ))}

                {/* Obstacles */}
                {obstaclesRef.current.map((obs) => (
                    <div
                        key={obs.id}
                        id={`ninja-obs-${obs.id}`}
                        className="absolute w-[6%] sm:w-[4%] h-[10%] sm:h-[8%] flex items-center justify-center"
                        style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: 'translate(-50%, -100%)' }}
                    >
                        <div className={`w-full h-full rounded-full border-2 border-black flex items-center justify-center ${obs.type === 'fly' ? 'bg-purple-600' : 'bg-red-600'}`}>
                            <span className="text-white text-xs">👾</span>
                        </div>
                    </div>
                ))}

                {/* Player */}
                <div
                    ref={playerDivRef}
                    className="absolute w-[8%] h-[14%] z-50"
                    style={{ left: `${playerState.current.x}%`, top: `${playerState.current.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                    <NeuralNinja playerRef={useRef(null)} />
                </div>
            </div>

            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
                <div className="bg-black text-white px-3 py-1 font-black text-lg border-2 border-white">{score}</div>
                <div className="bg-white border-2 border-black px-3 py-1 font-black text-lg">{localName || 'PLAYER'}</div>
            </div>

            {/* Enter Name */}
            {gameState === 'ENTER_NAME' && (
                <div className="absolute inset-0 z-[150] bg-black/85 flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#00A1FF] text-center max-w-sm w-full">
                        <h3 className="text-2xl font-black uppercase mb-4">🥷 NINJA RUN</h3>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder="ENTER NAME..."
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value.toUpperCase())}
                            className="w-full p-3 border-4 border-black font-black text-lg text-center uppercase focus:bg-yellow-50 outline-none mb-4"
                        />
                        <button
                            disabled={!localName.trim()}
                            onClick={confirmName}
                            className="cartoon-btn w-full bg-[#00A1FF] text-white py-3 font-black text-lg uppercase disabled:opacity-50"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            )}

            {/* Ready Screen */}
            {gameState === 'READY' && (
                <div className="absolute inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#FFD600] text-center max-w-sm">
                        <h3 className="text-3xl font-black mb-2 uppercase">🥷 NINJA RUN</h3>
                        <p className="text-base font-bold mb-4 text-gray-600">Collect gems, avoid enemies!</p>
                        <button onClick={startGame} className="cartoon-btn w-full bg-[#00A1FF] text-white py-3 font-black text-xl uppercase">
                            START
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over */}
            {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 z-[150] bg-red-600/80 flex items-center justify-center p-4">
                    <div className="bg-white border-8 border-black p-6 shadow-[15px_15px_0_#000] text-center max-w-sm">
                        <h3 className="text-3xl font-black mb-4 text-red-600 uppercase">GAME OVER</h3>
                        <p className="text-2xl font-black mb-4">Score: {score}</p>
                        <button onClick={startGame} className="cartoon-btn w-full bg-[#00A1FF] text-white py-4 font-black text-xl uppercase">
                            RETRY
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Controls */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-[200] pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onPointerDown={() => setKey('BtnLeft', true)}
                        onPointerUp={() => setKey('BtnLeft', false)}
                        onPointerLeave={() => setKey('BtnLeft', false)}
                        className="w-12 h-12 bg-white/20 backdrop-blur border-4 border-white/50 rounded-xl flex items-center justify-center active:scale-95"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                        onPointerDown={() => setKey('BtnRight', true)}
                        onPointerUp={() => setKey('BtnRight', false)}
                        onPointerLeave={() => setKey('BtnRight', false)}
                        className="w-12 h-12 bg-white/20 backdrop-blur border-4 border-white/50 rounded-xl flex items-center justify-center active:scale-95"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
                <button
                    onPointerDown={() => setKey('BtnJump', true)}
                    onPointerUp={() => setKey('BtnJump', false)}
                    onPointerLeave={() => setKey('BtnJump', false)}
                    className="w-14 h-14 bg-[#FF4B4B]/90 border-4 border-black rounded-full flex items-center justify-center text-white font-black text-sm pointer-events-auto active:scale-95"
                >
                    JUMP
                </button>
            </div>
        </div>
    );
};

export default NinjaGame;
