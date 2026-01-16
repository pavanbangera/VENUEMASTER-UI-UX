import React, { useState } from 'react';
import {
  Warehouse, Trees, Building2, Waves, School, HelpCircle, MapPin, Filter, Download, ChevronDown, Check, Calendar, Clock
} from 'lucide-react';
import { MOCK_VENUES, MOCK_BOOKINGS, THEME, PRIMARY_COLOR } from '../constants';
import { Booking } from '../types';

const MyBookingsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const CLIENT_NAME = 'Pavan';

  const myBookings = MOCK_BOOKINGS.filter(b => {
    const isClient = b.customerName === CLIENT_NAME;
    const isStatusMatch = filterStatus === 'all' || b.status === filterStatus;
    return isClient && isStatusMatch;
  });

  // Sort by date descending
  const sortedBookings = [...myBookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const filterOptions = [
    { id: 'all', label: 'All Statuses' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Booking History</h2>
          <p className="text-slate-500 mt-1">Manage and track all your venue reservations.</p>
        </div>

        <div className="relative z-20">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm
              ${isFilterOpen || filterStatus !== 'all'
                ? `${THEME.bg} text-white border-[${PRIMARY_COLOR}]`
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
            `}
          >
            <Filter className="h-4 w-4 mr-2" />
            {filterOptions.find(opt => opt.id === filterStatus)?.label || 'Filter Status'}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 animate-slide-down">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setFilterStatus(option.id);
                      setIsFilterOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors
                      ${filterStatus === option.id ? `${THEME.text} font-medium ${THEME.bgLight}` : 'text-slate-600'}
                    `}
                  >
                    {option.label}
                    {filterStatus === option.id && <Check className={`h-3.5 w-3.5 ${THEME.text}`} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {sortedBookings.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Venue Details</th>
                    <th className="px-6 py-4">Date & Duration</th>
                    <th className="px-6 py-4">Total Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedBookings.map((booking) => {
                    const venue = MOCK_VENUES.find(v => v.id === booking.venueId);
                    const Icon = getVenueIcon(venue?.type || '');

                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mr-4 border border-slate-200 group-hover:border-[${PRIMARY_COLOR}]/30 group-hover:bg-[${PRIMARY_COLOR}]/5 group-hover:text-[${PRIMARY_COLOR}] transition-all`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{venue?.name || 'Unknown Venue'}</p>
                              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                <MapPin className="h-3 w-3 mr-1" />
                                {venue?.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-medium flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                              {new Date(booking.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-xs text-slate-400 mt-1 flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                              {booking.durationHours} Hours
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">₹{booking.totalPrice}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleDownloadInvoice(booking, venue?.name || 'Venue')}
                              className={`text-slate-500 ${THEME.hoverText} font-medium text-xs inline-flex items-center transition-colors py-1.5 px-3 rounded-lg ${THEME.hoverBgLight}`}
                              title="Download Invoice"
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
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
          <div className="sm:hidden space-y-4">
            {sortedBookings.map((booking) => {
              const venue = MOCK_VENUES.find(v => v.id === booking.venueId);
              const Icon = getVenueIcon(venue?.type || '');

              return (
                <div key={booking.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{venue?.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <MapPin className="h-3 w-3 mr-1" />
                          {venue?.location}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-50 py-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Date</p>
                        <p className="text-sm font-medium text-slate-700">
                          {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Duration</p>
                        <p className="text-sm font-medium text-slate-700">{booking.durationHours} Hours</p>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-slate-900">₹{booking.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleDownloadInvoice(booking, venue?.name || 'Venue')}
                      className={`w-full flex items-center justify-center py-2.5 rounded-lg ${THEME.bgLight} ${THEME.text} font-medium text-sm ${THEME.hoverBgLight} transition-colors`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-slate-900 font-medium mb-1">No bookings found</p>
          <p className="text-slate-500 text-sm">Try adjusting your status filter or create a new booking.</p>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className={`mt-4 ${THEME.text} ${THEME.hoverText} text-sm font-medium`}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsView;