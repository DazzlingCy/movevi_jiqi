import { Settings, ChevronRight, Mail, SquarePen, Medal, Map as MapIcon, MonitorSmartphone, Wallet, HeadphonesIcon, FileText, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface UserStats {
  completedCities: number;
  completedRoutes: number;
  totalDistance: number;
  totalTimeHours: number;
}

export default function ProfileTab({ userStats }: { userStats: UserStats }) {
  const stats = [
    { label: '点亮城市', value: userStats.completedCities.toString(), style: 'text-cyan-400' },
    { label: '解开航线', value: userStats.completedRoutes.toString(), style: 'text-amber-400' },
    { label: '运动里程', value: userStats.totalDistance.toFixed(1), unit: 'km', style: 'text-emerald-400' },
    { label: '运动时长', value: userStats.totalTimeHours.toFixed(1), unit: 'h', style: 'text-violet-400' },
  ];

  const menuItems = [
    { icon: ClipboardList, label: '运动数据档案' },
    { icon: MonitorSmartphone, label: '我的智能硬件' },
    { icon: Wallet, label: '会员中心' },
    { icon: HeadphonesIcon, label: '跑步机售后客服' },
    { icon: FileText, label: '系统意见反馈' },
    { icon: BookOpen, label: '新手使用手册' },
    { icon: Settings, label: '设置与偏好' },
  ];

  return (
    <div className="w-full h-full bg-[#05070a] overflow-hidden flex flex-col md:flex-row font-sans text-slate-100 relative">
      
      {/* Left Pane: Driver Status / Avatar Board (38% width) */}
      <div className="w-full md:w-[400px] shrink-0 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between h-[50%] md:h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Driver Top Actions */}
        <div className="flex justify-between items-center relative z-10 w-full mb-4">
          <span className="text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/25 px-3 py-1 rounded-full">
            TREADMILL DEVICE OWNER
          </span>
          <div className="flex gap-4">
            <button type="button" className="text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
              <Mail size={18} />
            </button>
            <button type="button" className="text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
              <SquarePen size={18} />
            </button>
          </div>
        </div>

        {/* User Card Showcase container */}
        <div className="relative z-10 bg-slate-950/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Glowing outer halo ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400/70 p-1 relative shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-slate-950 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover grayscale-[10%]"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-black text-slate-100 tracking-wide mt-4 mb-1">飞驰探索家_尘缘</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              LV.3 GOLD PILOT
            </span>
          </div>

          <div className="w-full h-[1px] bg-white/5 my-4" />

          {/* Core high-precision stats row */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                <div className={`text-xl font-black font-mono tracking-tight ${stat.style}`}>
                  {stat.value}
                  {stat.unit && <span className="text-xs text-slate-400 font-medium ml-0.5">{stat.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic telemetry bottom micro chart */}
        <div className="hidden md:flex bg-black/40 border border-white/5 p-4 rounded-2xl items-center justify-between text-xs gap-3">
          <TrendingUp className="text-[#2ecc71] animate-pulse shrink-0" size={16} />
          <p className="text-[10px] text-slate-400 font-medium line-clamp-1 leading-normal">
            智能心肺状态: 推荐本周持续 12 小时 A1-A3 区间有氧。
          </p>
        </div>
      </div>

      {/* Right Pane: Multi-level settings cards lists (Flex-1) */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 h-[50%] md:h-full">
        {/* Header tabs placeholder */}
        <div className="shrink-0 mb-4">
          <div className="text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest mb-1.5">
            PERSONAL SETTINGS / 运动管家档案
          </div>
          <div className="h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent w-full" />
        </div>

        {/* Main interactive items layout */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pr-1 pb-24">
          
          {/* Split Reward Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/15 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer group hover:border-amber-400/30 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-slate-100 font-black mb-1 text-sm tracking-wide">成就点亮勋章书 (3)</h3>
                <p className="text-[10px] text-amber-300/60 leading-normal">您已在当前旅程中斩获 3 枚特制徽章</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Medal size={24} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              </div>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/15 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer group hover:border-cyan-400/30 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-slate-100 font-black mb-1 text-sm tracking-wide">城市精美卡包</h3>
                <p className="text-[10px] text-cyan-300/60 leading-normal">点击查收已点亮之城的 3D 卡包明信片</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <MapIcon size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
              </div>
            </motion.div>
          </div>

          {/* Vertical Menu Buttons List */}
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-inner">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-white/5">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    className="flex items-center justify-between p-5 bg-[#05070a]/80 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400/20 transition-all">
                        <Icon size={16} />
                      </div>
                      <span className="text-slate-200 font-extrabold tracking-wide text-xs group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
