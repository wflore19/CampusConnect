import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db/src";
import { useState } from "react";
import { Search, Calendar, MapPin, Users } from "react-feather";

export const meta: MetaFunction = () => {
  return [
    { title: "Events - Campus Connect" },
    { name: "description", content: "Browse and search for campus events" },
  ];
};

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
  friendsGoing: Friend[];
};

export const loader: LoaderFunction = async () => {
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
        .innerJoin('eventAttendees', 'users.id', 'eventAttendees.userId')
        .select(['users.id', 'users.name'])
        .where('eventAttendees.eventId', '=', event.id)
        .execute();

      return {
        ...event,
        friendsGoing
      };
    })
  );

  return { events: eventsWithFriends };
};

export default function Events() {
  const { events } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event: Event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-2">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Events"
            className="w-full p-2 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="space-y-4">
      {filteredEvents.map((event: Event) => (
  <div key={event.id} className="flex items-start space-x-4 border-b pb-4">
    <div className="w-1/4 min-w-[100px] max-w-[400px]">
      <img 
        src={event.imageUrl} 
        alt={event.title} 
        className="w-full h-auto rounded-lg object-cover"
      />
    </div>
    <div className="flex-grow">
      <Link to={`/events/${event.id}`} className="hover:underline">
        <h3 className="font-semibold text-lg">{event.title}</h3>
      </Link>
      <div className="text-sm text-gray-600 flex items-center">
        <Calendar size={14} className="mr-1" />
        <span>{event.date} at {event.time}</span>
      </div>
      <div className="text-sm text-gray-600 flex items-center">
        <MapPin size={14} className="mr-1" />
        <span>{event.location}</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">{event.organization}</div>
      {event.friendsGoing.length > 0 && (
        <div className="text-sm text-gray-600 mt-1 flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          <Users size={14} className="mr-1" />
          <span>{event.friendsGoing.length} friend{event.friendsGoing.length > 1 ? 's' : ''} going</span>
        </div>
      )}
    </div>
  </div>
))}

      </div>
    </div>
  );
}
