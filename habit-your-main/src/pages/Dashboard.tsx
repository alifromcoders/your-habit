import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { QuickAddCard } from '@/components/dashboard/QuickAddCard';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { CircularProgress } from '@/components/charts/CircularProgress';
import { useHabitStore } from '@/store/habitStore';
import { Flame, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const habits = useHabitStore((state) => state.habits);
  const getTodayEntries = useHabitStore((state) => state.getTodayEntries);
  const addEntry = useHabitStore((state) => state.addEntry);
  
  const todayEntries = getTodayEntries();
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate overall progress
  const todayCompleted = todayEntries.filter(
    ({ habit, entry }) => entry && entry.value >= habit.target
  ).length;
  const overallProgress = habits.length > 0 
    ? Math.round((todayCompleted / habits.length) * 100) 
    : 0;

  // Get top streaks
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3);

  const handleAddEntry = (habitId: string, value: number) => {
    addEntry(habitId, { habitId, date: today, value });
  };

  return (
    <AppLayout>
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back! Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />
      
      <div className="px-8 pb-8 space-y-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Today's Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Habits */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Today's Habits</h2>
                    <p className="text-sm text-muted-foreground">
                      {todayCompleted} of {habits.length} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold gradient-text">{overallProgress}%</span>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {todayEntries.map(({ habit, entry }) => (
                  <QuickAddCard
                    key={habit.id}
                    habit={habit}
                    todayValue={entry?.value || null}
                    onAddEntry={(value) => handleAddEntry(habit.id, value)}
                  />
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {habits[0] && <WeeklyChart habit={habits[0]} />}
              <CategoryPieChart />
            </div>
          </div>

          {/* Right Column - Streaks & Progress */}
          <div className="space-y-6">
            {/* Overall Progress Circle */}
            <div className="glass rounded-2xl p-6 flex flex-col items-center">
              <h3 className="font-semibold text-foreground mb-4 self-start">Today's Progress</h3>
              <CircularProgress
                value={todayCompleted}
                max={habits.length}
                size={160}
                strokeWidth={14}
                color="primary"
                label={`${todayCompleted}/${habits.length}`}
                sublabel="habits completed"
                showPercentage={false}
              />
              <div className="mt-4 text-center">
                <p className="text-3xl font-bold gradient-text">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">daily progress</p>
              </div>
            </div>

            {/* Active Streaks */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-exercise" />
                <h3 className="font-semibold text-foreground">Active Streaks</h3>
              </div>
              
              <div className="space-y-4">
                {topStreaks.map((habit, index) => (
                  <div 
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{habit.name}</p>
                        <p className="text-xs text-muted-foreground">{habit.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" style={{ color: `hsl(var(--${habit.color}))` }} />
                      <span className="font-bold text-foreground">{habit.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-steps" />
                <h3 className="font-semibold text-foreground">This Week</h3>
              </div>
              
              <div className="space-y-3">
                {habits.slice(0, 4).map((habit) => {
                  const weekEntries = habit.entries.filter(e => {
                    const entryDate = new Date(e.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate >= weekAgo;
                  });
                  const weekTotal = weekEntries.reduce((sum, e) => sum + e.value, 0);
                  
                  return (
                    <div key={habit.id} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{habit.name}</span>
                      <span className="font-medium text-foreground">
                        {Math.round(weekTotal)} {habit.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
