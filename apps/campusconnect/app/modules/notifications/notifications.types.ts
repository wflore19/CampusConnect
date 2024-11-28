export type Notification = {
    id?: string;
    type: 'friend_request' | 'event_invite' | 'system' | string;
    message: string;
    timestamp?: Date;
    read?: boolean;
};

export type NotificationContextType = {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    markAsRead: (notificationId: string) => void;
    clearNotifications: () => void;
};
