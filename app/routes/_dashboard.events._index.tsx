import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { useState } from 'react';
import { Search, Calendar, MapPin, Users } from 'react-feather';

export const meta: MetaFunction = () => {
    return [
        { title: 'Events - Campus Connect' },
        { name: 'description', content: 'Browse and search for campus events' },
    ];
};

interface Event {
    friendsGoing: { id: string; name: string }[];
    id: string;
    imageUrl: string | null;
    location: string;
    date: string;
    organization: string;
    time: string;
    title: string;
    attendeesCount: string | number | bigint;
}

export async function loader() {
    const events = await db
        .selectFrom('events')
        .leftJoin('eventAttendees', 'events.id', 'eventAttendees.eventId')
        .select([
            'events.id',
            'events.title',
            'events.date',
            'events.time',
            'events.location',
            'events.imageUrl',
            'events.organization',
        ])
        .select(db.fn.count('eventAttendees.userId').as('attendeesCount'))
        .groupBy('events.id')
        .execute();

    // Fetch friends going for each event
    const eventsWithFriends = await Promise.all(
        events.map(async (event) => {
            const friendsGoing = await db
                .selectFrom('users')
                .innerJoin(
                    'eventAttendees',
                    'users.id',
                    'eventAttendees.userId'
                )
                .select(['users.id', 'users.name'])
                .where('eventAttendees.eventId', '=', event.id)
                .execute();

            return {
                ...event,
                friendsGoing,
            };
        })
    );

    return { events: eventsWithFriends };
}

export default function Events() {
    const { events } = useLoaderData<typeof loader>();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter((event: Event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="px-2 py-6">
            <h1 className="mb-6 text-3xl font-bold">Events</h1>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Events"
                        className="w-full rounded-md border p-2 pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={20}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredEvents.map((event: Event) => (
                    <div
                        key={event.id}
                        className="flex items-start space-x-4 border-b pb-4"
                    >
                        <div className="w-1/4 min-w-[100px] max-w-[400px]">
                            <img
                                src={event.imageUrl!}
                                alt={event.title}
                                className="h-auto w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <Link
                                to={`/events/${event.id}`}
                                className="hover:underline"
                            >
                                <h3 className="text-lg font-semibold">
                                    {event.title}
                                </h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                    {event.date} at {event.time}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin size={14} className="mr-1" />
                                <span>{event.location}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                {event.organization}
                            </div>
                            {event.friendsGoing.length > 0 && (
                                <div className="mt-1 flex items-center text-sm text-gray-600">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-green-400"></span>
                                    <Users size={14} className="mr-1" />
                                    <span>
                                        {event.friendsGoing.length} friend
                                        {event.friendsGoing.length > 1
                                            ? 's'
                                            : ''}{' '}
                                        going
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
