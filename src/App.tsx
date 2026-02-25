import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './game/scenes/MainScene';
import { Activity, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);
    const [gameState, setGameState] = useState({ level: 1, xp: 0, nextLevel: 100, isLeveling: false });

    useEffect(() => {
        if (!gameRef.current || gameInstance.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            backgroundColor: '#000000',
            physics: { default: 'arcade', arcade: { debug: false } },
            scene: [MainScene],
        };

        gameInstance.current = new Phaser.Game(config);

        // EVENT_HANDSHAKE: Listen for engine signals
        gameInstance.current.events.on('LEVEL_UP', (data: any) => {
            setGameState(s => ({ ...s, isLeveling: true, level: data.level }));
            gameInstance.current?.scene.pause('MainScene');
        });

        return () => gameInstance.current?.destroy(true);
    }, []);

    const selectUpgrade = (type: string) => {
        const scene = gameInstance.current?.scene.getScene('MainScene') as MainScene;
        scene.applyUpgrade(type);
        setGameState(s => ({ ...s, isLeveling: false }));
        gameInstance.current?.scene.resume('MainScene');
    };

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-mono">
            <div ref={gameRef} className="border-2 border-white/10" />

            {/* RE-CONSTRUCTION HUD */}
            <div className="absolute top-8 left-8 pointer-events-none">
                <div className="flex items-center gap-2 text-[#E056FD] mb-2">
                    <Activity size={14} className="animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest">Kernel_Uptime</span>
                </div>
                <div className="text-4xl font-black text-white italic uppercase tracking-tighter">
                    LVL_{gameState.level.toString().padStart(2, '0')}
                </div>
            </div>

            {/* UPGRADE OVERLAY */}
            {gameState.isLeveling && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in zoom-in duration-200">
                    <h2 className="text-4xl font-black text-[#E056FD] mb-12 tracking-tighter italic uppercase border-b-4 border-[#E056FD]">Uplink_Optimization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl px-4">
                        {[
                            { id: 'fire_rate', title: 'Bandwidth Expansion', desc: '+20% Attack Speed', color: '#00F3FF' },
                            { id: 'health', title: 'Firewall Hardening', desc: '+50 Max Integrity', color: '#39FF14' },
                            { id: 'damage', title: 'Logic Bomb', desc: '+15% Payload Radius', color: '#FF003C' }
                        ].map(up => (
                            <button key={up.id} onClick={() => selectUpgrade(up.id)}
                                className="p-6 bg-[#050505] border-2 border-white/10 hover:border-white transition-all text-left group">
                                <div className="text-xs mb-2 opacity-50 font-bold" style={{ color: up.color }}>// PATCH_{up.id.toUpperCase()}</div>
                                <div className="text-xl font-black text-white mb-2 uppercase">{up.title}</div>
                                <div className="text-[10px] text-gray-500 uppercase">{up.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* WATERMARK */}
            <div className="fixed bottom-4 right-4 text-[10px] text-[#E056FD] opacity-30 select-none">
                ARCHITECT // VOID_WEAVER
            </div>
        </div>
    );
};

export default App;