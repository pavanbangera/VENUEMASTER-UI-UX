import React, { useState } from 'react';
import {
    MapPin, Users, Clock, Warehouse, Check, Star, Share2, Heart,
    Calendar, Info, ArrowLeft, Shield, Wifi, Car, Coffee, Music
} from 'lucide-react';
import { THEME, PRIMARY_COLOR, MOCK_VENUES } from '../constants';
import { Venue } from '../types';

interface VenueDetailsViewProps {
    venueId?: string;
    onBack: () => void;
    onBook: () => void;
}

const VenueDetailsView: React.FC<VenueDetailsViewProps> = ({ venueId, onBack, onBook }) => {
    // Use the ID to find venue, or default to the first one for "dummy" view
    const venue = MOCK_VENUES.find(v => v.id === venueId) || MOCK_VENUES[0];

    return (
        <div className="animate-fade-in space-y-3 pb-8">
            {/* Navigation */}
            <button
                onClick={onBack}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium text-xs"
            >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Back to Venues
            </button>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Content Area (Text) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{venue.name}</h1>
                            <div className="flex items-center text-slate-500 font-medium text-xs">
                                <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-slate-400" />
                                {venue.location}
                            </div>
                        </div>

                        {/* Description */}
                        <section>
                            <h3 className="text-base font-bold text-slate-900 mb-2">About this Venue</h3>
                            <p className="text-slate-600 leading-relaxed mb-2 text-sm">
                                Experience the perfect blend of functionality and elegance at {venue.name}.
                                Whether you are organizing a corporate seminar, a casual meet-up, or a grand celebration,
                                our versatile space adapts to your unique needs. Equipped with modern amenities and designed
                                with attention to detail, this venue ensures a seamless experience for you and your guests.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Located in the heart of {venue.location.split(',')[0]}, it offers easy accessibility
                                and ample parking. The dedicated on-site team is committed to providing exceptional service
                                to make your event truly memorable.
                            </p>
                        </section>

                        {/* Amenities */}
                        <section className="pt-4 border-t border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 mb-3">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                {venue.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center text-slate-600 font-medium text-xs">
                                        <div className={`p-1 rounded-md ${THEME.bgLight} mr-2`}>
                                            <Check className={`h-3 w-3 ${THEME.text}`} />
                                        </div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                                <div className="flex items-center text-slate-600 font-medium text-xs">
                                    <div className="p-1 rounded-md bg-slate-100 mr-2">
                                        <Wifi className="h-3 w-3 text-slate-500" />
                                    </div>
                                    <span>Free Wi-Fi</span>
                                </div>
                                <div className="flex items-center text-slate-600 font-medium text-xs">
                                    <div className="p-1 rounded-md bg-slate-100 mr-2">
                                        <Car className="h-3 w-3 text-slate-500" />
                                    </div>
                                    <span>Free Parking</span>
                                </div>
                                <div className="flex items-center text-slate-600 font-medium text-xs">
                                    <div className="p-1 rounded-md bg-slate-100 mr-2">
                                        <Shield className="h-3 w-3 text-slate-500" />
                                    </div>
                                    <span>24/7 Security</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Booking Card Side */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <div className="flex items-end gap-2 mb-6 pb-6 border-b border-slate-100">
                            <span className={`text-4xl font-bold ${THEME.text}`}>₹{venue.hourlyRate}</span>
                            <span className="text-slate-500 font-medium mb-1.5">/ hour</span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-500 text-sm">Duration</span>
                                    <span className="font-semibold text-slate-900">4 Hours</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Total</span>
                                    <span className="font-bold text-slate-900">₹{venue.hourlyRate * 4}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm text-slate-600 font-medium">
                                <div className="flex-1 flex items-center justify-center py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <Users className="h-4 w-4 mr-2 text-slate-400" />
                                    {venue.capacity} Guests
                                </div>
                                <div className="flex-1 flex items-center justify-center py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                                    Available
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onBook}
                            className={`w-full py-4 rounded-xl ${THEME.bg} text-white font-bold text-lg shadow-lg shadow-[${PRIMARY_COLOR}]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all`}
                        >
                            Book Now
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">No payment required today</p>

                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between text-sm text-slate-600">
                                <span className="flex items-center"><Heart className="h-4 w-4 mr-2" />Save to favorites</span>
                                <Share2 className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailsView;
