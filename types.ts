export type VenueType = 'indoor' | 'outdoor' | 'hall' | 'pool' | 'classroom';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  capacity: number;
  hourlyRate: number;
  status: 'available' | 'maintenance' | 'occupied';
  imageUrl: string;
  location: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  venueId: string;
  customerName: string;
  date: string; // ISO date string
  durationHours: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
}

export interface MonthlyStat {
  name: string;
  revenue: number;
  bookings: number;
}

export interface DashboardStats {
  totalVenues: number;
  activeBookings: number;
  totalRevenue: number;
  maintenanceAlerts: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
