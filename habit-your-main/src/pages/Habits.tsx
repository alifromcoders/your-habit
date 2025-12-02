import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { useHabitStore } from '@/store/habitStore';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habits';
import { cn } from '@/lib/utils';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Habits = () => {
  const habits = useHabitStore((state) => state.habits);
  const removeHabit = useHabitStore((state) => state.removeHabit);
  const useFreeze = useHabitStore((state) => state.useFreeze);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [selectedHabit, setSelectedHabit] = useState<string | null>(habits[0]?.id || null);

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const currentHabit = habits.find(h => h.id === selectedHabit);

  const handleFreeze = (habitId: string) => {
    const success = useFreeze(habitId);
    if (success) {
      toast.success('Streak freeze activated! Your streak is protected for today.');
    } else {
      toast.error('No freezes available this month.');
    }
  };

  const handleDelete = (habitId: string) => {
    removeHabit(habitId);
    if (selectedHabit === habitId) {
      setSelectedHabit(habits.find(h => h.id !== habitId)?.id || null);
    }
    toast.success('Habit deleted successfully.');
  };

  return (
    <AppLayout>
      <Header 
        title="All Habits" 
        subtitle={`${habits.length} habits tracked`}
      />
      
      <div className="px-8 pb-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            All ({habits.length})
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const count = habits.filter(h => h.category === key).length;
            if (count === 0) return null;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as HabitCategory)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                  selectedCategory === key
                    ? "text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
                style={selectedCategory === key ? { backgroundColor: `hsl(var(--${config.color}))` } : {}}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Habits List */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredHabits.map((habit) => (
                <div 
                  key={habit.id} 
                  className={cn(
                    "relative cursor-pointer transition-all",
                    selectedHabit === habit.id && "ring-2 ring-primary rounded-2xl"
                  )}
                  onClick={() => setSelectedHabit(habit.id)}
                >
                  <StreakCard 
                    habit={habit} 
                    onFreeze={() => handleFreeze(habit.id)}
                  />
                  
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-secondary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-destructive/20 text-destructive hover:bg-destructive/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(habit.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Habit Detail */}
          <div className="space-y-6">
            {currentHabit ? (
              <>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Habit Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">{currentHabit.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground capitalize">{currentHabit.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Target</span>
                      <span className="font-medium text-foreground">{currentHabit.target} {currentHabit.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-medium text-foreground">{currentHabit.streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Streak</span>
                      <span className="font-medium text-foreground">{currentHabit.longestStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Entries</span>
                      <span className="font-medium text-foreground">{currentHabit.entries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freezes Remaining</span>
                      <span className="font-medium text-foreground">
                        {currentHabit.freezesAvailable - currentHabit.freezesUsed}/{currentHabit.freezesAvailable}
                      </span>
                    </div>
                  </div>
                </div>

                <TrendLineChart habit={currentHabit} />
              </>
            ) : (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground">
                Select a habit to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Habits;
