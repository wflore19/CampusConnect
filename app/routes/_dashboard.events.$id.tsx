import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { Calendar, MapPin, Users } from 'react-feather';
import { db } from '../../db/src/shared/db';

type Friend = {
    id: string;
    name: string;
};

type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
    organization: string;
    friends_going: Friend[];
};

type LoaderData = {
    event: Event;
};

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Error('Event ID is required');
    }

    const event = await db
        .selectFrom('events')
        .select([
            'events.id',
            'events.title',
            'events.date',
            'events.time',
            'events.location',
            'events.imageUrl',
            'events.organization',
        ])
        .where('events.id', '=', id)
        .executeTakeFirst();

    if (!event) {
        throw new Error('Event not found');
    }

    // Fetch friends going in a separate query
    const friendsGoing = await db
        .selectFrom('users')
        .innerJoin('eventAttendees', 'users.id', 'eventAttendees.userId')
        .select(['users.id', 'users.name'])
        .where('eventAttendees.eventId', '=', id)
        .execute();

    return {
        event: {
            ...event,
            friends_going: friendsGoing,
        },
    };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: `${data?.event.title} - Campus Connect` },
        {
            name: 'description',
            content: `View details for ${data?.event.title}`,
        },
    ];
};

export default function EventPage() {
    const { event } = useLoaderData<LoaderData>();

    return (
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">{event.title}</Text>
            <Divider />

            <div className="mt-4 space-y-4">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="mb-4 h-64 w-full rounded-lg object-cover"
                />

                <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <Text>
                        {event.date} at {event.time}
                    </Text>
                </div>

                <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <Text>{event.location}</Text>
                </div>

                <div>
                    <Text className="font-semibold">Organized by</Text>
                    <Text>{event.organization}</Text>
                </div>

                <div>
                    <div className="mb-2 flex items-center">
                        <Users size={16} className="mr-2" />
                        <Text className="font-semibold">
                            Friends Going ({event.friends_going.length})
                        </Text>
                    </div>
                    <ul className="list-inside list-disc space-y-1">
                        {event.friends_going.map((friend) => (
                            <li key={friend.id}>
                                <Link
                                    to={`/friends/${friend.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {friend.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
