import { Bell, User, Moon, Sun, LogOut, UserCircle, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface HeaderProps {
  title: string;
  subtitle?: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onMenuClick?: () => void;
}

const mockNotifications = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    time: '33 min ago',
  },
  {
    id: '2',
    title: 'Frontend Developer Intern',
    company: 'Meta',
    time: '1 hour ago',
  },
  {
    id: '3',
    title: 'Backend Engineering Intern',
    company: 'Stripe',
    time: '2 hours ago',
  },
  {
    id: '4',
    title: 'Data Science Intern',
    company: 'Netflix',
    time: '5 hours ago',
  },
];

export function Header({ title, subtitle, isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-3 md:px-8 py-2">
        <div className="flex items-center gap-2 ml-0 pl-0">
          {/* Hamburger menu - only visible on mobile */}
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="size-5" />
          </Button>
          
          <div>
            <h3>{title}</h3>
            {subtitle && (
              <p className="text-[13px] md:text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-border">
                <h4>Notifications</h4>
              </div>
              <div className="max-h-100 overflow-auto">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm">{notification.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{notification.company}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border text-center">
                <Button variant="ghost" size="sm" className="w-full text-sm">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="size-8 bg-accent rounded-full flex items-center justify-center">
                  <User className="size-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p>John Doe</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleDarkMode}>
                {isDarkMode ? (
                  <>
                    <Sun className="mr-2 size-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 size-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}