import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
}

export const CircularProgress = ({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  color = 'primary',
  label,
  sublabel,
  showPercentage = true,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--secondary))"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`hsl(var(--${color}))`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--${color}) / 0.5))`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
          )}
          {label && !showPercentage && (
            <span className="text-2xl font-bold text-foreground">{value}</span>
          )}
        </div>
      </div>
      
      {(label || sublabel) && (
        <div className="mt-3 text-center">
          {label && <p className="font-medium text-foreground">{label}</p>}
          {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};
