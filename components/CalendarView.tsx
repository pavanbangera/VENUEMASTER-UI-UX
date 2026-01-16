import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, Info, X, Download } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_VENUES } from '../constants';
import { Booking } from '../types';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number; position: 'top' | 'bottom' } | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const CLIENT_NAME = 'Pavan';

  const popoverRef = useRef<HTMLDivElement>(null);

  // Track window size for responsive modal behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close popover on outside click or scroll
  useEffect(() => {
    const handleScroll = () => {
      if (selectedBooking) setSelectedBooking(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [selectedBooking]);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Filter bookings for this month AND client (Only show Pavan's bookings)
  const monthBookings = MOCK_BOOKINGS.filter(booking => {
    const bookingDate = new Date(booking.date);
    return (
      booking.customerName === CLIENT_NAME &&
      bookingDate.getMonth() === month &&
      bookingDate.getFullYear() === year
    );
  });

  const getBookingsForDay = (day: number) => {
    return monthBookings.filter(booking => {
      const d = new Date(booking.date);
      return d.getDate() === day;
    });
  };

  const handlePillClick = (e: React.MouseEvent<HTMLDivElement>, booking: Booking) => {
    e.stopPropagation();
    
    // For mobile, we don't need calculation, just set booking
    if (window.innerWidth < 640) {
      setSelectedBooking(booking);
      return;
    }

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    // Constants for popover dimensions
    const POPOVER_WIDTH = 300; 
    const POPOVER_HEIGHT = 260; 
    const GAP = 12;

    let top = rect.bottom + GAP;
    let left = rect.left;
    let position: 'top' | 'bottom' = 'bottom';

    // Horizontal Adjustment
    if (left + POPOVER_WIDTH > window.innerWidth - 20) {
      left = window.innerWidth - POPOVER_WIDTH - 20;
    }
    
    if (left < 20) left = 20;

    // Vertical Adjustment
    if (top + POPOVER_HEIGHT > window.innerHeight - 20) {
      top = rect.top - POPOVER_HEIGHT - GAP;
      position = 'top';
    }

    setPopoverPosition({ top, left, position });
    setSelectedBooking(booking);
  };

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'confirmed': return {
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
        dot: 'bg-emerald-500',
        borderTop: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700',
        iconColor: 'text-emerald-600'
      };
      case 'pending': return {
        pill: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100',
        dot: 'bg-amber-500',
        borderTop: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        iconColor: 'text-amber-600'
      };
      case 'cancelled': return {
        pill: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100',
        dot: 'bg-rose-500',
        borderTop: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800',
        iconColor: 'text-rose-600'
      };
      default: return {
        pill: 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100',
        dot: 'bg-slate-400',
        borderTop: 'bg-slate-400',
        badge: 'bg-slate-100 text-slate-700',
        iconColor: 'text-slate-500'
      };
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 sm:h-40 bg-slate-50/30 border-r border-b border-slate-100"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const dayBookings = getBookingsForDay(day);

      const displayedBookings = dayBookings.slice(0, 3);
      const remainingCount = dayBookings.length - 3;

      days.push(
        <div 
          key={day} 
          className={`
            relative h-32 sm:h-40 border-r border-b border-slate-100 p-2 transition-colors group
            ${isToday ? 'bg-blue-50/20' : 'bg-white hover:bg-slate-50'}
          `}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`
              text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full
              ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700'}
            `}>
              {day}
            </span>
          </div>

          {/* Mobile Dot Indicators - Now Clickable & Larger Touch Area */}
          <div className="sm:hidden flex flex-wrap gap-1.5 mt-2 justify-center content-start min-h-[2rem] w-full">
             {dayBookings.map((b, i) => (
                <div 
                    key={i} 
                    onClick={(e) => handlePillClick(e, b)}
                    className="p-1 cursor-pointer" // Padding for larger touch target
                >
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusStyles(b.status).dot} shadow-sm`} />
                </div>
             ))}
          </div>

          {/* Desktop Event Pills */}
          <div className="hidden sm:flex flex-col gap-1 relative z-10">
            {displayedBookings.map((booking, idx) => {
               const venue = MOCK_VENUES.find(v => v.id === booking.venueId);
               const styles = getStatusStyles(booking.status);
               const isSelected = selectedBooking?.id === booking.id;
               
               return (
                 <div 
                   key={idx}
                   onClick={(e) => handlePillClick(e, booking)}
                   className={`
                     group/pill relative text-[10px] truncate px-2 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all duration-100 select-none
                     active:scale-95
                     ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500 z-20' : ''}
                     ${styles.pill}
                   `}
                 >
                   <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${styles.dot}`}></div>
                   <span className="truncate font-medium">{venue?.name}</span>
                 </div>
               )
            })}
            
            {remainingCount > 0 && (
              <div className="text-[10px] text-slate-400 pl-1 font-medium hover:text-slate-600 cursor-pointer">
                +{remainingCount} more
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const isMobile = windowWidth < 640;

  // Determine modal styles: Popover for desktop, Bottom Sheet for mobile
  const modalStyle: React.CSSProperties = (!isMobile && popoverPosition) 
    ? { top: popoverPosition.top, left: popoverPosition.left } 
    : {};

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes popoverIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popover {
          animation: popoverIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Events Calendar</h2>
          <p className="text-slate-500 mt-1">Manage your schedule. Click on events for details.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
             <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
               <ChevronLeft className="h-5 w-5" />
             </button>
             <div className="px-4 py-1 text-base font-semibold text-slate-900 min-w-[140px] text-center flex items-center justify-center gap-2">
               <CalendarIcon className="h-4 w-4 text-slate-400" />
               {new Date(year, month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
             </div>
             <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
               <ChevronRight className="h-5 w-5" />
             </button>
          </div>
          
          <button 
             onClick={goToToday}
             className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all shadow-sm"
           >
             Today
           </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 relative z-0">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 rounded-t-xl">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 rounded-b-xl">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 px-4 py-3 bg-white rounded-lg border border-slate-200">
         <div className="flex items-center">
           <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2 ring-2 ring-emerald-100"></div>
           <span className="font-medium">Confirmed</span>
         </div>
         <div className="flex items-center">
           <div className="h-3 w-3 rounded-full bg-amber-500 mr-2 ring-2 ring-amber-100"></div>
           <span className="font-medium">Pending</span>
         </div>
         <div className="flex items-center">
           <div className="h-3 w-3 rounded-full bg-rose-500 mr-2 ring-2 ring-rose-100"></div>
           <span className="font-medium">Cancelled</span>
         </div>
         <div className="w-px h-4 bg-slate-300 mx-2 hidden sm:block"></div>
         <div className="flex items-center">
           <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] mr-2 shadow-sm">
             {new Date().getDate()}
           </div>
           <span className="font-medium">Today</span>
         </div>
      </div>

      {/* Details Modal / Popover */}
      {selectedBooking && (
        <>
          {/* Backdrop - Covers screen on mobile/desktop */}
          <div 
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedBooking(null)}
          ></div>

          {/* Card Container */}
          <div 
            ref={popoverRef}
            className={`
              fixed z-[70] bg-white shadow-2xl overflow-hidden
              ${isMobile 
                  ? 'bottom-0 left-0 right-0 rounded-t-2xl animate-slide-up w-full max-h-[85vh] overflow-y-auto' 
                  : 'rounded-xl w-[300px] animate-popover border border-slate-100'
              }
            `}
            style={modalStyle}
            onClick={e => e.stopPropagation()}
          >
             {/* Colored Top Accent */}
             <div className={`h-1.5 w-full ${getStatusStyles(selectedBooking.status).borderTop}`} />

             {/* Close Button (Absolute Top Right) */}
             <button 
               onClick={() => setSelectedBooking(null)}
               className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
             >
               <X className="h-5 w-5" />
             </button>

             {/* Content */}
             <div className="p-6">
                
                {/* Header Section */}
                <div className="mb-5">
                   <div className="mb-2">
                       <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(selectedBooking.status).badge}`}>
                          {selectedBooking.status}
                       </span>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                     {MOCK_VENUES.find(v => v.id === selectedBooking.venueId)?.name}
                   </h3>
                   <div className="flex items-center text-sm text-slate-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      {MOCK_VENUES.find(v => v.id === selectedBooking.venueId)?.location}
                   </div>
                </div>

                {/* Data Grid */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="bg-white p-1 rounded-md shadow-sm">
                                <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                             {new Date(selectedBooking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="bg-white p-1 rounded-md shadow-sm">
                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Time</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                             {selectedBooking.durationHours} Hours
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                   <div>
                       <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Total Amount</p>
                       <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{selectedBooking.totalPrice}</p>
                   </div>
                   
                   {selectedBooking.status === 'confirmed' && (
                        <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                            <Download className="h-3.5 w-3.5" />
                            Invoice
                        </button>
                   )}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarView;