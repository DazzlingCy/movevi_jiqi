import { ChevronLeft, Trophy, Zap, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardViewProps {
  onBack: () => void;
}

const leaderboardData = [
  { id: 1, name: '极光闪电', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100', score: 18450 },
  { id: 2, name: '城市探险家', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100', score: 16200 },
  { id: 3, name: '追光者·星', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100', score: 14500 },
  { id: 4, name: '夜行猎手', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100', score: 12100 },
  { id: 5, name: '风行无阻', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100', score: 11800 },
  { id: 6, name: '地球狂奔', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100', score: 9500 },
  { id: 7, name: '阿兹特克', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100', score: 8200 },
  { id: 8, name: '超越极限', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100&h=100', score: 7100 },
];

export default function LeaderboardView({ onBack }: LeaderboardViewProps) {
  return (
    <div className="w-full h-full bg-[#05070a] text-slate-100 font-sans relative flex flex-col overflow-hidden">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Optimized Header (Unified Independent Layout) */}
      <div className="shrink-0 bg-black/40 backdrop-blur-md border-b border-white/10 relative z-20">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={onBack} 
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 group"
            >
              <ChevronLeft size={20} className="text-slate-300 group-hover:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-base font-bold tracking-widest text-slate-100 flex items-center gap-2">
                <Award size={18} className="text-cyan-400 animate-pulse" />
                地球光迹探索殿堂
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">THE ELITE PILOT LEADERBOARD</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-cyan-400 font-mono font-black uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/20 px-3 py-1.5 rounded-xl">
              GLOBAL RANKINGS
            </span>
          </div>
        </div>
      </div>

      {/* Main Container - Centered to prevent overstretching on widescreen desktops */}
      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col p-6 overflow-hidden">
        
        {/* Dynamic header summary statistics area */}
        <div className="shrink-0 mb-4 p-4 bg-gradient-to-r from-cyan-950/30 via-slate-900/20 to-transparent rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              点亮计划活跃探索先锋 
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
            每10分钟同步
          </span>
        </div>

        {/* Scrollable List Container (Ranks 1 - 8 listed linearly) */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3 pr-1 py-1">
          {leaderboardData.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            const getRankBadgeClass = () => {
              if (rank === 1) return 'bg-amber-400/10 text-amber-400 border border-amber-400/30';
              if (rank === 2) return 'bg-slate-300/15 text-slate-300 border border-slate-300/20';
              if (rank === 3) return 'bg-orange-400/10 text-orange-400 border border-orange-400/30';
              return 'text-slate-500 font-mono';
            };

            const getRowStyle = () => {
              if (rank === 1) return 'border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.05] shadow-[0_0_20px_rgba(245,158,11,0.04)]';
              if (rank === 2) return 'border-slate-300/20 bg-slate-100/[0.02] hover:bg-slate-100/[0.04]';
              if (rank === 3) return 'border-orange-500/20 bg-orange-500/[0.02] hover:bg-orange-500/[0.04]';
              return 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/10';
            };

            const getAvatarRing = () => {
              if (rank === 1) return 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
              if (rank === 2) return 'ring-2 ring-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.15)]';
              if (rank === 3) return 'ring-2 ring-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.15)]';
              return 'ring-2 ring-white/5';
            };

            return (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`flex items-center justify-between border p-4 rounded-xl transition-all duration-300 ${getRowStyle()}`}
              >
                 <div className="flex items-center gap-4">
                    {/* Rank Indicator */}
                    <div className="w-10 flex items-center justify-center">
                      {isTop3 ? (
                        <div className={`p-1.5 rounded-lg flex items-center justify-center ${getRankBadgeClass()}`}>
                          <Trophy size={14} className={rank === 1 ? 'animate-bounce' : ''} />
                        </div>
                      ) : (
                        <span className={`text-xs font-bold font-mono tracking-wider ${getRankBadgeClass()}`}>
                          #{String(rank).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* User Avatar */}
                    <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ${getAvatarRing()}`}>
                      <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                    </div>

                    {/* User Info */}
                    <div>
                      <div className={`text-sm font-black tracking-wide ${
                        rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-orange-300' : 'text-slate-300'
                      }`}>
                        {user.name}
                      </div>
                      {isTop3 && (
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">
                          {rank === 1 ? '🏆 领先者 · FIRST' : rank === 2 ? '🥈 探索家 · SECOND' : '🥉 追光人 · THIRD'}
                        </span>
                      )}
                    </div>
                 </div>
                 
                 {/* Score Badge */}
                 <div className={`flex items-center font-mono text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${
                   rank === 1 
                     ? 'text-amber-400 bg-amber-950/20 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]' 
                     : rank === 2
                     ? 'text-slate-300 bg-slate-900/40 border-slate-300/10'
                     : rank === 3
                     ? 'text-orange-300 bg-orange-950/20 border-orange-500/10'
                     : 'text-cyan-400 bg-cyan-950/20 border-cyan-500/5'
                 }`}>
                    <Zap size={11} className={`mr-1.5 ${rank === 1 ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} /> 
                    {user.score.toLocaleString()}
                 </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic sticky bottom summary container for user ranking */}
        <div className="pt-4 border-t border-white/5 shrink-0 bg-[#05070a] z-10">
           <div className="flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-cyan-900/10 border border-cyan-500/20 px-5 py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <div className="flex items-center gap-4">
                 <div className="w-8 text-center text-cyan-400 font-black font-mono text-sm">#142</div>
                 <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-550/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-cyan-300">ME</span>
                 </div>
                 <div>
                   <div className="text-slate-400 text-[9px] font-mono uppercase tracking-wider">YOUR POSITION</div>
                   <div className="font-black text-xs text-cyan-300 tracking-wide mt-0.5">
                     当前我的全球排名
                   </div>
                 </div>
              </div>
              <div className="flex items-center text-cyan-400 font-mono text-xs font-bold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-400/20">
                 <Zap size={12} className="mr-1.5 animate-pulse" /> 2,340pt
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
