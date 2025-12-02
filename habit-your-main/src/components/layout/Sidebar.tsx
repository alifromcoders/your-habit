import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  FileText, 
  Settings, 
  Dumbbell,
  Footprints,
  GraduationCap,
  PiggyBank,
  Moon,
  Sparkles,
  Brain,
  Heart,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habits';

const categoryIcons: Record<HabitCategory, any> = {
  exercise: Dumbbell,
  steps: Footprints,
  skills: GraduationCap,
  savings: PiggyBank,
  sleep: Moon,
  prayer: Sparkles,
  meditation: Brain,
  stress: Heart,
  custom: Target,
};

const mainNav = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/habits', label: 'All Habits', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <Flame className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">HabitFlow</h1>
            <p className="text-xs text-muted-foreground">Track your growth</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className={cn(
          "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3",
          collapsed && "text-center"
        )}>
          {collapsed ? '•••' : 'Menu'}
        </p>
        
        {mainNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-sidebar-accent text-sidebar-primary" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}

        <div className="pt-6">
          <p className={cn(
            "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3",
            collapsed && "text-center"
          )}>
            {collapsed ? '•••' : 'Categories'}
          </p>
          
          {Object.entries(CATEGORY_CONFIG).slice(0, 6).map(([key, config]) => {
            const Icon = categoryIcons[key as HabitCategory];
            return (
              <NavLink
                key={key}
                to={`/category/${key}`}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  collapsed && "justify-center"
                )}
              >
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(--${config.color}) / 0.2)` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${config.color}))` }} />
                </div>
                {!collapsed && <span className="text-sm">{config.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
