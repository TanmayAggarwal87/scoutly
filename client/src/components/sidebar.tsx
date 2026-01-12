import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Globe,
  KeyRound,
  Settings,
  Bell,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { user as userApi } from "../lib/api";

export function Sidebar({ currentView, onNavigate, isOpen, onClose }: {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    userApi.getMe().then(res => setUserData(res.data)).catch(console.error);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'sources', label: 'Sources', icon: Globe },
    { id: 'keywords', label: 'Keywords', icon: KeyRound },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const profileName = userData?.name || 'User';
  const profileEmail = userData?.email || userData?.phone || 'Guest';
  const profileInitial = profileName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Scoutly</span>
            {/* Close button - only visible on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-accent rounded-md transition-colors ml-auto"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="size-10 bg-muted rounded-full flex items-center justify-center border border-border">
              <span className="text-lg font-medium text-muted-foreground">{profileInitial}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-medium truncate">{profileName}</h3>
              <p className="text-xs text-muted-foreground truncate">{profileEmail}</p>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
