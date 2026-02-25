import React from 'react';
import { Activity } from 'lucide-react';

interface HUDProps {
    lvl: number;
    xp: number;
    health: number;
}

export const HUD: React.FC<HUDProps> = ({ lvl, xp, health }) => (
    <div className="absolute top-8 left-8 pointer-events-none font-mono">
        <div className="flex items-center gap-2 text-[#E056FD] mb-2">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest">Kernel_Purge_Status</span>
        </div>
        <div className="text-4xl font-black text-white italic tracking-tighter">
            LVL_{lvl.toString().padStart(2, '0')}
        </div>
        <div className="w-48 h-1 bg-[#111] mt-2">
            <div className="h-full bg-[#E056FD] transition-all" style={{ width: `${xp}%` }} />
        </div>
        <div className="w-48 h-1 bg-[#111] mt-1">
            <div className="h-full bg-[#FF003C] transition-all" style={{ width: `${health}%` }} />
        </div>
    </div>
);