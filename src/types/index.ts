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
  userName: string;
  userEmail: string;
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

////
export interface Profile {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  medical_record_number: string | null;
  created_at: string;
}

export interface Injury {
   id: string;
  injury_type: string;
  description: string;
  body_part: string; // 
  severity: number;
  status: 'active' | 'healing' | 'recovered';
  user_id: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  injury_id: string | null;
  pain_level: number;
  mood: number | null;
  notes: string | null;
  logged_at: string;
}

export interface ExerciseSession {
  id: string;
  user_id: string;
  exercise_type: string;
  session_date: string;
  count: number;
  duration_seconds: number;
  notes?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  title: string;
  appointment_date: string;
  appointment_type?: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  professional_name?: string;
  user_id: string;
}

export interface ExerciseSession {
  id: string;
  user_id: string;
  exercise_type: string;
  session_date: string;
  count: number;
  duration_seconds: number;
  notes?: string;
}

export interface Report {
  id: string;
  user_id: string;
  report_type: string;
  start_date: string;
  end_date: string;
  pdf_url: string | null;
  created_at: string;
}



export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'none' | 'resistance-band' | 'weights' | 'mat' | 'chair' | 'any';

export interface Exercise {
  id: number;
  name: string;
  bodyPart: string;
  difficulty: Difficulty;
  equipment: string;
  duration: string;
  reps: string;
  sets: number;
  image: string;
  instructions: string[];
  benefits: string[];
  safety: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: Date;
}

export interface ConsultationType {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

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