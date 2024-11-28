import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '~/utils/socket';
import type {
    Notification,
    NotificationContextType,
} from './notifications.types';

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('notification', (notification: Notification) => {
            addNotification({
                ...notification,
                id: crypto.randomUUID(),
                timestamp: new Date(),
                read: false,
            });
        });

        return () => {
            socket.off('notification');
        };
    }, [socket]);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            'useNotifications must be used within a NotificationProvider'
        );
    }
    return context;
};
