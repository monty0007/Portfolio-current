import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Obstacle {
    id: number;
    lane: number;
    y: number;
    type: 'car' | 'truck';
    color: string;
}

interface RacingGameProps {
    playerName: string;
    onGameOver: (score: number) => void;
    onNameChange?: (name: string) => void;
}

const CAR_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];

const RacingGame: React.FC<RacingGameProps> = ({ playerName, onGameOver, onNameChange }) => {
    // Skip name entry if name already provided
    const [gameState, setGameState] = useState<'ENTER_NAME' | 'READY' | 'PLAYING' | 'GAMEOVER'>(playerName ? 'READY' : 'ENTER_NAME');
    const [score, setScore] = useState(0);
    const [playerLane, setPlayerLane] = useState(2); // Start in middle of 5 lanes
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [localName, setLocalName] = useState(playerName || '');

    const gameRunning = useRef(false);
    const scoreRef = useRef(0);
    const speedRef = useRef(2);
    const frameIdRef = useRef<number>(0);
    const lastObstacleTimeRef = useRef(0);
    const playerLaneRef = useRef(2);

    // 5 lanes
    const NUM_LANES = 5;
    const LANE_POSITIONS = [10, 30, 50, 70, 90]; // % from left

    useEffect(() => {
        playerLaneRef.current = playerLane;
    }, [playerLane]);

    const confirmName = () => {
        if (localName.trim()) {
            onNameChange?.(localName.toUpperCase());
            setGameState('READY');
        }
    };

    const startGame = () => {
        setPlayerLane(2);
        playerLaneRef.current = 2;
        setScore(0);
        setObstacles([]);
        scoreRef.current = 0;
        speedRef.current = 2;
        lastObstacleTimeRef.current = 0;
        gameRunning.current = true;
        setGameState('PLAYING');
    };

    const handleGameOver = useCallback(() => {
        gameRunning.current = false;
        setGameState('GAMEOVER');
        onGameOver(scoreRef.current);
    }, [onGameOver]);

    // Input handling
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                setPlayerLane(prev => Math.max(0, prev - 1));
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                setPlayerLane(prev => Math.min(NUM_LANES - 1, prev + 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Game loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const loop = (time: number) => {
            if (!gameRunning.current) return;

            // Spawn obstacles
            if (time - lastObstacleTimeRef.current > 1000 - Math.min(speedRef.current * 40, 600)) {
                const lane = Math.floor(Math.random() * NUM_LANES);
                setObstacles(prev => [...prev, {
                    id: Date.now(),
                    lane,
                    y: -12,
                    type: Math.random() > 0.7 ? 'truck' : 'car',
                    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
                }]);
                lastObstacleTimeRef.current = time;
            }

            // Update obstacles
            setObstacles(prev => {
                const updated: Obstacle[] = [];
                let crashed = false;

                for (const obs of prev) {
                    const newY = obs.y + speedRef.current * 0.4;

                    // Collision detection
                    if (newY > 72 && newY < 92 && obs.lane === playerLaneRef.current) {
                        crashed = true;
                        break;
                    }

                    if (newY < 105) {
                        updated.push({ ...obs, y: newY });
                    }
                }

                if (crashed) {
                    setTimeout(() => handleGameOver(), 0);
                    return [];
                }

                return updated;
            });

            // Update score
            scoreRef.current += 1;
            if (scoreRef.current % 50 === 0) {
                setScore(scoreRef.current);
                speedRef.current = Math.min(speedRef.current + 0.05, 6);
            }

            frameIdRef.current = requestAnimationFrame(loop);
        };

        frameIdRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameIdRef.current);
    }, [gameState, handleGameOver]);

    const moveLeft = () => setPlayerLane(prev => Math.max(0, prev - 1));
    const moveRight = () => setPlayerLane(prev => Math.min(NUM_LANES - 1, prev + 1));

    return (
        <div className="w-full h-full relative overflow-hidden select-none" style={{ touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
            {/* Road Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800">
                {/* Lane dividers */}
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="absolute top-0 bottom-0 w-1 bg-yellow-300/50"
                        style={{ left: `${i * 20}%` }}
                    />
                ))}

                {/* Road edges */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white"></div>
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white"></div>

                {/* Road shoulder markings */}
                <div className="absolute left-[2%] top-0 bottom-0 w-1 bg-red-500/50"></div>
                <div className="absolute right-[2%] top-0 bottom-0 w-1 bg-red-500/50"></div>
            </div>

            {/* Obstacles - Taller car proportions */}
            {obstacles.map(obs => (
                <div
                    key={obs.id}
                    className={`absolute ${obs.type === 'truck' ? 'w-[10%] h-[14%]' : 'w-[8%] h-[10%]'}`}
                    style={{
                        left: `${LANE_POSITIONS[obs.lane]}%`,
                        top: `${obs.y}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div
                        className="w-full h-full rounded-lg border-2 border-black shadow-md"
                        style={{ backgroundColor: obs.color }}
                    >
                        {/* Windshield */}
                        <div className="absolute top-[10%] left-[10%] right-[10%] h-[25%] bg-cyan-200/70 rounded-sm border border-black/20"></div>
                        {/* Headlights */}
                        <div className="absolute top-[40%] left-[10%] w-[15%] h-[10%] bg-yellow-200 rounded-sm"></div>
                        <div className="absolute top-[40%] right-[10%] w-[15%] h-[10%] bg-yellow-200 rounded-sm"></div>
                        {/* Wheels */}
                        <div className="absolute bottom-[5%] left-[5%] w-[18%] h-[12%] bg-gray-900 rounded-full"></div>
                        <div className="absolute bottom-[5%] right-[5%] w-[18%] h-[12%] bg-gray-900 rounded-full"></div>
                    </div>
                </div>
            ))}

            {/* Player Car - Taller proportions */}
            <div
                className="absolute w-[8%] h-[10%] transition-all duration-100 ease-out"
                style={{
                    left: `${LANE_POSITIONS[playerLane]}%`,
                    bottom: '8%',
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="w-full h-full bg-[#FFD600] rounded-lg border-2 border-black shadow-[0_4px_0_#000]">
                    {/* Windshield */}
                    <div className="absolute top-[10%] left-[10%] right-[10%] h-[25%] bg-black/40 rounded-sm border border-black/30"></div>
                    {/* Racing number */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[40%] h-[20%] bg-black text-white text-[8px] sm:text-xs font-black flex items-center justify-center rounded">01</div>
                    {/* Wheels */}
                    <div className="absolute bottom-[5%] left-[5%] w-[18%] h-[12%] bg-gray-900 rounded-full"></div>
                    <div className="absolute bottom-[5%] right-[5%] w-[18%] h-[12%] bg-gray-900 rounded-full"></div>
                </div>
            </div>

            {/* HUD */}
            <div className="absolute top-2 left-2 right-2 flex justify-between z-50">
                <div className="bg-black text-white px-2 py-1 font-black text-sm border border-white rounded">
                    {localName || 'PLAYER'}
                </div>
                <div className="bg-[#FFD600] text-black px-3 py-1 font-black text-lg border-2 border-black rounded shadow-[2px_2px_0_#000]">
                    {score}m
                </div>
            </div>

            {/* Enter Name Screen */}
            {gameState === 'ENTER_NAME' && (
                <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#FF4B4B] text-center max-w-sm w-full">
                        <h3 className="text-2xl font-black uppercase mb-4">🏎️ SPEED RUSH</h3>
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
                            className="cartoon-btn w-full bg-[#FF4B4B] text-white py-3 font-black text-lg uppercase disabled:opacity-50"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            )}

            {/* Ready Screen */}
            {gameState === 'READY' && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#FFD600] text-center max-w-sm">
                        <h3 className="text-3xl font-black uppercase mb-2">🏎️ SPEED RUSH</h3>
                        <p className="text-base font-bold mb-4 text-gray-600">Dodge the traffic! 5 lanes to navigate.</p>
                        <button
                            onClick={startGame}
                            className="cartoon-btn w-full bg-[#FF4B4B] text-white py-3 font-black text-xl uppercase"
                        >
                            START ENGINE
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over */}
            {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 bg-red-600/85 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#000] text-center max-w-sm">
                        <h3 className="text-2xl font-black uppercase mb-2 text-red-600">💥 CRASH!</h3>
                        <p className="text-xl font-black mb-4">Distance: {score}m</p>
                        <button
                            onClick={startGame}
                            className="cartoon-btn w-full bg-[#00A1FF] text-white py-3 font-black text-xl uppercase"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Controls */}
            {gameState === 'PLAYING' && (
                <div className="absolute bottom-2 left-2 right-2 flex justify-between z-[200]">
                    <button
                        aria-label="Move left lane"
                        onPointerDown={moveLeft}
                        className="w-14 h-14 bg-white/25 backdrop-blur border-2 border-white/50 rounded-xl flex items-center justify-center active:scale-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                        aria-label="Move right lane"
                        onPointerDown={moveRight}
                        className="w-14 h-14 bg-white/25 backdrop-blur border-2 border-white/50 rounded-xl flex items-center justify-center active:scale-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RacingGame;
