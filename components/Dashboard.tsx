import React from 'react';
import { THEME, PRIMARY_COLOR } from '../constants';
import {
  Calendar, CheckCircle, Clock, CreditCard, MapPin,
  Warehouse, Trees, Building2, Waves, School, HelpCircle, ArrowRight, Download, Sparkles, ChevronRight, Users, Search
} from 'lucide-react';
import StatCard from './StatCard';
import { MOCK_VENUES, MOCK_BOOKINGS } from '../constants';
import { Booking } from '../types';

interface DashboardProps {
  setCurrentView: (view: string) => void;
  onViewVenue?: (id: string) => void;
  isAuthenticated?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, onViewVenue, isAuthenticated = false }) => {
  // Client Filter (Simulating logged-in user 'Pavan')
  const CLIENT_NAME = 'Pavan';
  const myBookings = MOCK_BOOKINGS.filter(b => b.customerName === CLIENT_NAME);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // Sort by date descending (newest first)
  const sortedBookings = [...myBookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get last 5
  const recentBookings = sortedBookings.slice(0, 5);

  // Prepare venues for scrolling marquee (duplicate to ensure seamless loop)
  const scrollingVenues = [...MOCK_VENUES, ...MOCK_VENUES];

  // Filter Venues Logic
  const filteredVenues = MOCK_VENUES.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || venue.type === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Hall', 'Pool', 'Classroom'];

  const stats = {
    totalBookings: myBookings.length,
    activeBookings: myBookings.filter(b => b.status === 'confirmed').length,
    pendingRequests: myBookings.filter(b => b.status === 'pending').length,
    totalSpent: myBookings.reduce((acc, curr) => acc + curr.totalPrice, 0),
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-600/10';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100 ring-1 ring-amber-600/10';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100 ring-1 ring-rose-600/10';
      default: return 'bg-slate-50 text-slate-700 border-slate-100 ring-1 ring-slate-600/10';
    }
  };

  const getVenueIcon = (type: string) => {
    switch (type) {
      case 'indoor': return Warehouse;
      case 'outdoor': return Trees;
      case 'hall': return Building2;
      case 'pool': return Waves;
      case 'classroom': return School;
      default: return HelpCircle;
    }
  };

  const handleDownloadInvoice = (booking: Booking, venueName: string) => {
    const invoiceContent = `
VENUE MASTER AI - TAX INVOICE
------------------------------------------------
Invoice ID: INV-${booking.id.toUpperCase()}
Date: ${new Date().toLocaleDateString()}
Status: ${booking.status.toUpperCase()}

BILL TO:
${booking.customerName}

DETAILS:
Venue: ${venueName}
Event Date: ${booking.date}
Duration: ${booking.durationHours} Hours
Rate/Hr: Calculated based on venue rates

------------------------------------------------
TOTAL AMOUNT: ₹${booking.totalPrice}
------------------------------------------------

Thank you for booking with VenueMaster AI!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${booking.id}_${booking.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-infinite {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuthenticated ? `Welcome back, ${CLIENT_NAME}.` : 'Explore our premium venues.'}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
          <Calendar className="h-3 w-3" />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Client Stats - Responsive Grid */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            colorClass="bg-white"
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={CheckCircle}
            trend="Upcoming"
            trendUp={true}
            colorClass="bg-white"
          />
          <StatCard
            title="Action Items"
            value={stats.pendingRequests}
            icon={Clock}
            trend={stats.pendingRequests > 0 ? "Ask" : "Clear"}
            trendUp={stats.pendingRequests === 0}
            colorClass="bg-white"
          />
          <StatCard
            title="Total Spent"
            value={`₹${stats.totalSpent.toLocaleString()}`}
            icon={CreditCard}
            colorClass="bg-white"
          />
        </div>
      )}

      {/* Explore Venues - Auto Scrolling Marquee */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Featured Venues</h3>
          </div>
        </div>

        <div className="relative w-full overflow-hidden bg-gradient-to-b from-white to-slate-50/50 border border-slate-100 rounded-lg py-2 group hover:shadow-lg transition-shadow duration-500">
          <div className="flex animate-scroll-infinite w-max gap-3 px-3">
            {scrollingVenues.map((venue, index) => {
              const Icon = getVenueIcon(venue.type);
              return (
                <div
                  key={`${venue.id}-${index}`}
                  onClick={() => onViewVenue?.(venue.id)}
                  className="w-[200px] flex-shrink-0 bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group/card relative"
                >
                  <div className="h-20 bg-slate-50 relative group-hover/card:bg-slate-100/50 transition-colors flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-transparent"></div>
                    <Icon className={`h-8 w-8 text-slate-300/80 group-hover/card:text-[${PRIMARY_COLOR}] group-hover/card:scale-110 transition-all duration-300 z-10`} />

                    {/* Price Tag with Glass effect */}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-bold text-slate-700 shadow-sm border border-white/50 z-20">
                      ₹{venue.hourlyRate}/hr
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="flex items-start justify-between mb-0.5">
                      <h4 className="font-semibold text-slate-800 text-xs truncate flex-1 pr-1">{venue.name}</h4>
                    </div>

                    <div className="flex items-center text-[9px] text-slate-500 mb-1.5 font-medium">
                      <MapPin className="h-2.5 w-2.5 mr-0.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{venue.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9px] uppercase tracking-wider px-1 py-0 bg-slate-100 rounded text-slate-600 font-semibold border border-slate-200/50">
                        {venue.type}
                      </span>
                      <button className={`h-5 w-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/card:bg-[${PRIMARY_COLOR}] group-hover/card:border-[${PRIMARY_COLOR}] group-hover/card:text-white transition-all`}>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-400 group-hover/card:text-white transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradients to fade edges */}
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-slate-50 via-slate-50/50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-slate-50 via-slate-50/50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      {/* Guest View - All Venues with Search/Filter */}
      {!isAuthenticated && (
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">All Venues</h3>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 sm:min-w-[240px]">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search venues..."
                  className="block w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ee2a24] focus:border-[#ee2a24] text-xs shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                    px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200
                    ${selectedCategory === category
                    ? `${THEME.bg} text-white shadow-sm shadow-[${PRIMARY_COLOR}]/20`
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }
                  `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredVenues.map((venue) => {
                const Icon = getVenueIcon(venue.type);
                return (
                  <div
                    key={venue.id}
                    onClick={() => onViewVenue?.(venue.id)}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-4 flex flex-col h-full"
                  >
                    {/* Icon Header */}
                    <div className={`w-12 h-12 rounded-xl ${THEME.bgLight} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${THEME.text}`} />
                    </div>

                    {/* Title & Location */}
                    <div className="mb-3">
                      <h4 className={`text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-[${PRIMARY_COLOR}] transition-colors`}>{venue.name}</h4>
                      <div className="flex items-center text-slate-500 font-medium text-xs">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-slate-400" />
                        <span className="truncate">{venue.location}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-3"></div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-slate-600 font-medium text-sm">
                        <Users className="h-4 w-4 mr-1.5 text-slate-400" />
                        <span>{venue.capacity} <span className="text-slate-400 text-xs">ppl</span></span>
                      </div>
                      <div className="flex items-center text-slate-900 font-bold text-base">
                        <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
                        ₹{venue.hourlyRate} <span className="text-slate-400 text-xs font-medium ml-0.5">/hr</span>
                      </div>
                    </div>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {venue.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-md text-[10px] font-semibold uppercase tracking-wide">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <button className={`w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:border-[${PRIMARY_COLOR}] hover:text-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_COLOR}]/5 transition-all`}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="mx-auto h-12 w-12 text-slate-300 mb-3">🔍</div>
              <h3 className="text-lg font-medium text-slate-900">No venues found</h3>
              <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className={`mt-4 px-4 py-2 text-sm font-medium ${THEME.text} hover:underline`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Bookings Section */}
      {isAuthenticated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
            <button
              onClick={() => setCurrentView('my-bookings')}
              className={`text-xs ${THEME.text} ${THEME.hoverText} font-medium flex items-center transition-colors hover:underline`}
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Venue Details</th>
                        <th className="px-5 py-3 font-semibold">Date & Time</th>
                        <th className="px-5 py-3 font-semibold">Total Amount</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentBookings.map((booking) => {
                        const venue = MOCK_VENUES.find(v => v.id === booking.venueId);
                        const Icon = getVenueIcon(venue?.type || '');

                        return (
                          <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-5 py-3">
                              <div className="flex items-center">
                                <div className={`h-9 w-9 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mr-3 border border-slate-200 group-hover:border-[${PRIMARY_COLOR}]/30 group-hover:bg-[${PRIMARY_COLOR}]/5 group-hover:text-[${PRIMARY_COLOR}] transition-all shadow-sm`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{venue?.name || 'Unknown Venue'}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{venue?.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-slate-900 font-semibold text-xs">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">{booking.durationHours} Hours Duration</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                              <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs">₹{booking.totalPrice}</span>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right whitespace-nowrap">
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleDownloadInvoice(booking, venue?.name || 'Venue')}
                                  className={`text-slate-500 ${THEME.hoverText} ${THEME.hoverBgLight} border border-transparent hover:border-[${PRIMARY_COLOR}]/20 font-medium text-[10px] inline-flex items-center transition-all py-1.5 px-2.5 rounded-md active:scale-95`}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Invoice
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {recentBookings.map((booking) => {
                  const venue = MOCK_VENUES.find(v => v.id === booking.venueId);
                  const Icon = getVenueIcon(venue?.type || '');
                  return (
                    <div key={booking.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-xs">{venue?.name}</h4>
                            <p className="text-[10px] text-slate-500">{venue?.location}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-50 py-2">
                        <div>
                          <p className="text-[10px] text-slate-400 mb-0.5">Date</p>
                          <p className="text-xs font-medium text-slate-700">
                            {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 mb-0.5">Total</p>
                          <p className="text-xs font-bold text-slate-900">₹{booking.totalPrice}</p>
                        </div>
                      </div>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleDownloadInvoice(booking, venue?.name || 'Venue')}
                          className={`w-full flex items-center justify-center py-1.5 rounded-lg ${THEME.bgLight} ${THEME.text} font-medium text-[10px] ${THEME.hoverBgLight} transition-colors`}
                        >
                          <Download className="h-3 w-3 mr-1.5" />
                          Download Invoice
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">No bookings found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;