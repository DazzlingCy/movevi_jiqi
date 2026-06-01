import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, Square, MapPin, ChevronLeft, Zap, Flame, Compass, TrendingUp, Volume2, UserCheck } from 'lucide-react';

interface RunPlaybackViewProps {
  cityId: string;
  routeIndex: number;
  image: string;
  onExit: () => void;
  onComplete: (stats: { distance: number, duration: number, calories: number }) => void;
}

export default function RunPlaybackView({ cityId, routeIndex, image, onExit, onComplete }: RunPlaybackViewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Speed level determines simulated treadmill speed (increments per second)
  const [speedLevel, setSpeedLevel] = useState(8.0); // 8.0 km/h default
  const [heartRate, setHeartRate] = useState(132);   // Ambient simulated heart rate
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        
        // Base running simulation speed based on speed level
        // At 8.0 km/h, progress is ~0.0022 km/second
        const increment = (speedLevel / 3600); 
        setDistance(prev => prev + increment);

        // Random heart rate variance during treadmill workouts
        setHeartRate(prev => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const targetLimit = speedLevel > 10 ? 155 : 128;
          const next = prev + delta;
          if (next < 90) return 92;
          if (next > 190) return 188;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedLevel]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculatePace = () => {
    // Standard running pace based on speedLevel (min/km)
    if (speedLevel === 0) return "00'00\"";
    const paceInMinutes = 60 / speedLevel;
    const paceMinutes = Math.floor(paceInMinutes);
    const paceSeconds = Math.floor((paceInMinutes - paceMinutes) * 60);
    return `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
  };

  const handleStop = () => {
    setIsPlaying(false);
    setShowCompletion(true);
  };

  const increaseSpeed = () => {
    setSpeedLevel(prev => Math.min(20.0, +(prev + 0.5).toFixed(1)));
  };

  const decreaseSpeed = () => {
    setSpeedLevel(prev => Math.max(4.0, +(prev - 0.5).toFixed(1)));
  };

  const currentPercent = Math.min(100, Math.floor((distance / 5.2) * 100)); // Assume 5.2 km route

  return (
    <div className="w-full h-full bg-[#020305] relative overflow-hidden font-sans text-slate-100 flex flex-col justify-between">
      
      {/* 1. Immersive Outdoor Reality Video Background with Scanlines Effect */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center select-none"
        animate={{
          scale: isPlaying ? [1, 1.04, 1] : 1,
          transition: { duration: 32, repeat: Infinity, ease: 'linear' }
        }}
      >
        <img src={image} alt="Route Scenery" className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]" />
        
        {/* Futury vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))] pointer-events-none" />
        
        {/* Subtle LED Scanline screen styling */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-30" />
      </motion.div>

      {/* 2. Top-bar: Cruise Control Overview Status */}
      <div className="relative z-10 pt-4 px-6 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onExit} 
            className="w-11 h-11 bg-black/60 border border-white/10 hover:border-cyan-400/30 hover:bg-black/90 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft size={20} className="text-slate-300" />
          </button>
          
          <div className="bg-black/60 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
            <Compass size={14} className="text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-300 font-mono">
              第 {routeIndex} 航线 · 城市探索之旅
            </span>
          </div>
        </div>

        {/* Dynamic Odometer Progress Bar top centerpiece */}
        <div className="hidden lg:flex flex-col items-center w-72 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between w-full text-[9px] font-mono uppercase tracking-widest text-slate-400 font-black mb-1.5">
            <span>里程进度 (Odometer)</span>
            <span className="text-cyan-400">{currentPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-[#2ecc71] h-1.5 transition-all duration-1000 shadow-[0_0_8px_cyan]"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>

        {/* HUD Sound control switch */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-11 h-11 border rounded-xl flex items-center justify-center cursor-pointer transition-all ${soundEnabled ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-400' : 'bg-black/60 border-white/10 text-slate-500'}`}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* 3. Center Dashboard: Double Flank Sideboards Split */}
      <div className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-between p-6 gap-6 overflow-hidden">
        
        {/* Left Sideboard: Telemetry & Heartrate Dials Panel (Widescreen cockpit spec) */}
        <div className="w-full lg:w-72 bg-slate-950/75 border border-white/10 backdrop-blur-lg p-5 rounded-3xl flex flex-col gap-4 shadow-2xl relative">
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          
          <div className="text-[9px] text-slate-500 font-mono font-black tracking-[0.2em] uppercase">
            实时动力舱 (COCKPIT HUD)
          </div>

          {/* Odometer Giant Digit Display */}
          <div className="text-left bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[9px] text-slate-400 font-mono font-black tracking-widest uppercase mb-1">已跑里程 (km)</span>
            <div className="text-4xl font-extrabold text-white font-mono tracking-tighter flex items-baseline gap-1 animate-pulse">
              {distance.toFixed(3)}
              <span className="text-xs uppercase font-sans font-bold text-slate-500">公里</span>
            </div>
          </div>

          {/* Core dials row layout */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-black/20 p-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <span className="text-[8px] text-slate-500 font-black tracking-wider uppercase mb-0.5">预计用时</span>
              <span className="text-lg font-black text-slate-100 font-mono tracking-tight">{formatTime(time)}</span>
            </div>

            <div className="bg-black/20 p-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <span className="text-[8px] text-slate-500 font-black tracking-wider uppercase mb-0.5">瞬时配速</span>
              <span className="text-lg font-black text-cyan-400 font-mono tracking-tight">{calculatePace()}</span>
            </div>

            <div className="bg-black/20 p-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <span className="text-[8px] text-slate-500 font-black tracking-wider uppercase mb-0.5">当前时速</span>
              <span className="text-lg font-black text-[#2ecc71] font-mono tracking-tight">{speedLevel.toFixed(1)} <span className="text-[9px] text-slate-500 uppercase">K/H</span></span>
            </div>

            <div className="bg-black/20 p-3 rounded-2xl flex flex-col justify-center border border-white/5">
              <span className="text-[8px] text-slate-500 font-black tracking-wider uppercase mb-0.5">消耗热量</span>
              <span className="text-lg font-black text-amber-500 font-mono tracking-tight">{Math.floor(distance * 65)} <span className="text-[9px] text-slate-500 uppercase">kcal</span></span>
            </div>
          </div>

          {/* Heart Rate Area with pulse bar animation */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="text-2xl animate-ping absolute opacity-70">❤️</span>
                <span className="text-2xl relative z-10">❤️</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">瞬时心率</div>
                <div className="text-lg font-black text-slate-100 font-mono leading-none mt-1">{heartRate} <span className="text-[9px] text-slate-500 font-normal">BPM</span></div>
              </div>
            </div>
            
            {/* Quick Heart Rate range indicator */}
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
              有氧区间
            </span>
          </div>
        </div>

        {/* Right Sideboard: Landmarks Timeline & Group Live Rankings */}
        <div className="w-full lg:w-72 bg-slate-950/75 border border-white/10 backdrop-blur-lg p-5 rounded-3xl flex flex-col gap-4 shadow-2xl relative">
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#2ecc71]/60 to-transparent" />
          
          <div className="text-[9px] text-slate-500 font-mono font-black tracking-[0.2em] uppercase">
            实景打卡 & 顺位 (SAGE STATUS)
          </div>

          {/* Landmarks unlock radar */}
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 tracking-wider uppercase mb-2">
              <span>当前打卡地标</span>
              <span className="text-cyan-400 font-bold">已点亮 2/5</span>
            </div>
            <div className="text-xs font-black text-slate-200 flex items-center gap-2">
              <MapPin size={13} className="text-[#2ecc71] animate-bounce" />
              <span>平湖秋月 (1.5 km点)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2">
              金牌实景打卡航段，请保持平稳配速呼吸。
            </p>
          </div>

          {/* Simulated live ranking cards of global competitors during virtual track */}
          <div className="space-y-2">
            <div className="text-[8px] text-slate-500 font-mono font-black tracking-wider uppercase mb-1 flex justify-between">
              <span>同跑实机排位</span>
              <span className="text-emerald-400">目前位列第 3</span>
            </div>

            <div className="space-y-1.5 h-28 overflow-y-auto pr-1 hide-scrollbar">
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-cyan-400 text-slate-950 rounded-full font-sans font-bold flex items-center justify-center text-[10px]">3</span>
                  <span className="font-extrabold text-slate-100">您 (You)</span>
                </div>
                <span className="font-mono text-cyan-400 font-semibold">{distance.toFixed(2)} km</span>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded-full font-mono flex items-center justify-center text-[10px]">1</span>
                  <span className="font-bold">李逸 * 杭州跑友</span>
                </div>
                <span className="font-mono">{Math.max(0, distance + 0.32).toFixed(2)} km</span>
              </div>

              <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded-full font-mono flex items-center justify-center text-[10px]">2</span>
                  <span className="font-bold font-sans">王峰 * Treadmill</span>
                </div>
                <span className="font-mono">{Math.max(0, distance + 0.15).toFixed(2)} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom-bar: Integrated Treadmill Smart Speeder Buttons (Tactical Dock) */}
      <div className="relative z-10 pb-6 px-6 pt-16 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Speed Adjustment Buttons - Treadmill Engine Integrator widget */}
        <div className="flex items-center gap-2.5 bg-black/60 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono px-2">
            智能阻力速速
          </span>
          <button 
            type="button"
            onClick={decreaseSpeed}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold font-mono transition-transform border border-white/5 text-lg cursor-pointer flex items-center justify-center"
          >
            -
          </button>
          
          <div className="px-3.5 text-center min-w-[70px]">
            <div className="text-xl font-bold font-mono text-cyan-400">{speedLevel.toFixed(1)}</div>
            <div className="text-[8px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">公里/小时</div>
          </div>

          <button 
            type="button"
            onClick={increaseSpeed}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold font-mono transition-transform border border-white/5 text-lg cursor-pointer flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Primary Workout Engine controls */}
        <div className="flex items-center gap-5">
          <button 
            type="button"
            onClick={handleStop}
            className="w-14 h-14 rounded-2xl bg-black/75 hover:bg-slate-900 border border-red-500/20 text-red-500 shadow-md flex items-center justify-center active:scale-95 transition-all cursor-pointer group"
          >
            <Square size={16} className="fill-red-500 text-red-500 group-hover:scale-95 transition-transform" />
          </button>

          <button 
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-3xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.65)] flex items-center justify-center font-bold active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={28} className="fill-slate-950 text-slate-950" /> : <Play size={28} className="fill-slate-950 text-slate-950 ml-1.5" />}
          </button>
        </div>

        {/* Dynamic heart icon rate telemetry indicator right corner */}
        <div className="hidden lg:flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-2.5 rounded-2xl text-xs backdrop-blur-md">
          <TrendingUp size={14} className="text-cyan-400" />
          <span className="font-mono text-slate-300 font-semibold uppercase tracking-wider">配速雷达: 在线状态(LIVE)</span>
        </div>
      </div>

      {/* 5. Completion Modal Overlay */}
      <AnimatePresence>
        {showCompletion && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
           >
              <motion.div 
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 className="bg-slate-950 border border-white/10 rounded-[32px] p-6 w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col items-center text-center relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
                 
                 <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                   <Zap size={28} className="text-cyan-400 animate-pulse" />
                 </div>
                 
                 <h2 className="text-2xl font-black text-slate-100 mb-1 tracking-widest">路线已成功点亮</h2>
                 <p className="text-cyan-400 text-[10px] font-mono tracking-widest mb-6">ROUTE {routeIndex} COMPLETED</p>

                 {/* Stats */}
                 <div className="w-full grid grid-cols-3 gap-3 mb-6 bg-white/5 rounded-2xl p-4 border border-white/5">
                   <div>
                     <div className="text-xl font-black font-mono text-cyan-400">{distance.toFixed(2)}</div>
                     <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">公里</div>
                   </div>
                   <div>
                     <div className="text-xl font-black font-mono text-cyan-400">{formatTime(time)}</div>
                     <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">时长</div>
                   </div>
                   <div>
                     <div className="text-xl font-black font-mono text-cyan-400">{Math.floor(distance * 65)}</div>
                     <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">千卡</div>
                   </div>
                 </div>

                 {/* Incentive Text */}
                 <p className="text-xs text-slate-300 leading-relaxed font-medium mb-8 relative px-4">
                    <span>
                      {routeIndex === 1 
                        ? "恭喜！第一条实景轨迹已被点亮。你的跑步机已载入城市脉络，享受前方的闪光未来。" 
                        : "城市记忆已被注入核心记录板。你的每一步，都将成为这片足迹里最耀眼的华彩。"}
                    </span>
                 </p>

                 <div className="w-full flex gap-3">
                   <button 
                     type="button"
                     onClick={() => onComplete({ distance, duration: time, calories: Math.floor(distance * 65) })}
                     className="flex-1 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl transition-all tracking-widest text-xs uppercase shadow-[0_4px_25px_rgba(34,211,238,0.35)] cursor-pointer hover:shadow-[0_4px_25px_rgba(34,211,238,0.55)]"
                   >
                     确认
                   </button>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
