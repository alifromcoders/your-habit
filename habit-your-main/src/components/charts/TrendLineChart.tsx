import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Habit } from '@/types/habits';
import { useHabitStore } from '@/store/habitStore';

interface TrendLineChartProps {
  habit: Habit;
  showArea?: boolean;
}

export const TrendLineChart = ({ habit, showArea = true }: TrendLineChartProps) => {
  const getMonthlyData = useHabitStore((state) => state.getMonthlyData);
  const data = getMonthlyData(habit.id);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = Math.round((value / habit.target) * 100);
      
      return (
        <div className="glass-strong rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">Day {label}</p>
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

  const avgValue = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const maxValue = Math.max(...data.map(d => d.value));
  const trend = data.length > 7 
    ? data.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7 > 
      data.slice(0, 7).reduce((sum, d) => sum + d.value, 0) / 7
      ? 'up' : 'down'
    : 'stable';

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">30-Day Trend</h3>
          <p className="text-sm text-muted-foreground">{habit.name}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          trend === 'up' 
            ? 'bg-steps/20 text-steps' 
            : trend === 'down' 
            ? 'bg-destructive/20 text-destructive'
            : 'bg-secondary text-muted-foreground'
        }`}>
          {trend === 'up' ? '↑ Improving' : trend === 'down' ? '↓ Declining' : '→ Stable'}
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {showArea ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${habit.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(var(--${habit.color}))`} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={`hsl(var(--${habit.color}))`} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                interval={4}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--${habit.color}))`}
                strokeWidth={2}
                fill={`url(#gradient-${habit.id})`}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                interval={4}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--${habit.color}))`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: `hsl(var(--${habit.color}))` }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="font-semibold text-foreground">{avgValue} {habit.unit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Best Day</p>
          <p className="font-semibold text-foreground">{maxValue} {habit.unit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Target</p>
          <p className="font-semibold text-foreground">{habit.target} {habit.unit}</p>
        </div>
      </div>
    </div>
  );
};
