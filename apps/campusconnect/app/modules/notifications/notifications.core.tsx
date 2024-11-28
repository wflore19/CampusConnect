import { db } from 'db/src';

export async function createNotification(
    userId: number,
    notification: { type: string; message: string }
) {
    // Store in PostgreSQL
    const dbNotification = await db
        .insertInto('notifications')
        .values({
            userId,
            type: notification.type,
            message: notification.message,
        })
        .returningAll()
        .executeTakeFirst();

    if (!dbNotification) {
        throw new Error('Failed to create notification');
    }

    return dbNotification;
}

export async function getNotifications(userId: number) {
    const notifications = await db
        .selectFrom('notifications')
        .selectAll()
        .where('userId', '=', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .execute();

    return notifications;
}

export async function markNotificationAsRead(
    notificationId: number,
    userId: number
) {
    const notification = await db
        .updateTable('notifications')
        .set({ read: true })
        .where('id', '=', notificationId)
        .where('userId', '=', userId)
        .returningAll()
        .executeTakeFirst();

    if (!notification) {
        throw new Error('Notification not found');
    }

    return notification;
}

export async function clearNotifications(userId: number) {
    await db.deleteFrom('notifications').where('userId', '=', userId).execute();
}
