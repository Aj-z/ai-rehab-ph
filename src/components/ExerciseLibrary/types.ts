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