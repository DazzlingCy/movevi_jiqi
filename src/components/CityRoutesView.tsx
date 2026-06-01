import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Lock, Star, Clock, MapPin, Award, Trophy, Compass, Sparkles, BarChart2, Radio, Sliders } from 'lucide-react';
import { CityData, getRouteData } from '../data/cities';

interface CityRoutesViewProps {
  city: CityData;
  onBack: () => void;
  onRouteClick: (routeIndex: number) => void;
  onExploreNext?: (currentCityId: string) => void;
}

// Custom mock medals databases with unique styles for immersive skeuomorphic 3D look
interface MedalItem {
  name: string;
  icon: string;
  desc: string;
  gradient: string;
  borderColor: string;
}

const BEIJING_MEDALS: MedalItem[] = [
  { name: '天坛祈年殿', icon: '⛩️', desc: '朝岁天香，点亮故都中轴', gradient: 'from-amber-600 via-amber-500 to-yellow-400', borderColor: 'border-amber-400' },
  { name: '故宫御苑', icon: '🏯', desc: '红墙黛瓦，六百年帝乡沉淀', gradient: 'from-rose-600 via-red-500 to-amber-500', borderColor: 'border-red-400' },
  { name: '奥森圣殿', icon: '🌲', desc: '跑者圣地，万亩绿林洗礼', gradient: 'from-emerald-600 via-teal-500 to-cyan-400', borderColor: 'border-emerald-400' },
  { name: '什刹胜景', icon: '⛵', desc: '银锭观山，胡同深处的烟火', gradient: 'from-blue-600 via-cyan-500 to-indigo-400', borderColor: 'border-cyan-400' },
  { name: '钟鼓雷音', icon: '🔔', desc: '晨钟暮鼓，惊醒时光长河', gradient: 'from-yellow-600 via-yellow-500 to-amber-400', borderColor: 'border-yellow-400' },
  { name: '太液秋波', icon: '🛶', desc: '波光潋滟，柳浪千条拂石堤', gradient: 'from-cyan-600 via-teal-500 to-emerald-400', borderColor: 'border-teal-400' },
  { name: '十七孔金光', icon: '🌉', desc: '金光穿洞，颐和园落日一瞬', gradient: 'from-orange-600 via-amber-500 to-yellow-500', borderColor: 'border-orange-400' },
  { name: '大水法遗珍', icon: '🏛️', desc: '历史余晖，斑驳石柱忆沧桑', gradient: 'from-slate-600 via-slate-500 to-neutral-400', borderColor: 'border-slate-400' },
];

const HANGZHOU_MEDALS: MedalItem[] = [
  { name: '三潭印月', icon: '🪔', desc: '湖心石塔，水月交融之境', gradient: 'from-cyan-600 via-teal-500 to-cyan-300', borderColor: 'border-cyan-400' },
  { name: '断桥相会', icon: '⛱️', desc: '雪霁寻梅，千载浪漫守候', gradient: 'from-blue-500 via-indigo-500 to-purple-400', borderColor: 'border-indigo-400' },
  { name: '雷峰夕照', icon: '🗼', desc: '塔影夕阳，山光倒浸烟波', gradient: 'from-orange-600 via-red-500 to-amber-500', borderColor: 'border-orange-400' },
  { name: '灵隐禅钟', icon: '🎋', desc: '飞来峰下，古树钟响幽谷深', gradient: 'from-emerald-600 via-green-500 to-teal-400', borderColor: 'border-green-400' },
  { name: '钱江潮涌', icon: '🌊', desc: '时代弄潮，钱塘江畔霓虹夜', gradient: 'from-blue-600 via-cyan-500 to-teal-300', borderColor: 'border-cyan-400' },
  { name: '钱新大剧院', icon: '🏟️', desc: '日月同辉，科技新城的未来', gradient: 'from-purple-600 via-fuchsia-500 to-pink-400', borderColor: 'border-fuchsia-400' },
  { name: '西溪绿苇', icon: '🌾', desc: '一曲溪流一曲烟，湿地寻舟', gradient: 'from-lime-600 via-emerald-500 to-green-400', borderColor: 'border-lime-400' },
  { name: '大运河古桥', icon: '🌁', desc: '拱宸碧波，连接千年的水路', gradient: 'from-amber-600 via-orange-500 to-yellow-400', borderColor: 'border-amber-400' },
];

