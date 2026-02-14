
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { RideStatus } from '../types';
import { Power, Navigation, Phone, CheckCircle, Bell, User, Home, Star, Wallet, ChevronRight, X, TrendingUp, History } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { db } from '../services/Database';
import { Profile } from './Profile'; // Import existing Profile component

export const CaptainApp = () => {
  const { 
    currentUser,
    captainProfile, 
    toggleOnline, 
    currentRide, 
    availableRides, 
    acceptRide, 
    startRide, 
    completeRide, 
    rejectRide, 
    allUsers 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'home' | 'earnings' | 'profile'>('home');

  // --- GEOLOCATION FOR CAPTAIN ---
  useEffect(() => {
    if (navigator.geolocation && captainProfile) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Update profile in DB with new location
                const updatedProfile = {
                    ...captainProfile,
                    currentLocation: {
                        lat: latitude,
                        lng: longitude,
                        address: "Current Device Location"
                    }
                };
                try {
                    await db.updateCaptainProfile(updatedProfile);
                } catch (e) {
                    console.error("Failed to update captain location", e);
                }
            },
            (err) => console.error("Captain Location Error:", err),
            { enableHighAccuracy: true }
        );
    }
  }, []); 

  if (!captainProfile || !currentUser) return <div className="p-8 text-white">Loading Captain Profile...</div>;

  // Find customer info if ride is active
  const activeCustomer = currentRide ? allUsers.find(u => u.id === currentRide.riderId) : null;

  // 1. OFFLINE STATE (First Priority)
  if (!captainProfile.isOnline) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-[#0f172a] text-white p-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E700] blur-[120px] opacity-10 rounded-full"></div>
              <div className="w-32 h-32 bg-[#1e293b] rounded-full flex items-center justify-center mb-8 border-4 border-[#1e293b] shadow-2xl relative z-10">
                  <Power size={64} className="text-red-500" />
              </div>
              <h1 className="text-3xl font-black mb-3">You are Offline</h1>
              <p className="text-gray-400 text-center mb-12 max-w-xs">Go online to start receiving ride requests in your area.</p>
              <button onClick={toggleOnline} className="w-full max-w-xs bg-[#00E700] hover:bg-[#00c000] text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,231,0,0.3)] transition-all active:scale-95">GO ONLINE</button>
          </div>
      )
  }

  // 2. ACTIVE RIDE STATE (Overrides Dashboard)
  if (currentRide && [RideStatus.ACCEPTED, RideStatus.ARRIVING, RideStatus.IN_PROGRESS].includes(currentRide.status)) {
       return (
           <div className="h-full flex flex-col relative bg-black">
               <div className="flex-1 relative">
                    <MapComponent center={captainProfile.currentLocation} destination={currentRide.dropoff} showRoute />
                    <div className="absolute top-4 left-4 right-4 bg-[#1e293b] text-white p-4 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-4">
                        <div className="bg-[#00E700] p-2 rounded-lg"><Navigation size={32} className="text-black" fill="black" /></div>
                        <div>
                             <p className="text-xs text-gray-400 font-bold uppercase mb-1">Navigation</p>
                             <h3 className="text-lg font-bold">{currentRide.status === RideStatus.IN_PROGRESS ? 'Heading to Dropoff' : 'Picking up Rider'}</h3>
                        </div>
                    </div>
               </div>
               <div className="bg-[#0f172a] p-6 rounded-t-3xl border-t border-gray-800 text-white">
                   <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white border border-gray-600 overflow-hidden">
                                <img 
                                    src={activeCustomer?.profileImage || `https://ui-avatars.com/api/?name=${activeCustomer?.fullName || 'User'}&background=random`} 
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{activeCustomer?.fullName || 'Customer'}</h4>
                                <p className="text-sm text-[#00E700]">Cash Trip • ₹{currentRide.fare}</p>
                            </div>
                        </div>
                        <button className="h-12 w-12 bg-[#1e293b] rounded-full flex items-center justify-center text-[#00E700] border border-gray-700"><Phone size={24} /></button>
                   </div>
                   {currentRide.status !== RideStatus.IN_PROGRESS ? (
                        <button onClick={startRide} className="w-full bg-[#00E700] text-black font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">START RIDE <ChevronRight strokeWidth={4} size={20} /></button>
                   ) : (
                        <button onClick={completeRide} className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">COMPLETE RIDE <CheckCircle size={20} /></button>
                   )}
               </div>
           </div>
       )
  }

  // 3. MAIN DASHBOARD (Tabs)
  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white">
       
       {/* --- TAB CONTENT AREA --- */}
       <div className="flex-1 overflow-hidden relative">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
              <div className="h-full flex flex-col">
                  {/* Dynamic Header */}
                  <div className="p-6 flex justify-between items-center bg-[#0f172a]">
                      <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-2 border-[#00E700] overflow-hidden bg-gray-700">
                             <img 
                                src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${currentUser.fullName}&background=random`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                             />
                          </div>
                          <div>
                              <h2 className="font-bold text-lg leading-tight">{currentUser.fullName}</h2>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#00E700] animate-pulse"></div>
                                <span className="text-xs text-[#00E700] font-bold tracking-wider">ONLINE</span>
                              </div>
                          </div>
                      </div>
                      <button 
                        onClick={toggleOnline} 
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/50 hover:bg-red-500/20 transition-all"
                      >
                        GO OFFLINE
                      </button>
                  </div>

                  {/* Map Area */}
                  <div className="flex-1 relative mx-4 mb-4 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
                        <MapComponent center={captainProfile.currentLocation} />
                        
                        {/* REAL REQUEST POPUP */}
                        {availableRides.length > 0 && (
                            <div className="absolute bottom-4 left-4 right-4 bg-[#111] p-5 rounded-2xl border border-[#00E700] shadow-[0_0_30px_rgba(0,231,0,0.15)] z-20 animate-slide-up">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="bg-[#00E700] text-black text-xs font-black px-2 py-1 rounded">NEW REQUEST</span>
                                    <div className="text-right"><p className="text-[10px] text-gray-400 uppercase font-bold">Est. Earnings</p><h3 className="text-2xl font-black text-white">₹{availableRides[0].fare}</h3></div>
                                </div>
                                <div className="flex gap-3 mb-6 relative">
                                    <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-gray-700"></div>
                                    <div className="space-y-4 w-full">
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-[#00E700] bg-[#0f172a] z-10"></div>
                                            <div className="flex-1"><p className="text-[10px] text-gray-500 font-bold">PICKUP</p><h4 className="text-white font-bold text-sm truncate">{availableRides[0].pickup.address}</h4></div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-[#0f172a] z-10"></div>
                                            <div className="flex-1"><p className="text-[10px] text-gray-500 font-bold">DROP</p><h4 className="text-white font-bold text-sm truncate">{availableRides[0].dropoff.address}</h4></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={rejectRide} className="flex-1 bg-red-900/40 text-red-500 font-black py-3 rounded-xl hover:bg-red-900/60 flex items-center justify-center"><X size={20} /></button>
                                    <button onClick={() => acceptRide(availableRides[0].id)} className="flex-[3] bg-[#00E700] text-black font-black py-3 rounded-xl hover:bg-[#00c000]">ACCEPT RIDE</button>
                                </div>
                            </div>
                        )}
                        
                        {availableRides.length === 0 && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-6 py-3 rounded-full backdrop-blur border border-gray-800">
                                <p className="text-gray-400 text-sm animate-pulse flex items-center gap-2">
                                   <div className="w-2 h-2 bg-[#00E700] rounded-full"></div>
                                   Finding rides nearby...
                                </p>
                            </div>
                        )}
                  </div>
              </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
              <div className="h-full p-6 overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-6">Earnings</h2>
                  
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl border border-gray-700 shadow-xl mb-6">
                      <p className="text-gray-400 text-sm font-bold uppercase mb-2">Total Earnings</p>
                      <h1 className="text-5xl font-black text-[#00E700] mb-4">₹{captainProfile.totalEarnings.toFixed(2)}</h1>
                      <div className="flex gap-4">
                          <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                             <p className="text-xs text-gray-500">Rides</p>
                             <p className="font-bold text-xl">{captainProfile.ridesCompleted}</p>
                          </div>
                          <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                             <p className="text-xs text-gray-500">Hours</p>
                             <p className="font-bold text-xl">{(captainProfile.ridesCompleted * 0.5).toFixed(1)}</p>
                          </div>
                      </div>
                  </div>

                  {/* Empty History Placeholder (Since we don't fetch ride history yet) */}
                  <div className="bg-[#1e293b] rounded-2xl p-8 text-center border border-gray-800">
                      <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="text-gray-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">Transaction History</h3>
                      <p className="text-gray-500 text-sm">Your recent completed rides will appear here.</p>
                  </div>
              </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
              <div className="h-full bg-gray-50 overflow-hidden">
                 {/* Reusing the shared Profile component */}
                 <Profile onBack={() => setActiveTab('home')} />
              </div>
          )}

       </div>

       {/* --- BOTTOM NAVIGATION --- */}
       <div className="bg-[#0f172a] border-t border-gray-800 p-2 pb-6 flex justify-around items-center z-50 shrink-0">
           <button 
             onClick={() => setActiveTab('home')} 
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'home' ? 'text-[#00E700]' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
             <span className="text-[10px] font-bold">Home</span>
           </button>
           
           <button 
             onClick={() => setActiveTab('earnings')} 
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'earnings' ? 'text-[#00E700]' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <Wallet size={24} strokeWidth={activeTab === 'earnings' ? 3 : 2} />
             <span className="text-[10px] font-bold">Earnings</span>
           </button>
           
           <button 
             onClick={() => setActiveTab('profile')} 
             className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'profile' ? 'text-[#00E700]' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <User size={24} strokeWidth={activeTab === 'profile' ? 3 : 2} />
             <span className="text-[10px] font-bold">Profile</span>
           </button>
       </div>
    </div>
  );
};
