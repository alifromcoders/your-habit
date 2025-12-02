import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useHabitStore } from '@/store/habitStore';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habits';

export const CategoryPieChart = () => {
  const habits = useHabitStore((state) => state.habits);
  
  const categoryData = Object.entries(CATEGORY_CONFIG)
    .map(([key, config]) => {
      const categoryHabits = habits.filter(h => h.category === key);
      const totalEntries = categoryHabits.reduce((sum, h) => sum + h.entries.length, 0);
      
      return {
        name: config.label,
        value: totalEntries,
        color: key as HabitCategory,
      };
    })
    .filter(d => d.value > 0);

  const COLORS: Record<HabitCategory, string> = {
    exercise: 'hsl(var(--exercise))',
    steps: 'hsl(var(--steps))',
    skills: 'hsl(var(--skills))',
    savings: 'hsl(var(--savings))',
    sleep: 'hsl(var(--sleep))',
    prayer: 'hsl(var(--prayer))',
    meditation: 'hsl(var(--meditation))',
    stress: 'hsl(var(--stress))',
    custom: 'hsl(var(--custom))',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = categoryData.reduce((sum, d) => sum + d.value, 0);
      const percentage = Math.round((data.value / total) * 100);
      
      return (
        <div className="glass-strong rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: COLORS[data.color] }}>
            {data.value} entries
          </p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  if (categoryData.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Activity by Category</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.color]}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderCustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
