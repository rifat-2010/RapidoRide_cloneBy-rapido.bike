
export type Role = 'SITE' | 'USER' | 'RIDER' | 'ADMIN';

export enum RideStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  REQUESTED = 'REQUESTED', // Broadcasted to captains
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Suggestion {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface VehicleInfo {
  vehicleType: 'BIKE' | 'AUTO' | 'CAR';
  vehicleNumber: string;
  drivingLicenseNumber: string;
}

// MongoDB User Schema Equivalent
export interface User {
  id: string;
  phoneNumber: string; 
  role: Role;
  fullName: string;
  profileImage?: string;
  vehicleInfo?: VehicleInfo; // Only if role === 'RIDER'
  createdAt: number;
}

// Extended Captain Profile (linked to User)
export interface CaptainProfile {
  userId: string;
  vehicleNumber: string;
  vehicleModel: string;
  isOnline: boolean;
  currentLocation: Location;
  totalEarnings: number;
  ridesCompleted: number;
  rating: number;
}

export interface Ride {
  id: string;
  riderId: string; // User who requested
  captainId?: string; // Captain who accepted
  status: RideStatus;
  pickup: Location;
  dropoff: Location;
  fare: number;
  distance: number;
  duration: number;
  otp: string;
  createdAt: number;
}

// Default Constants
export const INITIAL_LOCATION: Location = {
  lat: 23.1634, 
  lng: 89.2182,
  address: "Current Location"
};

export const MOCK_LOCATIONS: Suggestion[] = [
  { id: '1', name: 'Jessore Airport', address: 'Airport Rd, Jessore', lat: 23.1835, lng: 89.1620 },
  { id: '2', name: 'MM College', address: 'College Rd, Jessore', lat: 23.1691, lng: 89.2125 },
  { id: '3', name: 'Monihar Cinema Hall', address: 'Monihar, Jessore', lat: 23.1585, lng: 89.2230 },
  { id: '4', name: 'Daratana', address: 'Daratana Point, Jessore', lat: 23.1630, lng: 89.2180 },
];
