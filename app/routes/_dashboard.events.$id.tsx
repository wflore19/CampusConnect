import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { Calendar, MapPin } from 'react-feather';
import { db } from '../../db/src/shared/db';

type Event = {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl: string;
    organizerId: string;
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
            'events.name',
            'events.date',
            'events.startTime',
            'events.endTime',
            'events.location',
            'events.imageUrl',
            'events.organizerId',
        ])
        .where('events.id', '=', parseInt(id))
        .executeTakeFirst();

    if (!event) {
        throw new Error('Event not found');
    }

    return { event };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: `${data?.event.name} - Campus Connect` },
        {
            name: 'description',
            content: `View details for ${data?.event.name}`,
        },
    ];
};

export default function EventPage() {
    const { event } = useLoaderData<LoaderData>();

    return (
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">{event.name}</Text>
            <Divider />

            <div className="mt-4 space-y-4">
                <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="mb-4 h-64 w-full rounded-lg object-cover"
                />

                <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <Text>
                        {event.date} at {event.startTime} - {event.endTime}
                    </Text>
                </div>

                <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <Text>{event.location}</Text>
                </div>

                <div>
                    <Text className="font-semibold">Organized by</Text>
                    <Text>{event.organizerId}</Text>
                </div>
            </div>
        </div>
    );
}
