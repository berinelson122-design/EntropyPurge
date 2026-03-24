// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './game/scenes/MainScene';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);
    const [gameState, setGameState] = useState({ level: 1, isLeveling: false, score: 0, sysMsg: null as string | null });

    useEffect(() => {
        // 1. HARDWARE GUARD: Ensure the DOM node exists and game isn't already running
        if (!gameRef.current || gameInstance.current) return;

        // 2. DOM PURGE: Clear the container to prevent multiple canvas stacking
        gameRef.current.innerHTML = '';

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            backgroundColor: '#000000',
            physics: {
                default: 'arcade',
                arcade: { debug: false }
            },
            scene: [MainScene],
        };

        // 3. INITIALIZE ENGINE
        const game = new Phaser.Game(config);
        gameInstance.current = game;

        // 4. EVENT HANDSHAKE (Use a stable listener)
        game.events.on('LEVEL_UP', (lvl: number) => {
            setGameState(s => ({ ...s, isLeveling: true, level: lvl }));
            // Instead of pausing here, we let the scene handle the transition
        });
        game.events.on('SCORE_UPDATE', (score: number) => {
            setGameState(s => ({ ...s, score }));
        });
        game.events.on('SYS_MSG', (msg: string) => {
            setGameState(s => ({ ...s, sysMsg: msg }));
            setTimeout(() => {
                setGameState(s => (s.sysMsg === msg ? { ...s, sysMsg: null } : s));
            }, 4000);
        });

        // 5. DESTRUCTION PROTOCOL (Cleanup)
        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []); // STABLE: Empty dependency array ensures game only starts ONCE.

    const selectUpgrade = (type: string) => {
        const scene = gameInstance.current?.scene.getScene('MainScene') as MainScene;
        if (scene) {
            scene.applyUpgrade(type);
            setGameState(s => ({ ...s, isLeveling: false }));
            gameInstance.current?.scene.resume('MainScene');
        }
    };

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-mono">
            {/* THE PHASER HUB */}
            <div ref={gameRef} id="game-container" className="border-2 border-white/10 shadow-[0_0_50px_rgba(224,86,253,0.1)]" />

            {/* REACT HUD OVERLAY */}
            <div className="absolute top-8 left-8 pointer-events-none z-20 flex flex-col gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#E056FD] mb-2">
                        <Activity size={14} className="animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest">Kernel_Uptime</span>
                    </div>
                    <div className="text-4xl font-black text-white italic uppercase tracking-tighter shadow-black drop-shadow-lg">
                        LVL_{gameState.level.toString().padStart(2, '0')}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] text-[#00F3FF] uppercase tracking-widest mb-1">Entropy_Mined</div>
                    <div className="text-3xl font-black text-white tracking-widest shadow-black drop-shadow-lg">
                        {gameState.score.toString().padStart(6, '0')}
                    </div>
                </div>
            </div>

            {/* SYSTEM ALERTS OVERLAY */}
            {gameState.sysMsg && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div className="bg-[#FF003C]/20 border-l-4 border-r-4 border-[#FF003C] text-[#FF003C] px-8 py-3 font-black uppercase tracking-widest text-lg backdrop-blur-sm relative overflow-hidden animate-pulse shadow-[0_0_30px_rgba(255,0,60,0.4)]">
                        <div className="absolute inset-0 bg-[#FF003C] opacity-10"></div>
                        [ {gameState.sysMsg} ]
                    </div>
                </div>
            )}

            {/* UPGRADE INTERFACE */}
            {gameState.isLeveling && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in zoom-in duration-200">
                    <h2 className="text-4xl font-black text-[#E056FD] mb-12 tracking-tighter uppercase italic">Patch_Selection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl px-4">
                        <button onClick={() => selectUpgrade('fire_rate')} className="p-6 bg-[#050505] border-2 border-[#00F3FF] hover:bg-[#00F3FF] hover:text-black transition-all text-left">
                            <div className="text-xl font-black uppercase">Bandwidth</div>
                            <div className="text-[10px] opacity-70 mt-2">+20% ATTACK_SPEED</div>
                        </button>
                        <button onClick={() => selectUpgrade('health')} className="p-6 bg-[#050505] border-2 border-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all text-left">
                            <div className="text-xl font-black uppercase">Firewall</div>
                            <div className="text-[10px] opacity-70 mt-2">RESTORE_INTEGRITY</div>
                        </button>
                        <button onClick={() => selectUpgrade('damage')} className="p-6 bg-[#050505] border-2 border-[#FF003C] hover:bg-[#FF003C] hover:text-black transition-all text-left">
                            <div className="text-xl font-black uppercase">Payload</div>
                            <div className="text-[10px] opacity-70 mt-2">+15% LOGIC_DAMAGE</div>
                        </button>
                    </div>
                </div>
            )}

            <div className="fixed bottom-4 right-4 text-[10px] text-[#E056FD] opacity-30">
                ARCHITECT // VOID_WEAVER
            </div>
        </div>
    );
};

export default App;