
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Ride, RideStatus, CaptainProfile, Location, INITIAL_LOCATION } from '../types';
import { db } from '../services/Database';

interface AppContextType {
  // Auth State
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (payload: any) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (name: string, image: string) => Promise<void>;
  
  // Real-time Ride State
  currentRide: Ride | null;
  availableRides: Ride[]; // For captains
  rideHistory: Ride[]; // NEW: For users to see history
  
  // User Actions
  requestRide: (pickup: Location, dropoff: Location, price: number, dist: number) => Promise<void>;
  cancelRide: () => Promise<void>;
  
  // Captain Actions
  captainProfile: CaptainProfile | null;
  toggleOnline: () => void;
  acceptRide: (rideId: string) => Promise<void>;
  startRide: () => Promise<void>;
  completeRide: () => Promise<void>;
  rejectRide: () => void;

  // Admin
  allUsers: User[];
  promoteToCaptain: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [captainProfile, setCaptainProfile] = useState<CaptainProfile | null>(null);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]); // NEW
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // --- AUTHENTICATION ---

  const login = async (payload: any) => {
    const { user, token } = await db.signIn(payload);
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const signup = async (payload: any) => {
    const { user, token } = await db.signUp(payload);
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRide(null);
    setCaptainProfile(null);
    setRideHistory([]);
    localStorage.removeItem('token');
  };

  const updateUserProfile = async (name: string, image: string) => {
      const updatedUser = await db.updateProfile(name, image);
      setCurrentUser(updatedUser);
  };

  // Restore Session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await db.getMe();
          setCurrentUser(user);
        } catch (err) {
          console.error("Session expired");
          localStorage.removeItem('token');
        }
      }
      setIsLoadingAuth(false);
    };
    initAuth();
  }, []);

  // --- CAPTAIN DATA ---
  useEffect(() => {
    const loadProfile = async () => {
        if (currentUser?.role === 'RIDER') {
          const profile = await db.getCaptainProfile(currentUser.id);
          setCaptainProfile(profile);
        }
    }
    loadProfile();
  }, [currentUser]);

  // --- REAL-TIME SYNC LOOP ---
  useEffect(() => {
    const syncState = async () => {
      if (!currentUser) return;

      try {
        // 1. Fetch Users (for admin/roles)
        const users = await db.getAllUsers();
        setAllUsers(users);

        // 2. Fetch Rides
        const rides = await db.getAllRides();

        // IF USER: Update my current ride status AND history
        if (currentUser.role === 'USER') {
            const myRides = rides.filter(r => r.riderId === currentUser.id);
            // Sort by newest first
            setRideHistory(myRides.sort((a, b) => b.createdAt - a.createdAt));

            const myActiveRide = myRides.find(r => r.status !== RideStatus.COMPLETED && r.status !== RideStatus.CANCELLED);
            setCurrentRide(myActiveRide || null);
        }

        // IF CAPTAIN: Update available rides
        if (currentUser.role === 'RIDER' && captainProfile?.isOnline) {
            const pending = rides.filter(r => r.status === RideStatus.REQUESTED);
            setAvailableRides(pending);
            
            const myActiveRide = rides.find(r => r.captainId === currentUser.id && r.status !== RideStatus.COMPLETED);
            if (myActiveRide) setCurrentRide(myActiveRide);
            else if (currentRide?.status !== RideStatus.REQUESTED) setCurrentRide(null); 
        }
      } catch (e) {
        // console.warn("Polling error", e);
      }
    };

    if (currentUser) {
        syncState();
        const interval = setInterval(syncState, 2000);
        return () => clearInterval(interval);
    }
  }, [currentUser, captainProfile?.isOnline]);


  // --- USER ACTIONS ---

  const requestRide = async (pickup: Location, dropoff: Location, price: number, dist: number) => {
    if (!currentUser) return;
    
    const newRide: Ride = {
      id: `ride_${Date.now()}`,
      riderId: currentUser.id,
      status: RideStatus.SEARCHING, // Initial state
      pickup,
      dropoff,
      fare: price,
      distance: dist,
      duration: Math.round(dist * 3.5),
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: Date.now()
    };

    await db.createRideRequest(newRide);
    setCurrentRide(newRide);

    setTimeout(async () => {
       await db.updateRideStatus(newRide.id, RideStatus.REQUESTED);
    }, 1500);
  };

  const cancelRide = async () => {
    if (currentRide) {
      await db.updateRideStatus(currentRide.id, RideStatus.CANCELLED);
      setCurrentRide(null);
    }
  };

  // --- CAPTAIN ACTIONS ---

  const toggleOnline = async () => {
    if (captainProfile) {
      const updated = { ...captainProfile, isOnline: !captainProfile.isOnline };
      await db.updateCaptainProfile(updated);
      setCaptainProfile(updated);
    }
  };

  const acceptRide = async (rideId: string) => {
    if (currentUser?.role !== 'RIDER') return;
    await db.updateRideStatus(rideId, RideStatus.ACCEPTED, currentUser.id);
  };

  const startRide = async () => {
    if (currentRide) {
       await db.updateRideStatus(currentRide.id, RideStatus.IN_PROGRESS);
    }
  };

  const completeRide = async () => {
    if (currentRide && captainProfile) {
       await db.updateRideStatus(currentRide.id, RideStatus.COMPLETED);
       
       const updatedProfile = {
           ...captainProfile,
           totalEarnings: captainProfile.totalEarnings + (currentRide.fare * 0.8),
           ridesCompleted: captainProfile.ridesCompleted + 1
       };
       await db.updateCaptainProfile(updatedProfile);
       setCaptainProfile(updatedProfile);
       setCurrentRide(null);
    }
  };

  const rejectRide = () => {
     // Local rejection logic
  };

  // --- ADMIN ACTIONS ---
  const promoteToCaptain = async (userId: string) => {
      console.log("Use MongoDB Atlas to change roles manually for now.");
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      isLoadingAuth,
      login,
      signup,
      logout,
      updateUserProfile,
      currentRide,
      availableRides,
      rideHistory, // Exported
      requestRide,
      cancelRide,
      captainProfile,
      toggleOnline,
      acceptRide,
      startRide,
      completeRide,
      rejectRide,
      allUsers,
      promoteToCaptain
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
