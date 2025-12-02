import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/store/habitStore';
import { CATEGORY_CONFIG } from '@/types/habits';
import { FileText, Download, Mail, Calendar, TrendingUp, Target, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { CircularProgress } from '@/components/charts/CircularProgress';

const Reports = () => {
  const habits = useHabitStore((state) => state.habits);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'custom'>('week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Calculate report data
  const getReportData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (dateRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'custom':
        startDate = customStart ? new Date(customStart) : new Date(now.setDate(now.getDate() - 7));
        endDate = customEnd ? new Date(customEnd) : new Date();
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
    }

    return habits.map(habit => {
      const periodEntries = habit.entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= startDate && entryDate <= endDate;
      });

      const totalValue = periodEntries.reduce((sum, e) => sum + e.value, 0);
      const avgValue = periodEntries.length > 0 ? totalValue / periodEntries.length : 0;
      const completedDays = periodEntries.filter(e => e.value >= habit.target).length;
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      return {
        habit,
        totalValue,
        avgValue,
        completedDays,
        totalDays,
        completionRate,
      };
    });
  };

  const reportData = getReportData();
  const overallCompletion = reportData.length > 0
    ? reportData.reduce((sum, d) => sum + d.completionRate, 0) / reportData.length
    : 0;

  const handleDownloadPDF = () => {
    toast.success('PDF report generated! Download will start shortly.');
    // In a real app, this would generate and download a PDF
  };

  const handleEmailReport = () => {
    toast.success('Weekly report sent to your email!');
    // In a real app, this would send an email
  };

  return (
    <AppLayout>
      <Header 
        title="Reports" 
        subtitle="Generate and download your progress reports"
      />
      
      <div className="px-8 pb-8 space-y-8">
        {/* Report Controls */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl overflow-hidden border border-border">
                {(['week', 'month', 'custom'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {range === 'week' ? 'Weekly' : range === 'month' ? 'Monthly' : 'Custom'}
                  </button>
                ))}
              </div>

              {dateRange === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-secondary border border-border text-foreground text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-secondary border border-border text-foreground text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleEmailReport} className="gap-2">
                <Mail className="w-4 h-4" />
                Email Report
              </Button>
              <Button onClick={handleDownloadPDF} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Overall Progress</span>
            </div>
            <p className="text-3xl font-bold gradient-text">{Math.round(overallCompletion)}%</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-steps/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-steps" />
              </div>
              <span className="text-muted-foreground text-sm">Habits Tracked</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{habits.length}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-exercise/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-exercise" />
              </div>
              <span className="text-muted-foreground text-sm">Total Entries</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {reportData.reduce((sum, d) => sum + d.habit.entries.length, 0)}
            </p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <span className="text-muted-foreground text-sm">Period</span>
            </div>
            <p className="text-xl font-bold text-foreground capitalize">{dateRange}</p>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Detailed Report</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Habit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Days Hit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reportData.map(({ habit, totalValue, avgValue, completedDays, totalDays, completionRate }) => (
                  <tr key={habit.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `hsl(var(--${habit.color}) / 0.2)` }}
                        >
                          <Flame className="w-4 h-4" style={{ color: `hsl(var(--${habit.color}))` }} />
                        </div>
                        <span className="font-medium text-foreground">{habit.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground capitalize">{habit.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <CircularProgress
                          value={completionRate}
                          max={100}
                          size={50}
                          strokeWidth={5}
                          color={habit.color as any}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-foreground">{Math.round(totalValue)} {habit.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-muted-foreground">{avgValue.toFixed(1)} {habit.unit}/day</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground">{completedDays}/{totalDays}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
