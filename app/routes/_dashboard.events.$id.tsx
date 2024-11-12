import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { Calendar, MapPin, Users } from "react-feather";
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

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response("Event ID is required", { status: 400 });
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
    throw new Response("Event not found", { status: 404 });
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
      friends_going: friendsGoing
    }
  };
};


export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.event.title} - Campus Connect` },
    { name: "description", content: `View details for ${data?.event.title}` },
  ];
};

export default function EventPage() {
  const { event } = useLoaderData<LoaderData>();

  return (
    <div className="py-6 px-2">
      <Text className="text-3xl font-bold mb-4">{event.title}</Text>
      <Divider />
      
      <div className="space-y-4 mt-4">
        <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-4" />
        
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          <Text>{event.date} at {event.time}</Text>
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
          <div className="flex items-center mb-2">
            <Users size={16} className="mr-2" />
            <Text className="font-semibold">Friends Going ({event.friends_going.length})</Text>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {event.friends_going.map(friend => (
              <li key={friend.id}>
                <Link to={`/friends/${friend.id}`} className="text-blue-600 hover:underline">
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
