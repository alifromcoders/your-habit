import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Mail, 
  Smartphone,
  Moon,
  Sun,
  Lock,
  Fingerprint,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    reminders: true,
    motivation: false,
  });

  const [security, setSecurity] = useState({
    pinLock: false,
    biometric: false,
  });

  const handleExportData = () => {
    toast.success('Data exported successfully! Check your downloads folder.');
  };

  const handleImportData = () => {
    toast.success('Data imported successfully!');
  };

  const handleClearData = () => {
    toast.error('This will delete all your data. Please confirm in the modal.');
  };

  return (
    <AppLayout>
      <Header 
        title="Settings" 
        subtitle="Manage your app preferences"
      />
      
      <div className="px-8 pb-8 space-y-6 max-w-3xl">
        {/* Notifications */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Daily Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified to log your habits daily</p>
              </div>
              <Switch 
                checked={notifications.daily} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, daily: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly progress summary via email</p>
              </div>
              <Switch 
                checked={notifications.weekly} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weekly: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Last-Time Reminders</p>
                <p className="text-sm text-muted-foreground">Remind me before the day ends if I haven't logged</p>
              </div>
              <Switch 
                checked={notifications.reminders} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Morning Motivation</p>
                <p className="text-sm text-muted-foreground">Start your day with an inspiring quote</p>
              </div>
              <Switch 
                checked={notifications.motivation} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, motivation: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your data with additional security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">PIN Lock</p>
                  <p className="text-sm text-muted-foreground">Require PIN to open the app</p>
                </div>
              </div>
              <Switch 
                checked={security.pinLock} 
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, pinLock: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Biometric Lock</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or Face ID</p>
                </div>
              </div>
              <Switch 
                checked={security.biometric} 
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, biometric: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-steps/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-steps" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
              <p className="text-sm text-muted-foreground">Backup, export, or clear your data</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={handleExportData}>
              <Download className="w-5 h-5" />
              Export Data (CSV)
            </Button>

            <Button variant="outline" className="w-full justify-start gap-3" onClick={handleImportData}>
              <Upload className="w-5 h-5" />
              Import Data
            </Button>

            <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50" onClick={handleClearData}>
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Account */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-savings/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-savings" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Account</h2>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to sync your data across devices and enable cloud backup.
            </p>
            <Button className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Sign In / Create Account
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-muted-foreground text-sm pt-4">
          <p>HabitFlow v1.0.0</p>
          <p className="mt-1">Built with ❤️ for better habits</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
