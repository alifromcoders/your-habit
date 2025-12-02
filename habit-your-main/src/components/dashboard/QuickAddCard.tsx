import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Habit } from '@/types/habits';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAddCardProps {
  habit: Habit;
  todayValue: number | null;
  onAddEntry: (value: number, note?: string) => void;
}

export const QuickAddCard = ({ habit, todayValue, onAddEntry }: QuickAddCardProps) => {
  const [value, setValue] = useState(todayValue?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = todayValue !== null && todayValue >= habit.target;
  const progress = todayValue !== null ? Math.min((todayValue / habit.target) * 100, 100) : 0;

  const handleSubmit = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onAddEntry(numValue);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={cn(
        "glass rounded-2xl p-4 transition-all duration-300 hover:border-primary/30",
        isCompleted && "border-steps/50 bg-steps/5"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `hsl(var(--${habit.color}) / 0.2)` }}
          >
            {isCompleted ? (
              <Check className="w-5 h-5 text-steps" />
            ) : (
              <div 
                className="w-5 h-5 rounded-full border-2"
                style={{ borderColor: `hsl(var(--${habit.color}))` }}
              />
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">{habit.name}</h4>
            <p className="text-xs text-muted-foreground">
              Target: {habit.target} {habit.unit}
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${habit.unit}`}
            className="flex-1 h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            autoFocus
          />
          <Button size="sm" onClick={handleSubmit}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">
              {todayValue !== null ? todayValue : '—'}
            </span>
            <span className="text-sm text-muted-foreground">
              / {habit.target} {habit.unit}
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: isCompleted 
                  ? 'hsl(var(--steps))' 
                  : `hsl(var(--${habit.color}))`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
