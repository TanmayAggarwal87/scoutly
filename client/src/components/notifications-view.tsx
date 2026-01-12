import { useState, useEffect } from "react";
import { Header } from "./header";
import { notifications as notificationsApi } from "../lib/api";
import { Bell, Check } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationsView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onLogout: () => void;
    onMenuClick: () => void;
}) {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const { data } = await notificationsApi.getAll();
            setNotifications(data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await notificationsApi.markRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header
                title="Notifications"
                subtitle="Recent alerts and updates"
                isDarkMode={isDarkMode}
                onToggleDarkMode={onToggleDarkMode}
                onLogout={onLogout}
                onMenuClick={onMenuClick}
            />

            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`bg-card border rounded-lg p-4 flex items-start gap-4 transition-colors ${!notif.read ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                                >
                                    <div className={`p-2 rounded-full ${!notif.read ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        <Bell className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-medium ${!notif.read ? 'text-primary' : ''}`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </p>

                                        {notif.data?.url && (
                                            <a
                                                href={notif.data.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-primary hover:underline mt-2 inline-block"
                                            >
                                                View Job
                                            </a>
                                        )}
                                    </div>
                                    {!notif.read && (
                                        <Button variant="ghost" size="icon" onClick={() => markAsRead(notif._id)}>
                                            <Check className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
