import { ChevronLeft, Globe2, MapPin, Zap, Flame, Compass } from 'lucide-react';
import { CITIES, getRouteData } from '../data/cities';

interface LitRecordsViewProps {
  onBack: () => void;
}

export default function LitRecordsView({ onBack }: LitRecordsViewProps) {
  const litRoutes = CITIES.flatMap(city => 
    (city.completedRouteIndices || []).map(routeId => {
      const timestamp = (city.completedRouteTimestamps && city.completedRouteTimestamps[routeId]) || Date.now();
      return {
        city,
        routeId,
        routeData: getRouteData(city.id, routeId),
        timestamp
      };
    })
  ).sort((a, b) => b.timestamp - a.timestamp);

  const totalDistance = litRoutes.reduce((acc, curr) => {
    const distNum = parseFloat(curr.routeData.distance) || 4.5;
    return acc + distNum;
  }, 0);

  const totalTimeSeconds = litRoutes.reduce((acc, curr) => {
    const minNum = parseInt(curr.routeData.duration) || 20;
    return acc + (minNum * 60);
  }, 0);

  return (
    <div className="w-full h-full bg-[#05070a] text-slate-100 font-sans relative flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Pane: All-time Exploration Honors Card (38% width) */}
      <div className="w-full md:w-[400px] shrink-0 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between h-[45%] md:h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Back header */}
        <div className="relative z-10 flex items-center justify-between">
          <button 
            type="button"
            onClick={onBack} 
            className="w-12 h-12 rounded-2xl bg-black/75 border border-white/10 hover:border-cyan-400/40 hover:bg-black/90 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 group"
          >
            <ChevronLeft size={24} className="text-slate-300 group-hover:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <span className="text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/25 px-3 py-1 rounded-full">
            EXPLORATION LOGS
          </span>
        </div>

        {/* All-time stats block */}
        <div className="relative z-10 bg-slate-950/80 border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-cyan-500/10 border-2 border-cyan-400/60 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.25)] mb-4">
            <Compass size={32} className="text-cyan-450 animate-pulse" />
          </div>

          <h1 className="text-xl font-black text-white tracking-widest uppercase mb-1">
            航线点亮徽章册
          </h1>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-6">ALL-TIME EXPLORATION SUMMARY</p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl font-black text-cyan-400 font-mono tracking-tight">{litRoutes.length}</div>
              <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">点亮航向</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl font-black text-[#2ecc71] font-mono tracking-tight">{totalDistance.toFixed(1)}</div>
              <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">累计公里</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center col-span-2">
              <div className="text-lg font-black text-amber-500 font-mono tracking-tight">
                {Math.floor(totalTimeSeconds / 60)} <span className="text-[10px] font-medium text-slate-400">分钟</span>
              </div>
              <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">累计模拟引擎转时</div>
            </div>
          </div>
        </div>

        {/* Small motivational indicator */}
        <div className="hidden md:flex items-center gap-2.5 bg-black/40 border border-white/5 p-3 rounded-2xl text-xs">
          <Flame size={14} className="text-amber-500 animate-pulse" />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            地球广阔，足印长青。继续载入新的城际轨迹吧！
          </p>
        </div>
      </div>

      {/* Right Pane: Chrono-corridor detailed Timeline (Flex-1) */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 h-[55%] md:h-full">
        {/* Subheader */}
        <div className="shrink-0 mb-4 flex justify-between items-center">
          <div className="text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest">
            HISTORIC RECORD TIMELINE / 光纹编年史
          </div>
          <span className="text-[9px] text-slate-500 font-mono font-bold">TOTAL {litRoutes.length} EVENTS</span>
        </div>

        {/* Scrollable list of historic workouts */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pr-1 pb-24 relative">
          {litRoutes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-3xl">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">暂无实地跑轨迹</p>
              <p className="text-[10px] text-slate-600 leading-normal">点击开始一趟虚拟城市的漫跑步吧</p>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-5 py-2">
              {litRoutes.map(({ city, routeId, routeData, timestamp }, index) => {
                const isLit = city.status === 'lit';
                const dateObj = new Date(timestamp);
                const showStamp = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

                return (
                  <div key={`${city.id}-${routeId}-${index}`} className="relative group">
                    
                    {/* Glowing pulse dot connecting the timeline */}
                    <div className="absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-cyan-400/80 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

                    {/* Timeline card row detail */}
                    <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-white/5 rounded-3xl p-4 flex gap-4 transition-all duration-300">
                      
                      {/* Left Thumbnail with Map overlay on completion */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 shrine-0 relative">
                        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-transparent">
                          <Globe2 size={14} className="text-cyan-400" />
                        </div>
                      </div>

                      {/* Content details description */}
                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[9px] text-[#2ecc71] font-mono font-black uppercase tracking-widest">{showStamp}</span>
                          <span className="text-[8px] bg-cyan-500/10 border border-cyan-400/20 text-cyan-450 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{city.continent}</span>
                        </div>
                        
                        <h3 className="text-xs md:text-sm font-extrabold text-slate-100 mt-1 truncate group-hover:text-cyan-400 transition-colors">
                          {routeData.title}
                        </h3>

                        {/* Location mini text */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <MapPin size={10} className="text-cyan-400" />
                            <span>{city.name}</span>
                          </div>

                          <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-2">
                            <span>{routeData.distance} km</span>
                            <span className="text-slate-600">·</span>
                            <span>{routeData.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
