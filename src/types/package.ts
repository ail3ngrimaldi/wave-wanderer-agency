export type RoomType = 'standard' | 'deluxe' | 'suite' | 'family';
export type AccommodationType = 'hotel' | 'cabin' | 'house';
export type MealPlan = 'none' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive';

export const ACCOMMODATION_TYPE_LABELS: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  cabin: 'Cabaña',
  house: 'Casa',
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: 'Estándar',
  deluxe: 'Deluxe',
  suite: 'Suite',
  family: 'Familiar',
};

export const MEAL_PLAN_LABELS: Record<MealPlan, string> = {
  none: 'Solo alojamiento',
  breakfast: 'Desayuno',
  half_board: 'Media Pensión',
  full_board: 'Pensión Completa',
  all_inclusive: 'All Inclusive',
};

export interface PackageFormData {
  // General
  title: string;
  description: string;
  imageUrl: string;
  destination: string;
  country: string;
  departureCity: string;
  nights: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  price: number;
  currency: string;
  priceNote: string;
  disclaimer: string;
  paymentLink: string;
  
  // Inclusions booleans
  includesFlight: boolean;
  includesHotel: boolean;
  includesTransfer: boolean;

  // Hotel Details
  hotelName: string;
  accommodationType: AccommodationType;
  roomType: RoomType;
  mealPlan: MealPlan;
  mediaUrls: string[]; // URLs de archivos ya subidos
  mediaFiles: File[];

  // Flight Details
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  outboundDepartureTime: string;
  outboundArrivalTime: string;
  returnDepartureTime: string;
  returnArrivalTime: string;
}

export const DEFAULT_FORM_DATA: PackageFormData = {
  title: '',
  description: '',
  imageUrl: '',
  destination: '',
  country: '',
  departureCity: '',
  nights: 7,
  startDate: undefined,
  endDate: undefined,
  price: 0,
  currency: 'USD',
  priceNote: 'TARIFA POR PERSONA, BASE DBL',
  disclaimer: '',
  paymentLink: '',
  includesFlight: true,
  includesHotel: true,
  includesTransfer: true,
  hotelName: '',
  accommodationType: 'hotel',
  roomType: 'standard',
  mealPlan: 'breakfast',
  mediaUrls: [],
  mediaFiles: [],
  airline: '',
  departureAirport: '',
  arrivalAirport: '',
  outboundDepartureTime: '',
  outboundArrivalTime: '',
  returnDepartureTime: '',
  returnArrivalTime: '',
};

// This matches what we send to Supabase context
export interface ExtendedPackage extends PackageFormData {
  id?: string;
  createdAt?: string;
  expiresAt?: string;
}
