export type HabitCategory = 
  | 'exercise'
  | 'steps'
  | 'skills'
  | 'savings'
  | 'sleep'
  | 'prayer'
  | 'meditation'
  | 'stress'
  | 'custom';

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  value: number;
  note?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  unit: string;
  target: number;
  color: string;
  streak: number;
  longestStreak: number;
  freezesUsed: number;
  freezesAvailable: number;
  entries: HabitEntry[];
  createdAt: string;
}

export interface StreakFreeze {
  id: string;
  habitId: string;
  date: string;
  used: boolean;
}

export interface UserStats {
  totalDaysTracked: number;
  currentStreak: number;
  longestStreak: number;
  habitsCompleted: number;
  averageCompletion: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  habits: {
    habitId: string;
    name: string;
    category: HabitCategory;
    completionRate: number;
    totalValue: number;
    averageValue: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  overallScore: number;
  insights: string[];
}

export const CATEGORY_CONFIG: Record<HabitCategory, {
  label: string;
  icon: string;
  defaultUnit: string;
  color: string;
}> = {
  exercise: { label: 'Exercise', icon: 'Dumbbell', defaultUnit: 'minutes', color: 'exercise' },
  steps: { label: 'Walking Steps', icon: 'Footprints', defaultUnit: 'steps', color: 'steps' },
  skills: { label: 'Skills Learning', icon: 'GraduationCap', defaultUnit: 'hours', color: 'skills' },
  savings: { label: 'Savings', icon: 'PiggyBank', defaultUnit: '$', color: 'savings' },
  sleep: { label: 'Sleep', icon: 'Moon', defaultUnit: 'hours', color: 'sleep' },
  prayer: { label: 'Prayer (Namaz)', icon: 'Sparkles', defaultUnit: 'times', color: 'prayer' },
  meditation: { label: 'Meditation', icon: 'Brain', defaultUnit: 'minutes', color: 'meditation' },
  stress: { label: 'Stress Level', icon: 'Heart', defaultUnit: 'level', color: 'stress' },
  custom: { label: 'Custom Habit', icon: 'Target', defaultUnit: 'times', color: 'custom' },
};
