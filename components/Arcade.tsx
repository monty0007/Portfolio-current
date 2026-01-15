import React, { useState, useEffect } from 'react';
import { getTopScores, saveScore as saveScoreToDb } from '../services/scoreService';
import NinjaGame from './NinjaGame';
import RacingGame from './RacingGame';
import FlappyGame from './FlappyGame';

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Arcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'ninja' | 'racing' | 'flappy'>('ninja');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getTopScores();
      setLeaderboard(scores);
    };
    fetchScores();
  }, []);

  const saveScore = async (score: number) => {
    if (!playerName.trim()) return;

    setLeaderboard(prev => {
      const existingIndex = prev.findIndex(e => e.name === playerName);
      let updated = [...prev];

      if (existingIndex !== -1) {
        if (score > updated[existingIndex].score) {
          updated[existingIndex] = { name: playerName, score };
        }
      } else {
        updated.push({ name: playerName, score });
      }

      return updated.sort((a, b) => b.score - a.score).slice(0, 5);
    });

    await saveScoreToDb(playerName, score);
  };

  return (
    <section id="arcade" className="py-24 px-4 bg-[#FFD600] border-y-8 border-black flex flex-col items-center overflow-hidden relative">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-black text-white px-4 sm:px-6 py-2 font-black uppercase text-sm sm:text-xl mb-4 rotate-[-1deg] shadow-[6px_6px_0px_#00A1FF]">
            NEURAL ARCADE V5.4
          </div>
          <h2 className="text-4xl sm:text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-none">
            ACTION <span className="text-white" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px #FF4B4B' }}>BASTION</span>
          </h2>
        </header>

        {/* Game Selector - Compact pill buttons */}
        <div className="flex gap-2 mb-6 bg-black/10 p-2 rounded-full border-4 border-black">
          <button
            onClick={() => setActiveGame('ninja')}
            className={`px-3 sm:px-5 py-2 rounded-full font-black uppercase text-[10px] sm:text-xs transition-all ${activeGame === 'ninja'
              ? 'bg-[#00A1FF] text-white shadow-[2px_2px_0_#000]'
              : 'bg-white/80 hover:bg-white text-black'
              }`}
          >
            🥷 Ninja
          </button>
          <button
            onClick={() => setActiveGame('racing')}
            className={`px-3 sm:px-5 py-2 rounded-full font-black uppercase text-[10px] sm:text-xs transition-all ${activeGame === 'racing'
              ? 'bg-[#FF4B4B] text-white shadow-[2px_2px_0_#000]'
              : 'bg-white/80 hover:bg-white text-black'
              }`}
          >
            🏎️ Racing
          </button>
          <button
            onClick={() => setActiveGame('flappy')}
            className={`px-3 sm:px-5 py-2 rounded-full font-black uppercase text-[10px] sm:text-xs transition-all ${activeGame === 'flappy'
              ? 'bg-[#73BF2E] text-white shadow-[2px_2px_0_#000]'
              : 'bg-white/80 hover:bg-white text-black'
              }`}
          >
            🐦 Flappy
          </button>
        </div>

        {/* Game Cabinet */}
        <div className="w-full max-w-[900px] aspect-[16/10] bg-[#111] border-[6px] sm:border-[12px] border-black rounded-2xl sm:rounded-[3rem] shadow-[10px_10px_0px_#000] sm:shadow-[30px_30px_0px_#000] relative overflow-hidden flex flex-col p-2 sm:p-3 mb-12">
          <div className="flex-1 rounded-xl sm:rounded-[2rem] overflow-hidden relative border-2 sm:border-4 border-black/40">
            {activeGame === 'ninja' && (
              <NinjaGame
                key="ninja"
                playerName={playerName}
                onGameOver={saveScore}
                onScoreChange={() => { }}
                onNameChange={(name) => setPlayerName(name)}
              />
            )}
            {activeGame === 'racing' && (
              <RacingGame
                key="racing"
                playerName={playerName}
                onGameOver={saveScore}
                onNameChange={(name) => setPlayerName(name)}
              />
            )}
            {activeGame === 'flappy' && (
              <FlappyGame
                key="flappy"
                playerName={playerName}
                onGameOver={saveScore}
                onNameChange={(name) => setPlayerName(name)}
              />
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="w-full max-w-2xl">
          <div className="bg-black text-[#FFD600] px-6 py-2 font-black uppercase text-lg inline-block rotate-1 shadow-[6px_6px_0px_#000] mb-4">
            🏆 TOP 5 PLAYERS
          </div>
          <div className="bg-white border-[6px] border-black p-6 shadow-[12px_12px_0px_#000] -rotate-1">
            {leaderboard.length === 0 ? (
              <div className="text-center py-4 text-gray-400 font-black uppercase">No scores yet!</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, i) => (
                  <div key={i} className={`flex items-center justify-between border-b-2 border-black/10 pb-2 ${entry.name === playerName ? 'bg-yellow-100 -mx-2 px-2 rounded' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl sm:text-3xl font-black text-[#FF4B4B]">#{i + 1}</span>
                      <span className="text-lg sm:text-xl font-black uppercase">{entry.name}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#00A1FF]">{entry.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Arcade;
