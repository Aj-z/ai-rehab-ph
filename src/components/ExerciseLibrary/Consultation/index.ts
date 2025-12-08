export interface Professional {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  specializations: string[];
  bio: string;
  credentials: string[];
  availability: string[];
}

export interface ConsultationType {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface BookingData {
  professional: Professional;
  consultationType: ConsultationType;
  date: Date;
  time: string;
  price: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}