import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { Calendar, MapPin } from 'react-feather';

export const meta: MetaFunction = () => {
    return [
        { title: 'Events - Campus Connect' },
        { name: 'description', content: 'Browse and search for campus events' },
    ];
};

export async function loader() {
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
        ])
        .execute();

    return { events };
}

export default function Events() {
    const { events } = useLoaderData<typeof loader>();

    return (
        <div className="px-2 py-6">
            <h1 className="mb-6 text-3xl font-bold">Events</h1>

            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-start space-x-4 border-b pb-4"
                    >
                        <div className="w-1/4 min-w-[100px] max-w-[400px]">
                            <img
                                src={event.imageUrl!}
                                alt={event.name!}
                                className="h-auto w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <Link
                                to={`/events/${event.id}`}
                                className="hover:underline"
                            >
                                <h3 className="text-lg font-semibold">
                                    {event.name}
                                </h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                    {event.date?.toDateString()} at{' '}
                                    {event.startTime?.toDateString()} -{' '}
                                    {event.endTime?.toDateString()}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin size={14} className="mr-1" />
                                <span>{event.location}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                {event.organizerId}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
