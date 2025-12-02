import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Habit } from '@/types/habits';
import { useHabitStore } from '@/store/habitStore';

interface WeeklyChartProps {
  habit: Habit;
}

export const WeeklyChart = ({ habit }: WeeklyChartProps) => {
  const getWeeklyData = useHabitStore((state) => state.getWeeklyData);
  const data = getWeeklyData(habit.id);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = Math.round((value / habit.target) * 100);
      
      return (
        <div className="glass-strong rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-lg font-bold" style={{ color: `hsl(var(--${habit.color}))` }}>
            {value} {habit.unit}
          </p>
          <p className="text-xs text-muted-foreground">
            {percentage}% of target
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Weekly Progress</h3>
        <span className="text-sm text-muted-foreground">{habit.name}</span>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary) / 0.5)' }} />
            <Bar 
              dataKey="value" 
              fill={`hsl(var(--${habit.color}))`}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Target: {habit.target} {habit.unit}/day</span>
        <span className="text-foreground font-medium">
          Avg: {Math.round(data.reduce((sum, d) => sum + d.value, 0) / 7)} {habit.unit}
        </span>
      </div>
    </div>
  );
};
