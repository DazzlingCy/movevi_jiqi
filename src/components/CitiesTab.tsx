import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, ChevronLeft } from 'lucide-react';
import { CITIES_BY_CONTINENT, CONTINENTS_ORDER, CityData } from '../data/cities';
import { cn } from '../lib/utils';

const CONTINENT_ICONS: Record<string, string> = {
  '中国': '🏯',
  '亚洲其他': '🪷',
  '欧洲': '🏰',
  '非洲': '🏜️',
  '北美洲': '🗽',
  '南美洲': '⛰️',
  '大洋洲': '🗿'
};

export default function CitiesTab({ onCityClick, onBack }: { onCityClick?: (city: CityData) => void; onBack?: () => void }) {
  const [activeContinent, setActiveContinent] = useState(CONTINENTS_ORDER[0]);

  return (
    <div className="w-full h-full bg-[#05070A] flex flex-col text-slate-100 font-sans">
      {/* Header */}
      <div className="shrink-0 bg-black/40 backdrop-blur-md pt-4 pb-4 border-b border-white/10 relative z-20 flex items-center justify-between px-6">
        <div className="w-10">
          {onBack && (
            <button 
              type="button" 
              onClick={onBack} 
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        <h1 className="text-base font-bold text-center tracking-wider">城市星图列表</h1>
        <div className="w-10" />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[110px] shrink-0 bg-white/0 border-r border-white/5 flex flex-col items-center py-6 overflow-y-auto hide-scrollbar space-y-7 z-25">
          {CONTINENTS_ORDER.map(continent => {
            const isActive = activeContinent === continent;
            return (
              <button
                key={continent}
                onClick={() => setActiveContinent(continent)}
                className="flex flex-col items-center gap-2 relative w-full group cursor-pointer"
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-cyan-400 rounded-r-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                  />
                )}
                <div className={cn(
                  "relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border-2",
                  isActive 
                    ? "bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]" 
                    : "bg-white/5 border-transparent group-hover:bg-white/10 opacity-60"
                )}>
                  {CONTINENT_ICONS[continent]}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#0B1015]" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold tracking-widest transition-colors uppercase",
                  isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                )}>
                  {continent}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 bg-[#05070A] pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
            {CITIES_BY_CONTINENT[activeContinent]?.map((city, idx) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onCityClick && onCityClick(city)}
                className="bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-4 gap-4 cursor-pointer hover:bg-slate-800/60 transition-all duration-300 relative group"
              >
                <div className="relative w-full h-44 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
                  
                  {/* Status indicator badge */}
                  <div className={cn(
                    "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border",
                    city.status === 'lit' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300. h-fit" :
                    city.status === 'in-progress' ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse" :
                    "bg-black/60 border-white/10 text-slate-400"
                  )}>
                    {city.status === 'lit' ? "已点亮" : city.status === 'in-progress' ? "进行中" : "未开启"}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-lg font-black text-slate-100 tracking-wide group-hover:text-cyan-400 transition-colors">{city.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">{city.englishName}</p>
                  </div>
                  
                  <div className="flex gap-6 my-4 border-y border-white/5 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-200 font-mono">{city.routes}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">线路</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-200 font-mono">{city.spots}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">景点</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">唤醒进度</span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{city.completed}/{city.routes}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                        style={{ width: `${(city.completed / city.routes) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {(!CITIES_BY_CONTINENT[activeContinent] || CITIES_BY_CONTINENT[activeContinent].length === 0) && (
              <div className="col-span-full text-center text-slate-500 text-xs py-20 font-mono tracking-widest">
                NO CITY STATIONS LOCATED IN THIS REGION
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
