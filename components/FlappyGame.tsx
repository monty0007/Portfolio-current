import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Pipe {
    id: number;
    x: number;
    gapY: number; // Center of gap
    passed: boolean;
}

interface FlappyGameProps {
    playerName: string;
    onGameOver: (score: number) => void;
    onNameChange?: (name: string) => void;
}

const FlappyGame: React.FC<FlappyGameProps> = ({ playerName, onGameOver, onNameChange }) => {
    const [gameState, setGameState] = useState<'ENTER_NAME' | 'READY' | 'PLAYING' | 'GAMEOVER'>(playerName ? 'READY' : 'ENTER_NAME');
    const [score, setScore] = useState(0);
    const [localName, setLocalName] = useState(playerName || '');
    const [pipes, setPipes] = useState<Pipe[]>([]);
    const [birdY, setBirdY] = useState(50);
    const [birdRotation, setBirdRotation] = useState(0);

    const gameRunning = useRef(false);
    const birdVelocity = useRef(0);
    const birdYRef = useRef(50);
    const scoreRef = useRef(0);
    const frameIdRef = useRef<number>(0);
    const lastPipeRef = useRef(0);

    const GRAVITY = 0.35;
    const FLAP_FORCE = -6;
    const PIPE_SPEED = 1.8;
    const GAP_SIZE = 32; // Larger gap for easier gameplay

    const confirmName = () => {
        if (localName.trim()) {
            onNameChange?.(localName.toUpperCase());
            setGameState('READY');
        }
    };

    const startGame = () => {
        birdYRef.current = 50;
        birdVelocity.current = 0;
        scoreRef.current = 0;
        lastPipeRef.current = 0;
        setBirdY(50);
        setBirdRotation(0);
        setScore(0);
        setPipes([]);
        gameRunning.current = true;
        setGameState('PLAYING');
    };

    const handleGameOver = useCallback(() => {
        gameRunning.current = false;
        setGameState('GAMEOVER');
        onGameOver(scoreRef.current);
    }, [onGameOver]);

    const flap = useCallback(() => {
        if (gameState === 'PLAYING') {
            birdVelocity.current = FLAP_FORCE;
        }
    }, [gameState]);

    // Input handling
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
                e.preventDefault();
                flap();
            }
        };

        const handleClick = () => flap();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);
        window.addEventListener('touchstart', handleClick);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('touchstart', handleClick);
        };
    }, [gameState, flap]);

    // Game loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const loop = (time: number) => {
            if (!gameRunning.current) return;

            // Update bird
            birdVelocity.current += GRAVITY;
            birdYRef.current += birdVelocity.current * 0.5;

            // Clamp bird position
            if (birdYRef.current < 5) {
                birdYRef.current = 5;
                birdVelocity.current = 0;
            }
            if (birdYRef.current > 90) {
                handleGameOver();
                return;
            }

            // Bird rotation based on velocity
            const rotation = Math.min(90, Math.max(-30, birdVelocity.current * 5));
            setBirdRotation(rotation);
            setBirdY(birdYRef.current);

            // Spawn pipes
            if (time - lastPipeRef.current > 2000) {
                const gapY = 30 + Math.random() * 40; // Gap center between 30-70%
                setPipes(prev => [...prev, {
                    id: Date.now(),
                    x: 105,
                    gapY,
                    passed: false
                }]);
                lastPipeRef.current = time;
            }

            // Update pipes
            setPipes(prev => {
                const updated: Pipe[] = [];
                let died = false;

                for (const pipe of prev) {
                    const newX = pipe.x - PIPE_SPEED * 0.3;

                    // Collision check - only when pipe overlaps bird x position (bird is at 15%)
                    // Pipe is 12% wide, so check when pipe.x is between 8% and 22%
                    if (newX > 8 && newX < 22) {
                        // Use smaller hitbox for bird (just 2% margin)
                        const birdTop = birdYRef.current - 2;
                        const birdBottom = birdYRef.current + 2;
                        const gapTop = pipe.gapY - GAP_SIZE / 2;
                        const gapBottom = pipe.gapY + GAP_SIZE / 2;

                        if (birdTop < gapTop || birdBottom > gapBottom) {
                            died = true;
                        }
                    }

                    // Score when passing pipe
                    if (!pipe.passed && newX < 15) {
                        pipe.passed = true;
                        scoreRef.current += 1;
                        setScore(scoreRef.current);
                    }

                    if (newX > -10) {
                        updated.push({ ...pipe, x: newX });
                    }
                }

                if (died) {
                    setTimeout(() => handleGameOver(), 0);
                    return [];
                }

                return updated;
            });

            frameIdRef.current = requestAnimationFrame(loop);
        };

        frameIdRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameIdRef.current);
    }, [gameState, handleGameOver]);

    return (
        <div className="w-full h-full relative overflow-hidden select-none" style={{ touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
            {/* Sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4EC0CA] to-[#70C5CE]"></div>

            {/* Clouds */}
            <div className="absolute top-[15%] left-[10%] w-[20%] h-[8%] bg-white/80 rounded-full"></div>
            <div className="absolute top-[25%] left-[50%] w-[25%] h-[10%] bg-white/80 rounded-full"></div>
            <div className="absolute top-[10%] left-[70%] w-[18%] h-[7%] bg-white/80 rounded-full"></div>

            {/* Pipes */}
            {pipes.map(pipe => (
                <div key={pipe.id}>
                    {/* Top pipe */}
                    <div
                        className="absolute w-[12%] bg-[#73BF2E] border-4 border-[#557C1E]"
                        style={{
                            left: `${pipe.x}%`,
                            top: 0,
                            height: `${pipe.gapY - GAP_SIZE / 2}%`
                        }}
                    >
                        <div className="absolute bottom-0 left-[-4px] right-[-4px] h-6 bg-[#73BF2E] border-4 border-[#557C1E]"></div>
                    </div>
                    {/* Bottom pipe */}
                    <div
                        className="absolute w-[12%] bg-[#73BF2E] border-4 border-[#557C1E]"
                        style={{
                            left: `${pipe.x}%`,
                            top: `${pipe.gapY + GAP_SIZE / 2}%`,
                            bottom: '20%'
                        }}
                    >
                        <div className="absolute top-0 left-[-4px] right-[-4px] h-6 bg-[#73BF2E] border-4 border-[#557C1E]"></div>
                    </div>
                </div>
            ))}

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-[#DED895]">
                <div className="absolute top-0 left-0 right-0 h-4 bg-[#73BF2E]"></div>
            </div>

            {/* Bird */}
            <div
                className="absolute left-[15%] w-10 h-8 sm:w-12 sm:h-10 transition-none"
                style={{
                    top: `${birdY}%`,
                    transform: `translateX(-50%) translateY(-50%) rotate(${birdRotation}deg)`
                }}
            >
                <div className="w-full h-full bg-[#F8E81C] rounded-full border-3 border-[#D4A017] relative shadow-lg">
                    {/* Eye */}
                    <div className="absolute top-[20%] right-[15%] w-3 h-3 bg-white rounded-full border border-black">
                        <div className="absolute top-1 right-0 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                    {/* Beak */}
                    <div className="absolute top-[40%] right-[-20%] w-4 h-3 bg-[#FA6A00] rounded-r-full"></div>
                    {/* Wing */}
                    <div className="absolute top-[45%] left-[10%] w-[40%] h-[35%] bg-[#E8D71C] rounded-full border border-[#D4A017]"></div>
                </div>
            </div>

            {/* HUD */}
            <div className="absolute top-2 left-2 right-2 flex justify-between z-50 pointer-events-none">
                <div className="bg-black/70 text-white px-2 py-1 font-black text-sm border border-white rounded">
                    {localName || 'PLAYER'}
                </div>
                <div className="bg-white text-black px-4 py-2 font-black text-2xl border-4 border-black rounded-lg shadow-[3px_3px_0_#000]">
                    {score}
                </div>
            </div>

            {/* Enter Name */}
            {gameState === 'ENTER_NAME' && (
                <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#73BF2E] text-center max-w-sm w-full">
                        <h3 className="text-2xl font-black uppercase mb-4">🐦 FLAPPY BIRD</h3>
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
                            className="cartoon-btn w-full bg-[#73BF2E] text-white py-3 font-black text-lg uppercase disabled:opacity-50"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            )}

            {/* Ready */}
            {gameState === 'READY' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#F8E81C] text-center max-w-sm">
                        <h3 className="text-3xl font-black uppercase mb-2">🐦 FLAPPY BIRD</h3>
                        <p className="text-base font-bold mb-4 text-gray-600">Tap or press SPACE to fly!</p>
                        <button
                            onClick={startGame}
                            className="cartoon-btn w-full bg-[#73BF2E] text-white py-3 font-black text-xl uppercase"
                        >
                            START
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over */}
            {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#000] text-center max-w-sm">
                        <h3 className="text-2xl font-black uppercase mb-2 text-red-600">GAME OVER</h3>
                        <p className="text-3xl font-black mb-4">{score} 🏆</p>
                        <button
                            onClick={startGame}
                            className="cartoon-btn w-full bg-[#73BF2E] text-white py-3 font-black text-xl uppercase"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            )}

            {/* Tap hint during play */}
            {gameState === 'PLAYING' && score === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 font-black text-xl pointer-events-none animate-pulse">
                    TAP TO FLY
                </div>
            )}
        </div>
    );
};

export default FlappyGame;
