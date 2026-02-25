import React from 'react';

export const UpgradeScreen: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-8 font-mono">
        <h2 className="text-4xl font-black text-[#E056FD] mb-12 tracking-tighter italic uppercase border-b-4 border-[#E056FD]">
            Uplink_Optimization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {[
                { id: 'fire_rate', title: 'Bandwidth', desc: '-20% Reload Latency', color: '#00F3FF' },
                { id: 'health', title: 'Firewall', desc: 'Restore Integrity', color: '#39FF14' },
                { id: 'damage', title: 'Payload', desc: '+15% Logic Damage', color: '#FF003C' }
            ].map(up => (
                <button key={up.id} onClick={() => onSelect(up.id)}
                    className="p-6 bg-[#050505] border-2 border-white/10 hover:border-[#E056FD] transition-all text-left">
                    <div className="text-[10px] mb-2 font-bold" style={{ color: up.color }}>// PATCH_{up.id.toUpperCase()}</div>
                    <div className="text-xl font-black text-white mb-2 uppercase">{up.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{up.desc}</div>
                </button>
            ))}
        </div>
    </div>
);