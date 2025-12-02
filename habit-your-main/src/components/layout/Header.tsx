import { useState } from 'react';
import { Bell, Search, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddHabitModal } from '@/components/modals/AddHabitModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between py-6 px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search habits..."
              className="h-10 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Add Habit Button */}
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Habit
          </Button>

          {/* Notifications */}
          <Button variant="glass" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Profile */}
          <Button variant="glass" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <AddHabitModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </>
  );
};
