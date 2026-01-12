"use client"
import { useState, useEffect } from "react";
import { AuthScreen } from "../components/auth-screen";
import { Sidebar } from "../components/sidebar";
import { DashboardView } from "../components/dashboard-view";
import { SourcesView } from "../components/sources-view";
import { KeywordsView } from "../components/keywords-view";
import { NotificationsView } from "../components/notifications-view";
import { PreferencesView } from "../components/preferences-view";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="flex-1 overflow-hidden">
        {currentView === 'dashboard' && (
          <DashboardView
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onMenuClick={handleToggleSidebar}
          />
        )}
        {currentView === 'sources' && (
          <SourcesView
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onMenuClick={handleToggleSidebar}
          />
        )}
        {currentView === 'keywords' && (
          <KeywordsView
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onMenuClick={handleToggleSidebar}
          />
        )}
        {currentView === 'preferences' && (
          <PreferencesView
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onMenuClick={handleToggleSidebar}
          />
        )}
        {currentView === 'notifications' && (
          <NotificationsView
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onMenuClick={handleToggleSidebar}
          />
        )}
      </div>
    </div>
  );
}