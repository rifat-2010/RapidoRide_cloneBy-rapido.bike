
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { RiderApp } from './views/RiderApp';
import { CaptainApp } from './views/CaptainApp';
import { AdminPanel } from './views/AdminPanel';
import { Website } from './views/Website';
import { Auth } from './views/Auth';
import { Profile } from './views/Profile';
import { Navbar } from './components/Navbar';

const MainRouter = () => {
  const { currentUser, isAuthenticated, isLoadingAuth } = useAppContext();
  const [view, setView] = useState<'HOME' | 'PROFILE' | 'WEBSITE'>('HOME');

  if (isLoadingAuth) {
      return <div className="h-screen w-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!isAuthenticated) {
     return <AuthOrWebsite />;
  }

  // Render the public website as a full-screen view if selected
  if (view === 'WEBSITE') {
      return <Website isAuthenticated={true} onNavigateToDashboard={() => setView('HOME')} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <Navbar 
          onProfileClick={() => setView('PROFILE')} 
          onHomeClick={() => setView('HOME')} 
          onWebsiteClick={() => setView('WEBSITE')}
      />
      <div className="flex-1 overflow-hidden relative">
        {view === 'PROFILE' ? (
            <Profile onBack={() => setView('HOME')} />
        ) : (
            <>
                {currentUser?.role === 'USER' && <RiderApp />}
                {currentUser?.role === 'RIDER' && <CaptainApp />}
                {currentUser?.role === 'ADMIN' && <AdminPanel />}
                {/* Fallback for safety */}
                {currentUser?.role === 'SITE' && <Website />} 
            </>
        )}
      </div>
    </div>
  );
};

const AuthOrWebsite = () => {
   const [showAuth, setShowAuth] = useState(false);

   if (showAuth) return <Auth />;
   
   return (
     <div className="relative h-full">
        <div className="absolute top-6 right-6 z-50">
             <button 
                onClick={() => setShowAuth(true)}
                className="bg-black text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all"
             >
                Sign In / Up
             </button>
        </div>
        <Website onNavigateToAuth={() => setShowAuth(true)} />
     </div>
   );
}

const App: React.FC = () => {
  return (
    <AppProvider>
       <MainRouter />
    </AppProvider>
  );
};

export default App;
