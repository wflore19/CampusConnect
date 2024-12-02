import { eq, desc, InferSelectModel } from 'drizzle-orm';
import { db } from '@campusconnect/db';
import { events } from '@campusconnect/db/schema';

/**
 * Get all events
 * @returns {Promise<Array>} - An array of events
 */
export async function getEvents() {
    const eventsData = await db
        .select({
            id: events.id,
            name: events.name,
            date: events.date,
            startTime: events.startTime,
            endTime: events.endTime,
            location: events.location,
            imageUrl: events.imageUrl,
            organizerId: events.organizerId,
            description: events.description,
        })
        .from(events)
        .orderBy(desc(events.date));

    if (!eventsData) throw new Error('Events not found');

    return eventsData;
}

/**
 * Get event by ID
 * @param id - The event ID
 * @returns {Promise<Object>} - The event object
 */
export async function getEventById(id: number) {
    const eventData = await db
        .select({
            id: events.id,
            name: events.name,
            date: events.date,
            startTime: events.startTime,
            endTime: events.endTime,
            location: events.location,
            imageUrl: events.imageUrl,
            organizerId: events.organizerId,
            description: events.description,
        })
        .from(events)
        .where(eq(events.id, id));

    if (!eventData) throw new Error('Event not found');

    return eventData[0];
}

export type Event = InferSelectModel<typeof events>;
