import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/store/habitStore';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habits';
import { cn } from '@/lib/utils';

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddHabitModal = ({ open, onOpenChange }: AddHabitModalProps) => {
  const addHabit = useHabitStore((state) => state.addHabit);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const selectedConfig = CATEGORY_CONFIG[category];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !target) return;

    addHabit({
      name,
      category,
      icon: selectedConfig.icon,
      unit: unit || selectedConfig.defaultUnit,
      target: parseFloat(target),
      color: selectedConfig.color,
      freezesAvailable: 3,
    });

    // Reset form
    setName('');
    setCategory('custom');
    setTarget('');
    setUnit('');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-lg mx-4 animate-scale-in shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Add New Habit</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Run"
              className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCategory(key as HabitCategory);
                    setUnit(config.defaultUnit);
                  }}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200 text-left",
                    category === key
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/50 hover:border-primary/50"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: `hsl(var(--${config.color}) / 0.2)` }}
                  >
                    <span style={{ color: `hsl(var(--${config.color}))` }} className="text-lg">
                      {config.icon === 'Dumbbell' && '💪'}
                      {config.icon === 'Footprints' && '👟'}
                      {config.icon === 'GraduationCap' && '📚'}
                      {config.icon === 'PiggyBank' && '💰'}
                      {config.icon === 'Moon' && '🌙'}
                      {config.icon === 'Sparkles' && '✨'}
                      {config.icon === 'Brain' && '🧠'}
                      {config.icon === 'Heart' && '❤️'}
                      {config.icon === 'Target' && '🎯'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{config.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Daily Target
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., 30"
                className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Unit
              </label>
              <input
                type="text"
                value={unit || selectedConfig.defaultUnit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., minutes"
                className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Habit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
