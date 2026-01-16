import React from 'react';
import { Venue } from '../types';
import { MapPin, Users, Clock, Warehouse, Trees, Building2, Waves, School, HelpCircle } from 'lucide-react';
import { THEME, PRIMARY_COLOR } from '../constants';

interface VenueCardProps {
  venue: Venue;
  onViewDetails?: (id: string) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onViewDetails }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'indoor': return Warehouse;
      case 'outdoor': return Trees;
      case 'hall': return Building2;
      case 'pool': return Waves;
      case 'classroom': return School;
      default: return HelpCircle;
    }
  };

  const Icon = getIcon(venue.type);

  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-[${PRIMARY_COLOR}]/30 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${THEME.bgLight} ${THEME.text} group-hover:${THEME.bg} group-hover:text-white transition-colors duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{venue.name}</h3>
        <div className="flex items-center text-slate-500 text-xs font-medium">
          <MapPin className="h-3 w-3 mr-1" />
          {venue.location}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-slate-50">
        <div className="flex items-center text-sm text-slate-600">
          <Users className={`h-4 w-4 mr-2 ${THEME.text}`} />
          <span className="font-medium">{venue.capacity}</span> <span className="text-slate-400 ml-1">people</span>
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Clock className={`h-4 w-4 mr-2 ${THEME.text}`} />
          <span className="font-medium">₹{venue.hourlyRate}</span> <span className="text-slate-400 ml-1">/hr</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
          {venue.amenities.slice(0, 3).map((am, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              {am}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-200">
              +{venue.amenities.length - 3}
            </span>
          )}
        </div>

        <button
          onClick={() => onViewDetails?.(venue.id)}
          className={`w-full py-2 px-4 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg ${THEME.hoverBg} hover:text-white hover:border-[${PRIMARY_COLOR}] transition-all text-sm shadow-sm`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default VenueCard;