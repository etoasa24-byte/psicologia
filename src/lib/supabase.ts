import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
};

export type PsychologyQuestion = {
  id: string;
  category: string;
  question: string;
  type: string;
  options: {
    min: number;
    max: number;
    labels: string[];
  };
  order_num: number;
  created_at: string;
};

export type Recommendation = {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  created_at: string;
};

export type PsychologyGame = {
  id: string;
  name: string;
  description: string;
  category: string;
  instructions: string;
  difficulty: string;
  created_at: string;
};

export type UserAnswer = {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  score: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  game_id: string;
  completed: boolean;
  score: number;
  completed_at: string | null;
  created_at: string;
};
