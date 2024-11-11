import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { Calendar, MapPin, Users } from "react-feather";

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
 
const sampleEvents: Event[] = [
{
   id: "1",
   title: "Sunday Service with Maryland Christian Fellowship",
   date: "Sunday, November 19",
   time: "11:00 AM",
   location: "Memorial Garden Chapel",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "MARYLAND CHRISTIAN FELLOWSHIP",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "2", name: "Mia Thompson" },
      { id: "3", name: "Jamal Ahmed" }
   ]
},
{
   id: "2",
   title: "Sign up for an Alternative Break experience!",
   date: "Thursday, September 12",
   time: "12:00 PM",
   location: "Online",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Leadership & Community Service-Learning",
   friends_going: []
},
{
   id: "3",
   title: "Maryland Bhangra Practices",
   date: "Sunday, November 19",
   time: "12:00 PM",
   location: "Adele Gladfelter Rehearsal Studio",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Maryland Bhangra",
   friends_going: [
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" }
   ]
},
{
   id: "4",
   title: "Worship Service",
   date: "Sunday, November 19",
   time: "11:00 AM",
   location: "Stamp Margaret Brent 2123",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Oasis",
   friends_going: [
      { id: "6", name: "Zoe Nguyen" }
   ]
},
{
   id: "5",
   title: "Pa'lante Latin Dance Company Performance Team Practice",
   date: "Sunday, November 19",
   time: "11:00 AM",
   location: "Terpzone Activity Room A",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Pa'lante Latin Dance Company",
   friends_going: [
      { id: "2", name: "Mia Thompson" },
      { id: "3", name: "Jamal Ahmed" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "6", name: "Zoe Nguyen" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "6",
   title: "Kairos Sunday Service",
   date: "Sunday, November 19",
   time: "11:00 AM",
   location: "Stamp Prince George's Room",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Kairos Christian Fellowship",
   friends_going: []
},
{
   id: "7",
   title: "Chess Club Weekly Meeting",
   date: "Monday, November 20",
   time: "6:00 PM",
   location: "Stamp Student Union Room 1234",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "UMD Chess Club",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "8",
   title: "Intro to Python Workshop",
   date: "Tuesday, November 21",
   time: "4:00 PM",
   location: "Computer Science Building Room 1115",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Computer Science Department",
   friends_going: [
      { id: "2", name: "Mia Thompson" },
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "9",
   title: "Terps Basketball Game",
   date: "Wednesday, November 22",
   time: "7:30 PM",
   location: "Xfinity Center",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Maryland Athletics",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "2", name: "Mia Thompson" },
      { id: "3", name: "Jamal Ahmed" },
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "6", name: "Zoe Nguyen" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "10",
   title: "Environmental Club Campus Cleanup",
   date: "Saturday, November 25",
   time: "10:00 AM",
   location: "McKeldin Mall",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "UMD Environmental Club",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "4", name: "Sophia Chen" },
      { id: "6", name: "Zoe Nguyen" }
   ]
},
{
   id: "11",
   title: "Career Fair: STEM Industries",
   date: "Monday, November 27",
   time: "1:00 PM",
   location: "Stamp Grand Ballroom",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "University Career Center",
   friends_going: [
      { id: "2", name: "Mia Thompson" },
      { id: "3", name: "Jamal Ahmed" },
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "12",
   title: "Mindfulness Meditation Session",
   date: "Tuesday, November 28",
   time: "5:30 PM",
   location: "Eppley Recreation Center",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "UMD Health Center",
   friends_going: [
      { id: "6", name: "Zoe Nguyen" }
   ]
},
{
   id: "13",
   title: "International Food Festival",
   date: "Friday, December 1",
   time: "6:00 PM",
   location: "Nyumburu Amphitheater",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "International Student Association",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "2", name: "Mia Thompson" },
      { id: "3", name: "Jamal Ahmed" },
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "6", name: "Zoe Nguyen" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "14",
   title: "Hackathon: Build for Social Good",
   date: "Saturday, December 2",
   time: "9:00 AM",
   location: "Iribe Center",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "Technica",
   friends_going: [
      { id: "2", name: "Mia Thompson" },
      { id: "4", name: "Sophia Chen" },
      { id: "5", name: "Ethan Goldstein" },
      { id: "7", name: "Lucas Fernandez" }
   ]
},
{
   id: "15",
   title: "A Cappella Showcase",
   date: "Sunday, December 3",
   time: "7:00 PM",
   location: "Clarice Smith Performing Arts Center",
   imageUrl: "https://random.imagecdn.app/500/150",
   organization: "UMD A Cappella Council",
   friends_going: [
      { id: "1", name: "Alex Rivera" },
      { id: "3", name: "Jamal Ahmed" },
      { id: "4", name: "Sophia Chen" },
      { id: "6", name: "Zoe Nguyen" },
      { id: "7", name: "Lucas Fernandez" }
   ]
}
];
 
 

type LoaderData = {
  event: Event;
};

export const loader: LoaderFunction = async ({ params }) => {
  const event = sampleEvents.find(e => e.id === params.id);
  
  if (!event) {
    throw new Response("Event not found", { status: 404 });
  }

  return { event };
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
