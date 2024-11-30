import React, { ReactNode } from 'react';
import { useSocket } from '~/utils/socket';
import { NotificationsResponse } from './notifications.types';

type NotificationsContextType = {
    notifications: NotificationsResponse[];
    setNotifications: React.Dispatch<
        React.SetStateAction<NotificationsResponse[]>
    >;
    addNotification: (notification: NotificationsResponse) => void;
    removeNotification: (id: string) => void;
};

const notificationsContext = React.createContext<
    NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
    const context = React.useContext(notificationsContext);
    if (!context) {
        throw new Error(
            'useNotifications must be used within a NotificationsProvider'
        );
    }
    return context;
};

interface PropsWithChildren {
    userId: string;
    children: ReactNode;
}

export function NotificationProvider({ userId, children }: PropsWithChildren) {
    const [notifications, setNotifications] = React.useState<
        NotificationsResponse[]
    >([]);
    const { socket } = useSocket();

    React.useEffect(() => {
        async function fetchNotifications() {
            const url = new URL(
                `http://localhost:5000/api/notifications/${userId}`
            );
            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const notifications: NotificationsResponse[] = await data.json();
            notifications.forEach((notification) => {
                addNotification(notification);
            });
        }
        fetchNotifications();

        socket.on('notification', (notification: NotificationsResponse) => {
            addNotification(notification);
        });
    }, []);

    const addNotification = (notification: NotificationsResponse) => {
        setNotifications((prev) => [...prev, notification]);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id.toString() !== id));
    };

    return (
        <notificationsContext.Provider
            value={{
                notifications,
                setNotifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
        </notificationsContext.Provider>
    );
}
