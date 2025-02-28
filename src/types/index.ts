export interface TripPreferences {
  destination: string;
  duration: string;
  budget: string;
  companions: string;
}

export interface POI {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
}

export interface TravelDocument {
  type: 'passport' | 'visa' | 'creditCard';
  id: string;
  number: string;
  expiryDate: string;
  country?: string;
  embassy?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface Trip {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  companions: string;
  itinerary: {
    day: number;
    activities: {
      time: string;
      activity: string;
      location: string;
      cost: string;
    }[];
  }[];
  totalCost: string;
}