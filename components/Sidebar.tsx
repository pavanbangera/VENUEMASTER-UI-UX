import React from 'react';
import { NAV_ITEMS, THEME, PRIMARY_COLOR } from '../constants';
import { LogOut, Settings, Hexagon } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen, isAuthenticated }) => {

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    setIsMobileOpen(false); // Close sidebar on mobile after click
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!isAuthenticated && (item.id === 'calendar' || item.id === 'my-bookings')) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-slate-200 text-slate-600 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center border-b border-slate-100 px-6">
            <Hexagon className={`h-8 w-8 ${THEME.text} mr-2 fill-[${PRIMARY_COLOR}]/20`} />
            <span className="text-xl font-bold tracking-tight text-slate-800">VenueMaster</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? `${THEME.bg} text-white shadow-md shadow-[${PRIMARY_COLOR}]/20`
                      : `text-slate-500 ${THEME.hoverBgLight} ${THEME.hoverText}`
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[${PRIMARY_COLOR}]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions - Removed dummy Sign Out as it's in header now */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;