const UNLOCKED_MEDALS_COUNT_BY_CITY: Record<string, number> = {
  '1': 3, // 杭州已解锁3个
  '2': 2, // 北京已解锁2个
  '3': 1, // 上海已解锁1个
  '4': 1, // 南京已解锁1个
  '5': 2, // 西安已解锁2个
  '6': 3, // 东京2个
  '7': 2, // 巴黎
};

export default function CityRoutesView({ city, onBack, onRouteClick, onExploreNext }: CityRoutesViewProps) {
  const [showLitModal, setShowLitModal] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLightingUp, setIsLightingUp] = useState(false);

  // Time clock ticker inside the treadmill dashboard
  const [currentTime, setCurrentTime] = useState('');

  // Tab configurations: Left-aligned list based on the user's uploaded mockup design
  const defaultTabName = city.name === '杭州' ? '环西湖路线' : city.name === '北京' ? '东城胡同路线' : `${city.name}精选路线`;
  const [activeTab, setActiveTab] = useState(defaultTabName);

  const tabs = [
    defaultTabName,
    '历史类路线',
    '现代类路线',
    '自然类路线'
  ];

  // Map category tab descriptions, simulating real platform richness
  const getTabIntro = () => {
    if (activeTab === defaultTabName) {
      if (city.id === '1') return '从断桥残雪到苏堤春晓，串联起江南特有的湖光山色与诗词歌赋，在潋滟水光中体验身临其境的漫步。';
      if (city.id === '2') return '从南锣鼓巷到烟袋斜街，带你游历京城最原生完整的胡同群，在悠长胡同里寻找大爷的蒲扇和鸽哨。';
      return `精心挑选的${city.name}最火爆的主题路线，完美呈现城市的标志性人文精髓。`;
    }
    if (activeTab === '历史类路线') {
      return `行走在${city.name}千载积淀的青砖石瓦上，探索古都名胜遗珍，用奔跑丈量文化的长度，点亮遥远的记忆。`;
    }
    if (activeTab === '现代类路线') {
      return `穿梭在璀璨高耸的都市天际线之下，在车水马龙和梦幻霓虹里，感受赛博时代的快节奏和科技脉搏。`;
    }
    return `远离水泥森林的重重压抑，沉浸在${city.name}的碧水青山和苍松翠海中，每一次深呼吸，都是洗涤心灵的旅程。`;
  };

  // Medal definitions
  const isBeijing = city.id === '2';
  const rawMedals = isBeijing ? BEIJING_MEDALS : HANGZHOU_MEDALS;
  // Fill the list to make 12 items for gorgeous grid rendering
  const unlockedCount = UNLOCKED_MEDALS_COUNT_BY_CITY[city.id] || 1;
  
  // Make 12 slots based on mockup
  const totalMedals = Array.from({ length: 12 }).map((_, index) => {
    const isUnlocked = index < unlockedCount;
    // Map existing or generate generic fallback
    if (index < rawMedals.length) {
      return { ...rawMedals[index], isUnlocked };
    } else {
      const genericIcons = ['🏺', '⛰️', '🍂', '🛕', '🌸', '🎪'];
      const icon = genericIcons[index % genericIcons.length];
      return {
        name: `勋章 ${city.name} · ${index + 1}`,
        icon,
        desc: '更多城市探索惊喜，等待您亲临解锁',
        gradient: 'from-cyan-700 via-blue-600 to-indigo-500',
        borderColor: 'border-cyan-500/50',
        isUnlocked
      };
    }
  });

  // Track selected active route index (or default to 1) for the bright green outline spotlight
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);

  // Tick the treadmill console clock dynamically
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setCurrentTime(`${month}月${day}日 ${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (city.justLit) {
      setIsCardFlipped(false);
      setShowLitModal(true);
    }
  }, [city.justLit]);

  const handleCloseLitModal = () => {
    setShowLitModal(false);
    city.justLit = false;
    if (onExploreNext) {
      onExploreNext(city.id);
    } else {
      onBack();
    }
  };

  return (
    <div className="w-full h-full bg-[#030508] text-slate-100 font-sans relative flex flex-col overflow-hidden select-none">
      
      {/* Dynamic atmospheric ambient background under City details - 100% full stretch blur (mockup vibe) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src={city.image} 
          alt="" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-110 blur-xl opacity-35 saturate-150 contrast-125" 
        />
        <div className="absolute inset-0 bg-[#05070a]/90 mix-blend-multiply" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-950/10 via-transparent to-transparent" />
        {/* Subtle grid lines overlay on the background to make it look like a treadmill console screen */}
        <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Treadmill Console Top Bar (沉浸式物联网状态栏) */}
      <div className="shrink-0 bg-black/60 border-b border-white/5 backdrop-blur-md relative z-30 px-6 py-4 flex items-center justify-between">
        <button 
          type="button"
          onClick={onBack} 
          className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all text-sm font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          <ChevronLeft size={16} />
          返回
        </button>
        
        {/* Treadmill screen middle title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-150 tracking-widest">{city.name}市</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Console info info */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="tracking-wide">{currentTime || '11月12日 09:04'}</span>
          <div className="flex items-center gap-1.5 opacity-85">
            <Radio size={12} className="text-cyan-400 animate-pulse" />
            <Sliders size={12} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Body (Split into Left Side Category/Stats, Middle Routes list, Right Trophy Medals Wall) */}
      <div className="flex-1 max-w-[1550px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 px-6 py-6 overflow-hidden relative z-20">
        
        {/* Left Module (Column span 3): City Info, Vertical Category Tabs & Stats */}
        <div className="lg:col-span-3 flex flex-col justify-between overflow-hidden gap-4">
          
          <div className="space-y-4">
            {/* Slogan & Bold English title header */}
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-cyan-400 font-mono flex items-center gap-1.5 uppercase">
                <Compass size={11} className="text-cyan-400 animate-spin-slow" />
                木卫六跑步机 | 足不出户, 跑遍全球!
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-baseline gap-2">
                {city.name}
                <span className="text-lg font-mono font-medium text-slate-400/80 tracking-widest block uppercase">
                  {city.englishName}
                </span>
              </h1>
            </div>

            {/* Vertical Theme Tabs */}
            <div className="space-y-2 mt-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                
                // Assign beautiful glowing style based on design spec
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-900/30 via-slate-900/40 to-slate-950/20 border-cyan-400/40 text-cyan-300 shadow-[0_4px_15px_rgba(34,211,238,0.15)]' 
                        : 'bg-slate-950/30 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Generates customized unique category icons according to general list */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                        isActive ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-400/30' : 'bg-white/5 text-slate-500 border border-transparent'
                      }`}>
                        {tab === defaultTabName ? '🏔️' : tab === '历史类路线' ? '📜' : tab === '现代类路线' ? '🏙️' : '🌲'}
                      </div>
                      <span className="text-xs font-black tracking-widest">{tab}</span>
                    </div>

                    {isActive && (
                      <span className="text-cyan-400 animate-bounce-horizontal text-[10px]">▶</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Glowing theme details bubble */}
            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl text-slate-400 text-[11px] leading-relaxed relative min-h-[90px] flex items-center shadow-lg">
              <div className="absolute top-0 left-4 w-4 h-[1.5px] bg-cyan-500/50" />
              <p className="line-clamp-3">{getTabIntro()}</p>
            </div>
          </div>

          {/* Left bottom: Cumulative Stats widgets (100% matched design map) */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl flex flex-col hover:border-cyan-500/15 transition-all">
              <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-1">累计运动里程</span>
              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xl font-bold font-mono text-cyan-400 tracking-tight">1136.5</span>
                <span className="text-[10px] text-slate-500 font-black font-sans uppercase">km</span>
              </div>
            </div>
            
            <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl flex flex-col hover:border-cyan-500/15 transition-all">
              <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-1">累计运动时长</span>
              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xl font-bold font-mono text-slate-200 tracking-tight">34267</span>
                <span className="text-[10px] text-slate-500 font-black font-sans uppercase">min</span>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Module (Column span 5): Choose Route lists */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden justify-between">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-100 tracking-widest flex items-center gap-1.5">
              <span>●</span> 选择路线
            </h2>
            
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors bg-white/5 border border-white/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
              <BarChart2 size={12} className="text-cyan-400" />
              路线数据
              <span className="text-slate-500 text-[9px] ml-0.5">&gt;</span>
            </div>
          </div>

          {/* Scrolling card lists, 100% matched user image styling & locked designs */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3.5 pr-1 py-1">
            {/* Show routes dynamically based on current city */}
            {Array.from({ length: 4 }).map((_, i) => {
              const routeId = i + 1;
              const isRouteCompleted = city.completedRouteIndices?.includes(routeId);
              const totalCompletedInCity = (city.completedRouteIndices || []).reduce((max, cur) => Math.max(max, cur), 0);
              // In this design, route index 1, 2, 3 might be unlocked, and 4 might be locked for progression
              const isRouteUnlocked = routeId <= city.routes;

              // Read config
              const routeData = getRouteData(city.id, routeId);
              const isSelected = selectedRouteId === routeId;

              return (
                <div 
                  key={i} 
                  onClick={() => {
                    if (isRouteUnlocked) {
                      setSelectedRouteId(routeId);
                    }
                  }}
                  className={`border rounded-2xl p-4 flex gap-4 transition-all duration-300 relative overflow-hidden h-[126px] group ${
                    !isRouteUnlocked 
                      ? 'border-white/5 opacity-40 bg-slate-900/[0.15]' 
                      : isSelected
                      ? 'bg-gradient-to-r from-slate-900/60 to-slate-950/40 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900/20 hover:bg-slate-900/40 border-white/5 hover:border-cyan-500/20 cursor-pointer'
                  }`}
                >
                  {/* Yellow glowing rating star badge (top left) */}
                  {isRouteUnlocked && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-amber-500 text-slate-950 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md shadow-lg flex items-center gap-0.5 font-sans">
                      <Star size={8} className="fill-slate-950 stroke-slate-950" />
                      {routeData.rating}分
                    </div>
                  )}

                  {/* Left picture block */}
                  <div className="w-[130px] h-full rounded-xl overflow-hidden shrink-0 relative bg-slate-950">
                    <img 
                      src={city.image} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {!isRouteUnlocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-13">
                        <div className="bg-slate-950 border border-white/10 p-2 rounded-full shadow-lg">
                          <Lock size={14} className="text-slate-400" />
                        </div>
                      </div>
                    )}

                    {isRouteUnlocked && isRouteCompleted && (
                       <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-md uppercase">
                         LIT
                       </div>
                    )}
                  </div>

                  {/* Right description side */}
                  <div className="flex-1 overflow-hidden flex flex-col justify-between py-0.5">
                    <div>
                      {/* Bold title */}
                      <h3 className={`text-sm font-black transition-colors line-clamp-1 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-100 group-hover:text-cyan-400/90'
                      }`}>
                        路线{routeId}：{routeData.title}
                      </h3>
                      
                      {/* Spots */}
                      <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1 leading-normal font-medium bg-white/5 border border-white/5 px-2 py-1 rounded w-fit max-w-full">
                        {routeData.spots}
                      </p>
                    </div>

                    {/* Distance & duration bar */}
                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center gap-3 font-semibold text-xs text-slate-300 font-mono">
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-amber-400/80" />
                            <span className="text-amber-400">{routeData.duration}</span>
                          </div>
                          <span className="text-slate-500">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-400/80" />
                            <span className="text-emerald-400">{routeData.distance || '5.2'} km</span>
                          </div>
                       </div>
                       
                       {/* Rating feedback */}
                       {isSelected && (
                         <span className="text-[10px] text-cyan-400 font-mono font-black scale-90">SELECTING</span>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky run trigger button */}
          <div className="pt-4 border-t border-white/5 shrink-0 bg-transparent flex justify-center">
            <button 
              type="button"
              onClick={() => onRouteClick(selectedRouteId)}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-all tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-98 cursor-pointer text-xs uppercase"
            >
              启动探索光道 RUN NOW
            </button>
          </div>

        </div>

        {/* Right Module (Column span 4): Medals Collection Frame */}
        <div className="lg:col-span-4 bg-slate-950/45 border border-white/5 p-5 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md">
          
          <div className="shrink-0 flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-100 tracking-wide flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-400" />
                {city.name}勋章收集进度
              </h2>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5 tracking-wider uppercase font-semibold">MEDAL COLLECTION MATRIX</div>
            </div>
            
            <button 
              type="button"
              className="text-[10px] font-black text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors"
            >
              查看全部 &gt;
            </button>
          </div>

          {/* Medal progress indicator bar */}
          <div className="my-4 space-y-1.5 shrink-0 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-black font-mono">
              <span className="text-slate-400">目前阶段达成 {unlockedCount}/12</span>
              <span className="text-cyan-400">{Math.round((unlockedCount / 12) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / 12) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full" 
              />
            </div>
          </div>

          {/* Medals Matrix GRID (3 columns x 4 rows) with touch scroll */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1 pr-1 py-1">
            <div className="grid grid-cols-3 gap-3">
              {totalMedals.map((medal, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.03 * index }}
                    whileHover={medal.isUnlocked ? { scale: 1.05 } : {}}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 relative ${
                      medal.isUnlocked 
                        ? 'bg-slate-950/80 border-cyan-500/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)]' 
                        : 'bg-slate-950/20 border-white/5 opacity-40 select-none'
                    }`}
                  >
                    {/* Glowing highlight loop around unlocked medal */}
                    {medal.isUnlocked && (
                      <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-pulse pointer-events-none" />
                    )}

                    {/* Medal Core Sphere */}
                    <div className="relative mb-2">
                      <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center border-2 text-2xl relative shadow-md ${
                        medal.isUnlocked 
                          ? `bg-gradient-to-tr ${medal.gradient} ${medal.borderColor} text-slate-900 border-opacity-90` 
                          : 'bg-neutral-900/40 border-slate-800 text-slate-600'
                      }`}>
                        
                        {/* Shimmer line inside badge */}
                        {medal.isUnlocked && (
                           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/20 pointer-events-none" />
                        )}

                        {/* Flat icon */}
                        <div className={`transform ${medal.isUnlocked ? 'scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]' : 'grayscale filter'}`}>
                          {medal.icon}
                        </div>
                      </div>

                      {/* Green neon check dots */}
                      {medal.isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#090b0e] rounded-full flex items-center justify-center">
                          <Sparkles size={8} className="text-slate-950 stroke-slate-950 fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Medal tag labels */}
                    <span className={`text-[9px] font-black truncate w-full mt-0.5 tracking-wide ${
                      medal.isUnlocked ? 'text-slate-200 font-bold' : 'text-slate-600 font-medium'
                    }`}>
                      {medal.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* City Lit Card Award Modal */}
      <AnimatePresence>
        {showLitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 perspective-[1000px]"
          >
             <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-sm flex flex-col items-center"
             >
                <div className="w-full text-center mb-6">
                  <h2 className="text-2xl font-black text-white mb-2 tracking-widest">{isCardFlipped ? "获得城市卡片" : "城市已点亮！"}</h2>
                  <p className="text-cyan-400 text-xs tracking-wider uppercase font-mono">{isCardFlipped ? "CITY CARD ACQUIRED" : "点击翻牌赢取闪光印记"}</p>
                </div>

                <motion.div 
                   className="relative w-64 h-[360px] [transform-style:preserve-3d] cursor-pointer"
                   whileHover={!isCardFlipped && !isLightingUp ? { scale: 1.05, y: -5 } : {}}
                   animate={{ 
                       rotateY: isCardFlipped ? 180 : (isLightingUp ? [-2, 2, -2, 2, -2, 2, 0] : 0), 
                       scale: isCardFlipped ? 1 : (isLightingUp ? 0.95 : 1)
                   }}
                   transition={{ 
                       rotateY: isCardFlipped ? { type: "spring", stiffness: 50, damping: 15 } : { duration: 0.4 },
                       scale: { duration: 0.3 }
                   }}
                   onClick={() => {
                     if (isCardFlipped || isLightingUp) return;
                     setIsLightingUp(true);
                     setTimeout(() => {
                       setIsCardFlipped(true);
                       setTimeout(() => setIsLightingUp(false), 800);
                     }, 600);
                   }}
                >
                   {/* Light burst effects inside */}
                   <AnimatePresence>
                     {isLightingUp && !isCardFlipped && (
                       <motion.div
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: [0, 0.8, 0.4, 1], scale: 1.2 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.6 }}
                         className="absolute inset-0 bg-cyan-400/50 mix-blend-screen blur-[30px] rounded-2xl z-0 pointer-events-none"
                       />
                     )}
                     {isCardFlipped && (
                       <motion.div
                         initial={{ opacity: 1, scale: 1 }}
                         animate={{ opacity: 0, scale: 2.5 }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className="absolute inset-0 bg-white mix-blend-overlay blur-[40px] rounded-2xl z-50 pointer-events-none"
                       />
                     )}
                   </AnimatePresence>

                   {/* Card Back */}
                   <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-950 border-[3px] border-white/10 hover:border-cyan-400/45 rounded-2xl shadow-2xl flex flex-col items-center justify-center transition-all">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-2xl pointer-events-none"></div>
                     <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden transition-shadow pointer-events-none">
                       <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent animate-pulse" />
                       <GlobeIcon size={40} className="text-cyan-400 relative z-10" />
                     </div>
                     <p className="text-cyan-400 text-[10px] font-mono mb-2 tracking-[0.25em] relative z-10 font-bold pointer-events-none">TAP TO REVEAL</p>
                     <motion.div 
                        animate={{ y: [0, -6, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-white/40 text-3xl mt-4 relative z-10 pointer-events-none"
                     >
                        👆
                     </motion.div>
                     
                     {/* Inner active border glow when charging */}
                     {isLightingUp && !isCardFlipped && (
                       <div className="absolute inset-0 border-4 border-cyan-400/60 shadow-[inset_0_0_30px_rgba(34,211,238,0.5)] rounded-2xl pointer-events-none"></div>
                     )}
                   </div>

                   {/* Card Front */}
                   <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.4)] overflow-hidden bg-slate-950 border-2 border-cyan-400/40 flex flex-col">
                       <div className="h-[55%] relative pointer-events-none">
                         <img 
                           src={city.image} 
                           alt="" 
                           referrerPolicy="no-referrer"
                           className="absolute inset-0 w-full h-full object-cover" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                         
                         <motion.div 
                           initial={{ x: '-100%', opacity: 0 }}
                           animate={isCardFlipped ? { x: '200%', opacity: [0, 1, 0] } : {}}
                           transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                         />
                       </div>
                       <div className="flex-1 p-6 flex flex-col items-center justify-center text-center -mt-6 relative z-10 pointer-events-none">
                          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 mb-2 drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)]">{city.name}</h3>
                          <div className="text-xs text-cyan-400/80 font-mono tracking-[0.2em] uppercase mb-4">{city.englishName}</div>
                          <div className="px-4 py-1.5 bg-cyan-950/60 border border-cyan-500/45 text-cyan-300 text-[10px] rounded-full uppercase tracking-widest font-black shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            {city.routes} Routes Completed
                          </div>
                      </div>
                       
                       {/* Floating particles on front */}
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-screen"></div>
                   </div>
                 </motion.div>

                 <AnimatePresence>
                   {isCardFlipped && (
                     <motion.button 
                       type="button"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.5 }}
                       onClick={handleCloseLitModal}
                       className="mt-10 px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] cursor-pointer active:scale-95 text-sm tracking-widest"
                     >
                       继续探索世界
                     </motion.button>
                   )}
                 </AnimatePresence>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple fallback logo icon in modal
function GlobeIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
