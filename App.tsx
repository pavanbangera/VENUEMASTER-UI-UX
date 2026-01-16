import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VenueView from './components/VenueView';
import EnquiryView from './components/EnquiryView';
import MyBookingsView from './components/MyBookingsView';
import CalendarView from './components/CalendarView';
import LoginView from './components/LoginView';
import { Menu, UserCircle, LogOut, Hexagon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { THEME, PRIMARY_COLOR } from './constants';

import VenueDetailsView from './components/VenueDetailsView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null); // To store action before login

  const handleViewVenue = (id: string) => {
    setSelectedVenueId(id);
    setCurrentView('venue-details');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);

    if (pendingAction === 'booking' && selectedVenueId) {
      setCurrentView('venue-details');
      setPendingAction(null);
      toast.success("Logged in successfully! You can now proceed with booking.");
    } else {
      // Just close modal AND show success message
      toast.success("Successfully logged in!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    toast.success("Logged out successfully");
  };

  const handleBookVenue = () => {
    if (isAuthenticated) {
      toast.success("Booking confirmed! (Dummy action)");
    } else {
      setPendingAction('booking');
      setIsLoginModalOpen(true);
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} onViewVenue={handleViewVenue} isAuthenticated={isAuthenticated} />;
      case 'calendar':
        return <CalendarView />;
      case 'my-bookings':
        return <MyBookingsView />;
      case 'enquiry':
        return <EnquiryView />;
      case 'venue-details':
        return (
          <VenueDetailsView
            venueId={selectedVenueId}
            onBack={() => setCurrentView('dashboard')}
            onBook={handleBookVenue}
          />
        );
      case 'indoor':
      case 'outdoor':
      case 'hall':
      case 'pool':
      case 'classroom':
        return <VenueView category={currentView} onViewVenue={handleViewVenue} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} onViewVenue={handleViewVenue} isAuthenticated={isAuthenticated} />;
    }
  };

  /* Removed early return for !isAuthenticated logic to allow browsing */


  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      <Toaster
        position="top-center"
        containerStyle={{
          zIndex: 99999
        }}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }} />
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        isAuthenticated={isAuthenticated}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center ml-1">
            <Hexagon className={`h-6 w-6 ${THEME.text} mr-2 fill-[${PRIMARY_COLOR}]/20`} />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-800">VenueMaster</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">Premium Venue Booking</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:block">
            {/* Optional Global Search could go here */}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <UserCircle className="h-8 w-8 text-slate-400" />
                  <span className="hidden sm:block">Pavan</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 text-sm font-bold text-white bg-[#ee2a24] hover:bg-[#d42520] rounded-lg transition-all shadow-sm transform active:scale-95"
              >
                Log In
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-2 lg:px-4 lg:pb-4 lg:pt-2">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <LoginView
          onLogin={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;