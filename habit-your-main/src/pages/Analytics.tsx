import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { CircularProgress } from '@/components/charts/CircularProgress';
import { useHabitStore } from '@/store/habitStore';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

const Analytics = () => {
  const habits = useHabitStore((state) => state.habits);

  // Calculate insights
  const getInsights = () => {
    const insights: { type: 'positive' | 'negative' | 'suggestion'; text: string }[] = [];
    
    // Best performing habit
    const bestHabit = [...habits].sort((a, b) => b.streak - a.streak)[0];
    if (bestHabit && bestHabit.streak > 0) {
      insights.push({
        type: 'positive',
        text: `Your "${bestHabit.name}" streak is on fire at ${bestHabit.streak} days! Keep it up!`
      });
    }

    // Habits needing attention
    const needsAttention = habits.filter(h => h.streak === 0);
    if (needsAttention.length > 0) {
      insights.push({
        type: 'negative',
        text: `${needsAttention.length} habit${needsAttention.length > 1 ? 's' : ''} need${needsAttention.length === 1 ? 's' : ''} attention. Consider adding entries today.`
      });
    }

    // Suggestions based on categories
    const sleepHabit = habits.find(h => h.category === 'sleep');
    if (sleepHabit) {
      const avgSleep = sleepHabit.entries.length > 0
        ? sleepHabit.entries.reduce((sum, e) => sum + e.value, 0) / sleepHabit.entries.length
        : 0;
      if (avgSleep < 7) {
        insights.push({
          type: 'suggestion',
          text: `Your average sleep is ${avgSleep.toFixed(1)} hours. Try to aim for 7-8 hours for optimal health.`
        });
      }
    }

    const stepsHabit = habits.find(h => h.category === 'steps');
    if (stepsHabit) {
      const avgSteps = stepsHabit.entries.length > 0
        ? stepsHabit.entries.reduce((sum, e) => sum + e.value, 0) / stepsHabit.entries.length
        : 0;
      if (avgSteps < 8000) {
        insights.push({
          type: 'suggestion',
          text: `Walking average is ${Math.round(avgSteps).toLocaleString()} steps. Increase to 10,000 for better cardiovascular health.`
        });
      }
    }

    return insights;
  };

  const insights = getInsights();

  // Calculate category completion rates
  const categoryStats = habits.reduce((acc, habit) => {
    const completedDays = habit.entries.filter(e => e.value >= habit.target).length;
    const rate = habit.entries.length > 0 ? (completedDays / habit.entries.length) * 100 : 0;
    
    if (!acc[habit.category]) {
      acc[habit.category] = { total: 0, count: 0 };
    }
    acc[habit.category].total += rate;
    acc[habit.category].count += 1;
    
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return (
    <AppLayout>
      <Header 
        title="Analytics" 
        subtitle="Deep insights into your habits"
      />
      
      <div className="px-8 pb-8 space-y-8">
        {/* AI Insights */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-savings" />
            <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-xl border",
                  insight.type === 'positive' && "bg-steps/10 border-steps/30",
                  insight.type === 'negative' && "bg-destructive/10 border-destructive/30",
                  insight.type === 'suggestion' && "bg-accent/10 border-accent/30"
                )}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'positive' && <TrendingUp className="w-5 h-5 text-steps shrink-0 mt-0.5" />}
                  {insight.type === 'negative' && <TrendingDown className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                  {insight.type === 'suggestion' && <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                  <p className="text-sm text-foreground">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Completion Rates */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const avgRate = stats.total / stats.count;
            return (
              <div key={category} className="glass rounded-2xl p-4 flex flex-col items-center">
                <CircularProgress
                  value={avgRate}
                  max={100}
                  size={80}
                  strokeWidth={8}
                  color={category}
                />
                <p className="mt-2 text-sm font-medium text-foreground capitalize">{category}</p>
                <p className="text-xs text-muted-foreground">{Math.round(avgRate)}% completion</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {habits.slice(0, 2).map((habit) => (
            <WeeklyChart key={habit.id} habit={habit} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {habits.slice(0, 2).map((habit) => (
            <TrendLineChart key={habit.id} habit={habit} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {habits[2] && <TrendLineChart habit={habits[2]} />}
          </div>
          <CategoryPieChart />
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
