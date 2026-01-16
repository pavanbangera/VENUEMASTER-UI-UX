import { Venue, Booking, MonthlyStat } from './types';
import { LayoutDashboard, Trees, Warehouse, Waves, School, Building2, FileQuestion, CalendarDays, Calendar } from 'lucide-react';

export const PRIMARY_COLOR = '#ee2a24';

export const THEME = {
  primary: PRIMARY_COLOR,
  text: `text-[${PRIMARY_COLOR}]`,
  bg: `bg-[${PRIMARY_COLOR}]`,
  bgLight: `bg-[${PRIMARY_COLOR}]/10`,
  border: `border-[${PRIMARY_COLOR}]`,
  borderLight: `border-[${PRIMARY_COLOR}]/20`,
  hoverText: `hover:text-[${PRIMARY_COLOR}]`,
  hoverBg: `hover:bg-[${PRIMARY_COLOR}]`,
  hoverBgLight: `hover:bg-[${PRIMARY_COLOR}]/10`,
  selection: `selection:bg-[${PRIMARY_COLOR}] selection:text-white`,
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'my-bookings', label: 'My Bookings', icon: CalendarDays },
  { id: 'indoor', label: 'Indoor Grounds', icon: Warehouse },
  { id: 'outdoor', label: 'Outdoor Grounds', icon: Trees },
  { id: 'hall', label: 'Banquet Halls', icon: Building2 },
  { id: 'pool', label: 'Swimming Pools', icon: Waves },
  { id: 'classroom', label: 'Classrooms', icon: School },
  { id: 'enquiry', label: 'Enquiry / Help', icon: FileQuestion },
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Grand Central Hall',
    type: 'hall',
    capacity: 500,
    hourlyRate: 250,
    status: 'available',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    location: 'Main Building, Floor 1',
    description: 'A spacious hall perfect for weddings and conferences with modern lighting.',
    amenities: ['Stage', 'Sound System', 'Projector', 'AC'],
  },
  {
    id: 'v2',
    name: 'City Sports Arena',
    type: 'indoor',
    capacity: 100,
    hourlyRate: 80,
    status: 'occupied',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    location: 'Sports Complex',
    description: 'Indoor multi-purpose court suitable for basketball and badminton.',
    amenities: ['Changing Rooms', 'Scoreboard', 'Bleachers'],
  },
  {
    id: 'v3',
    name: 'Sunset Soccer Field',
    type: 'outdoor',
    capacity: 200,
    hourlyRate: 120,
    status: 'maintenance',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    location: 'North Campus',
    description: 'Regulation size soccer field with natural grass.',
    amenities: ['Floodlights', 'Dugouts'],
  },
  {
    id: 'v4',
    name: 'Olympic Blue Pool',
    type: 'pool',
    capacity: 50,
    hourlyRate: 150,
    status: 'available',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    location: 'Aquatic Center',
    description: '50m Olympic standard pool with temperature control.',
    amenities: ['Lifeguard', 'Lane Ropes', 'Showers'],
  },
  {
    id: 'v5',
    name: 'Lecture Hall 101',
    type: 'classroom',
    capacity: 60,
    hourlyRate: 40,
    status: 'available',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    location: 'Academic Block A',
    description: 'Modern classroom with tiered seating and smart board.',
    amenities: ['WiFi', 'Smart Board', 'Audio System'],
  },
  {
    id: 'v6',
    name: 'Garden Pavilion',
    type: 'outdoor',
    capacity: 150,
    hourlyRate: 100,
    status: 'available',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    location: 'Botanical Gardens',
    description: 'Open air pavilion surrounded by lush greenery.',
    amenities: ['Gazebo', 'Power Outlets'],
  }
];

// Helper to generate dates relative to today
const getRelativeDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Updated mock bookings with dynamic dates relative to current date
// 'Pavan' is the logged-in user. Others are competitors/other clients.
export const MOCK_BOOKINGS: Booking[] = [
  // Past Bookings
  { id: 'b1', venueId: 'v1', customerName: 'Pavan', date: getRelativeDate(-10), durationHours: 4, status: 'confirmed', totalPrice: 1000 },
  { id: 'b2', venueId: 'v2', customerName: 'TechStart Inc', date: getRelativeDate(-5), durationHours: 2, status: 'confirmed', totalPrice: 160 },

  // Current/Upcoming Bookings
  { id: 'b3', venueId: 'v4', customerName: 'Pavan', date: getRelativeDate(0), durationHours: 3, status: 'pending', totalPrice: 450 },
  { id: 'b4', venueId: 'v3', customerName: 'Global Events', date: getRelativeDate(2), durationHours: 5, status: 'confirmed', totalPrice: 600 },
  { id: 'b5', venueId: 'v5', customerName: 'Pavan', date: getRelativeDate(4), durationHours: 2, status: 'confirmed', totalPrice: 80 },
  { id: 'b6', venueId: 'v6', customerName: 'Community Group', date: getRelativeDate(4), durationHours: 4, status: 'confirmed', totalPrice: 400 }, // Same day different venue
  { id: 'b7', venueId: 'v1', customerName: 'Pavan', date: getRelativeDate(12), durationHours: 6, status: 'confirmed', totalPrice: 1500 },
  { id: 'b8', venueId: 'v2', customerName: 'Sports Club X', date: getRelativeDate(15), durationHours: 3, status: 'confirmed', totalPrice: 240 },
  { id: 'b9', venueId: 'v3', customerName: 'Pavan', date: getRelativeDate(18), durationHours: 2, status: 'pending', totalPrice: 240 },
  { id: 'b10', venueId: 'v4', customerName: 'Swim Team A', date: getRelativeDate(20), durationHours: 4, status: 'confirmed', totalPrice: 600 },
  { id: 'b11', venueId: 'v1', customerName: 'Pavan', date: getRelativeDate(25), durationHours: 5, status: 'confirmed', totalPrice: 1250 },
];

export const REVENUE_DATA: MonthlyStat[] = [
  { name: 'Jan', revenue: 4000, bookings: 24 },
  { name: 'Feb', revenue: 3000, bookings: 18 },
  { name: 'Mar', revenue: 2000, bookings: 12 },
  { name: 'Apr', revenue: 2780, bookings: 20 },
  { name: 'May', revenue: 1890, bookings: 15 },
  { name: 'Jun', revenue: 2390, bookings: 19 },
  { name: 'Jul', revenue: 3490, bookings: 25 },
  { name: 'Aug', revenue: 4200, bookings: 30 },
  { name: 'Sep', revenue: 3800, bookings: 28 },
  { name: 'Oct', revenue: 5100, bookings: 35 },
  { name: 'Nov', revenue: 4500, bookings: 32 },
  { name: 'Dec', revenue: 6000, bookings: 40 },
];