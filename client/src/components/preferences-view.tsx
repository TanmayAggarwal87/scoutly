import { Mail, MessageCircle, Clock } from "lucide-react";
import { Header } from "./header";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export function PreferencesView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: { 
  isDarkMode: boolean; 
  onToggleDarkMode: () => void; 
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header 
        title="Preferences" 
        subtitle="Manage your notification settings and preferences"
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-8">
            {/* Notifications */}
            <div>
              <h3 className="mb-4">Notifications</h3>
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <Mail className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="email-notifications" className="cursor-pointer">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receive job alerts via email when new opportunities match your criteria
                        </p>
                      </div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <MessageCircle className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp-notifications" className="cursor-pointer">
                          WhatsApp Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get instant alerts on WhatsApp for urgent job postings
                        </p>
                      </div>
                    </div>
                    <Switch id="whatsapp-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </div>

            {/* Scraping Frequency */}
            <div>
              <h3 className="mb-4">Monitoring Frequency</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Clock className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4>Check Interval</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Currently checking for new jobs every <span className="text-foreground">2 hours</span>
                    </p>
                    <div className="mt-4 bg-muted/50 border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        This setting is managed by your subscription tier and cannot be changed manually.
                        Upgrade to Premium for more frequent checks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div>
              <h3 className="mb-4">Account</h3>
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Email Address</Label>
                      <p className="mt-1">user@example.com</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone Number</Label>
                      <p className="mt-1">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Account Type</Label>
                      <p className="mt-1">Free Plan</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Member Since</Label>
                      <p className="mt-1">January 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h4 className="mb-2">Privacy & Data</h4>
              <p className="text-sm text-muted-foreground">
                We respect your privacy. Your data is encrypted and never shared with third parties.
                You can export or delete your data at any time from your account settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}