import { db } from 'db/src';

/*
 * Get all events
 * @returns {Promise<Array>} - An array of events
 */
export async function getEvents() {
    const events = await db
        .selectFrom('events')
        .select([
            'id',
            'name',
            'date',
            'startTime',
            'endTime',
            'location',
            'imageUrl',
            'organizerId',
            'description',
        ])
        .execute();

    if (!events) {
        throw new Error('Events not found');
    }

    return events;
}

/*
 * Get event by ID
 * @param {number} id - The ID of the event
 * @returns {Promise<Object>} - The event object
 * @throws {Error} - If the event is not found
 */
export async function getEventById(id: number) {
    const event = await db
        .selectFrom('events')
        .select([
            'id',
            'name',
            'date',
            'startTime',
            'endTime',
            'location',
            'imageUrl',
            'organizerId',
            'description',
        ])
        .where('id', '=', id)
        .executeTakeFirst();

    if (!event) {
        throw new Error('Event not found');
    }

    return event;
}
