import React, { useState, useMemo } from 'react';
import { MOCK_VENUES, THEME, PRIMARY_COLOR } from '../constants';
import { VenueType } from '../types';
import VenueCard from './VenueCard';
import { Search } from 'lucide-react';

interface VenueViewProps {
  category: string;
  onViewVenue?: (id: string) => void;
}

const VenueView: React.FC<VenueViewProps> = ({ category, onViewVenue }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Convert generic category IDs to specific VenueTypes if needed, or filter directly
  // Mapping: indoor -> indoor, outdoor -> outdoor, hall -> hall, pool -> pool, classroom -> classroom
  const filteredVenues = useMemo(() => {
    return MOCK_VENUES.filter(venue => {
      const matchesCategory = venue.type === category;
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm]);

  const getTitle = (cat: string) => {
    switch (cat) {
      case 'indoor': return 'Indoor Grounds';
      case 'outdoor': return 'Outdoor Grounds';
      case 'hall': return 'Banquet Halls';
      case 'pool': return 'Swimming Pools';
      case 'classroom': return 'Classrooms & Labs';
      default: return 'Venues';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{getTitle(category)}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Browse available {category} spaces for your next event.</p>
        </div>
      </div>

      {/* Search Only */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            className={`w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 focus:border-[${PRIMARY_COLOR}] transition-all`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} onViewDetails={onViewVenue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">No venues found matching your criteria.</p>
          <button
            onClick={() => setSearchTerm('')}
            className={`mt-2 ${THEME.text} ${THEME.hoverText} font-medium text-sm`}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueView;