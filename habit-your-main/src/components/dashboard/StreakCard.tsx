import { Flame, Snowflake, TrendingUp } from 'lucide-react';
import { Habit } from '@/types/habits';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  habit: Habit;
  onFreeze?: () => void;
}

export const StreakCard = ({ habit, onFreeze }: StreakCardProps) => {
  const freezesRemaining = habit.freezesAvailable - habit.freezesUsed;
  const completionRate = habit.entries.length > 0 
    ? Math.round((habit.entries.filter(e => e.value >= habit.target).length / habit.entries.length) * 100)
    : 0;

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            `bg-${habit.color}/20`
          )} style={{ backgroundColor: `hsl(var(--${habit.color}) / 0.2)` }}>
            <Flame className="w-6 h-6 animate-streak-fire" style={{ color: `hsl(var(--${habit.color}))` }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">{habit.category}</p>
          </div>
        </div>
        
        {freezesRemaining > 0 && (
          <button
            onClick={onFreeze}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sleep/20 text-sleep text-xs font-medium hover:bg-sleep/30 transition-colors"
          >
            <Snowflake className="w-3 h-3" />
            {freezesRemaining}
          </button>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold gradient-text">{habit.streak}</span>
            <span className="text-muted-foreground text-sm">days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Current streak</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-steps mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{habit.longestStreak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Best streak</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Completion rate</span>
          <span className="font-semibold text-foreground">{completionRate}%</span>
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${completionRate}%`,
              background: `linear-gradient(90deg, hsl(var(--${habit.color})), hsl(var(--primary)))`
            }}
          />
        </div>
      </div>
    </div>
  );
};
