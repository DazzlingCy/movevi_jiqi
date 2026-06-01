import { motion } from 'motion/react';
import { Gift, Globe2, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';

export default function EventsTab() {
  return (
    <div className="w-full h-full bg-[#05070a] overflow-hidden flex flex-col font-sans text-slate-100 relative">
      
      {/* Sticky Header Console */}
      <div className="shrink-0 bg-black/40 backdrop-blur-md flex items-center justify-between p-5 border-b border-white/5 relative z-20">
        <h1 className="text-sm font-black tracking-widest uppercase text-cyan-400">热门活动区 (CAMPAIGNS)</h1>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">ACTIVE EVENTS: 2</span>
      </div>

      {/* Grid Layout Container */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Campaign Card 1 */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(245,158,11,0.5)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group border border-amber-500/10 transition-all bg-slate-950 flex flex-col justify-end p-6"
          >
            <img 
              src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=600&h=400" 
              alt="勋章抽奖" 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700 opacity-40 select-none pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            
            <div className="absolute top-5 right-5 bg-amber-500/15 backdrop-blur-sm text-[10px] uppercase tracking-widest font-black px-3.5 py-1 rounded-full text-amber-400 flex items-center gap-1.5 shadow-lg border border-amber-500/30">
              <Sparkles size={11} className="animate-pulse" />
              限时开启
            </div>

            <div className="relative z-10 w-full">
              <div className="w-11 h-11 bg-amber-500/15 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/25 shrink-0">
                 <Gift size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
              
              <h2 className="text-xl font-black mb-2 tracking-wider text-[#fff7ed]">勋章盲盒超级抽奖</h2>
              <p className="text-slate-400 text-xs mb-5 leading-relaxed max-w-[90%]">
                消耗你在实景中跑出的点亮勋章，解锁全球城际路线，获取专属盲盒抽取海量会员权益。
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare size={13} />
                  玩家讨论区
                </button>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-400 group-hover:text-amber-950 transition-colors">
                  <ChevronRight size={16} className="text-amber-400 group-hover:text-slate-950" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Campaign Card 2 */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(168,85,247,0.5)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group border border-purple-500/10 transition-all bg-slate-950 flex flex-col justify-end p-6"
          >
            <img 
              src="https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&q=80&w=600&h=500" 
              alt="百人百城计划" 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700 opacity-40 select-none pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            
            <div className="absolute top-5 right-5 bg-purple-500/15 backdrop-blur-sm text-[10px] uppercase tracking-widest font-black px-3.5 py-1 rounded-full text-purple-300 flex items-center gap-1.5 shadow-lg border border-purple-500/30">
              S1 赛季火热进行
            </div>

            <div className="relative z-10 w-full">
              <div className="w-11 h-11 bg-purple-500/15 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/25 shrink-0">
                 <Globe2 size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              </div>

              <h2 className="text-xl font-black mb-2 tracking-wider text-[#faf5ff]">百城点亮大师计划</h2>
              <p className="text-slate-400 text-xs mb-5 leading-relaxed max-w-[90%]">
                联合全球万名跑友，共同开拔并解锁 100 个世界地标赛段。加入队伍，瓜分百万点数池。
              </p>

              {/* Progress and bottom */}
              <div className="space-y-4">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: "13.68%" }} 
                     transition={{ duration: 1.5, delay: 0.5 }}
                     className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                   />
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] text-purple-400 font-mono font-black uppercase tracking-wider">
                    奖池里程: 1,368 / 10,000 km
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      跑团讨论
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-400 group-hover:text-slate-950 transition-colors">
                      <ChevronRight size={16} className="text-purple-400 group-hover:text-slate-950" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
