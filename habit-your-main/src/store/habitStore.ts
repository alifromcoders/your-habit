import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit, HabitEntry, HabitCategory, CATEGORY_CONFIG } from '@/types/habits';

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'entries' | 'createdAt' | 'streak' | 'longestStreak' | 'freezesUsed'>) => void;
  removeHabit: (id: string) => void;
  addEntry: (habitId: string, entry: Omit<HabitEntry, 'id' | 'createdAt'>) => void;
  removeEntry: (habitId: string, entryId: string) => void;
  updateEntry: (habitId: string, entryId: string, updates: Partial<HabitEntry>) => void;
  useFreeze: (habitId: string) => boolean;
  getHabitsByCategory: (category: HabitCategory) => Habit[];
  getTodayEntries: () => { habit: Habit; entry: HabitEntry | null }[];
  getWeeklyData: (habitId: string) => { date: string; value: number }[];
  getMonthlyData: (habitId: string) => { date: string; value: number }[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const calculateStreak = (entries: HabitEntry[], target: number): number => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const entry = sortedEntries.find(e => e.date === dateStr);
    if (entry && entry.value >= target) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
};

// Default habits to start with
const defaultHabits: Habit[] = [
  {
    id: generateId(),
    name: 'Daily Exercise',
    category: 'exercise',
    icon: 'Dumbbell',
    unit: 'minutes',
    target: 30,
    color: 'exercise',
    streak: 5,
    longestStreak: 12,
    freezesUsed: 0,
    freezesAvailable: 3,
    entries: [
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], value: 45, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], value: 30, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], value: 60, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], value: 35, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], value: 40, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Walking',
    category: 'steps',
    icon: 'Footprints',
    unit: 'steps',
    target: 10000,
    color: 'steps',
    streak: 7,
    longestStreak: 21,
    freezesUsed: 1,
    freezesAvailable: 3,
    entries: [
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], value: 12500, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], value: 8900, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], value: 11200, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], value: 10500, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], value: 9800, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], value: 13200, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0], value: 10100, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Sleep Tracking',
    category: 'sleep',
    icon: 'Moon',
    unit: 'hours',
    target: 8,
    color: 'sleep',
    streak: 3,
    longestStreak: 14,
    freezesUsed: 0,
    freezesAvailable: 3,
    entries: [
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], value: 7.5, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], value: 8, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], value: 6.5, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Meditation',
    category: 'meditation',
    icon: 'Brain',
    unit: 'minutes',
    target: 15,
    color: 'meditation',
    streak: 10,
    longestStreak: 30,
    freezesUsed: 0,
    freezesAvailable: 3,
    entries: [
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], value: 20, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], value: 15, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], value: 25, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Savings Goal',
    category: 'savings',
    icon: 'PiggyBank',
    unit: '$',
    target: 50,
    color: 'savings',
    streak: 2,
    longestStreak: 8,
    freezesUsed: 0,
    freezesAvailable: 3,
    entries: [
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], value: 75, createdAt: new Date().toISOString() },
      { id: generateId(), habitId: '', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], value: 50, createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: defaultHabits,
      
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: generateId(),
          entries: [],
          createdAt: new Date().toISOString(),
          streak: 0,
          longestStreak: 0,
          freezesUsed: 0,
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },
      
      removeHabit: (id) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
      },
      
      addEntry: (habitId, entryData) => {
        const newEntry: HabitEntry = {
          ...entryData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;
            
            const updatedEntries = [...habit.entries, newEntry];
            const newStreak = calculateStreak(updatedEntries, habit.target);
            
            return {
              ...habit,
              entries: updatedEntries,
              streak: newStreak,
              longestStreak: Math.max(habit.longestStreak, newStreak),
            };
          }),
        }));
      },
      
      removeEntry: (habitId, entryId) => {
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;
            
            const updatedEntries = habit.entries.filter((e) => e.id !== entryId);
            const newStreak = calculateStreak(updatedEntries, habit.target);
            
            return {
              ...habit,
              entries: updatedEntries,
              streak: newStreak,
            };
          }),
        }));
      },
      
      updateEntry: (habitId, entryId, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;
            
            const updatedEntries = habit.entries.map((entry) =>
              entry.id === entryId ? { ...entry, ...updates } : entry
            );
            const newStreak = calculateStreak(updatedEntries, habit.target);
            
            return {
              ...habit,
              entries: updatedEntries,
              streak: newStreak,
              longestStreak: Math.max(habit.longestStreak, newStreak),
            };
          }),
        }));
      },
      
      useFreeze: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit || habit.freezesUsed >= habit.freezesAvailable) return false;
        
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, freezesUsed: h.freezesUsed + 1 } : h
          ),
        }));
        return true;
      },
      
      getHabitsByCategory: (category) => {
        return get().habits.filter((h) => h.category === category);
      },
      
      getTodayEntries: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().habits.map((habit) => ({
          habit,
          entry: habit.entries.find((e) => e.date === today) || null,
        }));
      },
      
      getWeeklyData: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return [];
        
        const data: { date: string; value: number }[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const entry = habit.entries.find((e) => e.date === dateStr);
          
          data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: entry?.value || 0,
          });
        }
        
        return data;
      },
      
      getMonthlyData: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return [];
        
        const data: { date: string; value: number }[] = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const entry = habit.entries.find((e) => e.date === dateStr);
          
          data.push({
            date: date.getDate().toString(),
            value: entry?.value || 0,
          });
        }
        
        return data;
      },
    }),
    {
      name: 'habitflow-storage',
    }
  )
);
