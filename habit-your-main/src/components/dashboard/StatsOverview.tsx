import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';

export const StatsOverview = () => {
  const habits = useHabitStore((state) => state.habits);
  
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = habits.filter(h => 
    h.entries.some(e => e.date === today && e.value >= h.target)
  ).length;
  
  const completionRate = habits.length > 0 
    ? Math.round((todayCompleted / habits.length) * 100) 
    : 0;

  const stats = [
    {
      label: 'Avg Streak',
      value: avgStreak,
      suffix: 'days',
      icon: TrendingUp,
      color: 'primary',
      gradient: 'from-primary to-custom',
    },
    {
      label: 'Best Streak',
      value: longestStreak,
      suffix: 'days',
      icon: Award,
      color: 'savings',
      gradient: 'from-savings to-exercise',
    },
    {
      label: "Today's Progress",
      value: completionRate,
      suffix: '%',
      icon: Target,
      color: 'steps',
      gradient: 'from-steps to-primary',
    },
    {
      label: 'Habits Tracked',
      value: habits.length,
      suffix: 'total',
      icon: Calendar,
      color: 'accent',
      gradient: 'from-accent to-meditation',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="glass rounded-2xl p-5 animate-slide-up hover:border-primary/30 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, hsl(var(--${stat.color}) / 0.3), hsl(var(--${stat.color}) / 0.1))` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: `hsl(var(--${stat.color}))` }} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.suffix}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
