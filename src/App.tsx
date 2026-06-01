import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './components/HomeTab';
import { CITIES } from './data/cities';
import CitiesTab from './components/CitiesTab';
import CityRoutesView from './components/CityRoutesView';
import RunPlaybackView from './components/RunPlaybackView';
import IntroScreen from './components/IntroScreen';
import LitRecordsView from './components/LitRecordsView';
import LeaderboardView from './components/LeaderboardView';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [fullScreenPage, setFullScreenPage] = useState<{type: 'cityList' | 'cityRoutes' | 'runPlayback' | 'litRecords' | 'leaderboard', data?: any} | null>(null);
  const [litCityIds, setLitCityIds] = useState<string[]>(() => {
    // Always start fresh on load
    CITIES.forEach(c => {
      if (c.status !== 'upcoming') c.status = 'unlit';
      c.completed = 0;
      c.completedRouteIndices = [];
      c.completedRouteTimestamps = {};
      c.justLit = false;
    });
    return [];
  });

  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [targetFlight, setTargetFlight] = useState<{fromCityId: string, toCityId: string} | null>(null);
  const [pendingSelectionFrom, setPendingSelectionFrom] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    completedCities: 3,
    completedRoutes: 36,
    totalDistance: 62.0,
    totalTimeHours: 12.0,
    lightValue: 120
  });

  return (
    <div className="h-screen w-full bg-[#05070A] text-slate-100 overflow-hidden relative font-sans">
      <AnimatePresence>
        {showIntro && (
          <IntroScreen 
            onComplete={() => {
              setShowIntro(false);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Main Screen Center viewport */}
      <main className="w-full h-full relative overflow-hidden bg-[#05070A]">
        <AnimatePresence mode="wait">
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <HomeTab 
              userStats={userStats}
              setUserStats={setUserStats}
              onNavigate={(type, data) => setFullScreenPage({ type: type as any, data })} 
              completedChapters={completedChapters} 
              targetFlight={targetFlight} 
              pendingSelectionFrom={pendingSelectionFrom}
              litCityIds={litCityIds}
              onCitySelected={(cityId) => {
                if (pendingSelectionFrom) {
                  setTargetFlight({ fromCityId: pendingSelectionFrom, toCityId: cityId });
                  setPendingSelectionFrom(null);
                } else {
                  // Direct selection or first selection
                  const city = CITIES.find(c => c.id === cityId);
                  if (city) {
                    CITIES.forEach(c => { if(c.status === 'in-progress') c.status = 'unlit'; });
                    city.status = 'in-progress';
                    setLitCityIds(prev => {
                      if (prev.includes(cityId)) return prev;
                      return [...prev, cityId];
                    });
                  }
                }
              }}
              onFlightComplete={() => {
                if (targetFlight) {
                  const nextCity = CITIES.find(c => c.id === targetFlight.toCityId);
                  if (nextCity && (nextCity.status === 'unlit' || nextCity.status === 'in-progress')) {
                    nextCity.status = 'in-progress';
                    setLitCityIds(prev => {
                      if (prev.includes(nextCity.id)) return prev;
                      return [...prev, nextCity.id];
                    });
                  }
                }
                setTargetFlight(null);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Full Screen Pages overlays on top of everything including sidebar */}
      <AnimatePresence>
        {fullScreenPage && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 z-[100] bg-[#05070A]"
          >
            {fullScreenPage.type === 'cityList' && (
               <CitiesTab 
                 onCityClick={(city) => setFullScreenPage({ type: 'cityRoutes', data: city })} 
                 onBack={() => setFullScreenPage(null)} 
               />
            )}
            {fullScreenPage.type === 'cityRoutes' && (
               <CityRoutesView 
                 city={fullScreenPage.data} 
                 onBack={() => setFullScreenPage(null)} 
                 onRouteClick={(routeIndex) => setFullScreenPage({ 
                   type: 'runPlayback', 
                   data: { cityId: fullScreenPage.data.id, routeIndex, image: fullScreenPage.data.image, previousCityData: fullScreenPage.data } 
                 })} 
                 onExploreNext={(currentCityId) => {
                   setPendingSelectionFrom(currentCityId);
                   setFullScreenPage(null);
                 }}
               />
            )}
            {fullScreenPage.type === 'runPlayback' && (
               <RunPlaybackView 
                 {...fullScreenPage.data}
                 onExit={() => setFullScreenPage({ type: 'cityRoutes', data: fullScreenPage.data.previousCityData })}
                 onComplete={(stats) => {
                   // Update user stats
                   setUserStats((prev: any) => ({
                     ...prev,
                     totalDistance: prev.totalDistance + stats.distance,
                     totalTimeHours: prev.totalTimeHours + (stats.duration / 3600),
                     lightValue: (prev.lightValue || 0) + (stats.calories || Math.floor(stats.distance * 65))
                   }));

                   const { previousCityData, routeIndex } = fullScreenPage.data;
                   const realCityData = CITIES.find(c => c.id === previousCityData.id) || previousCityData;
                   const currentCompleted = realCityData.completedRouteIndices || [];
                   
                   if (!currentCompleted.includes(routeIndex)) {
                     realCityData.completedRouteIndices = [...currentCompleted, routeIndex];
                     if (!realCityData.completedRouteTimestamps) {
                       realCityData.completedRouteTimestamps = {};
                     }
                     realCityData.completedRouteTimestamps[routeIndex] = Date.now();
                     realCityData.completed = Math.min(realCityData.completedRouteIndices.length, realCityData.routes);
                     
                     // If this is a newly completed route, increment completedRoutes counter
                     setUserStats((prev: any) => ({ ...prev, completedRoutes: prev.completedRoutes + 1 }));
                   }
                   
                   if (realCityData.completed === realCityData.routes && realCityData.status !== 'lit') {
                     realCityData.status = 'lit';
                     realCityData.justLit = true;
                     // Increment completed cities counter
                     setUserStats((prev: any) => ({ ...prev, completedCities: prev.completedCities + 1 }));
                   }

                   setCompletedChapters(prev => {
                     const newChapters = [...prev];
                     // Chapter 1: Complete 1 route
                     if (!newChapters.includes(1)) newChapters.push(1);
                     // Chapter 2: Complete 1 city
                     if (realCityData.status === 'lit' && !newChapters.includes(2)) {
                       newChapters.push(2);
                     }
                     
                     const litCount = CITIES.filter(c => c.status === 'lit').length;
                     if (litCount >= 3) {
                       if (!newChapters.includes(3)) newChapters.push(3);
                     }
                     if (litCount >= CITIES.length) {
                       if (!newChapters.includes(4)) newChapters.push(4);
                     }
                     
                     return newChapters;
                   });

                   // Navigate back to cityRoutes with the updated data
                   setFullScreenPage({ type: 'cityRoutes', data: realCityData });
                 }}
               />
            )}
            {fullScreenPage.type === 'litRecords' && (
              <LitRecordsView onBack={() => setFullScreenPage(null)} />
            )}
            {fullScreenPage.type === 'leaderboard' && (
              <LeaderboardView onBack={() => setFullScreenPage(null)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
