import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Search, Calendar, MapPin, Users } from "react-feather";

export const meta: MetaFunction = () => {
  return [
    { title: "Events - Campus Connect" },
    { name: "description", content: "Browse and search for campus events" },
  ];
};

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  organization: string;
  friends_going: number;
};

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Sunday Service with Maryland Christian Fellowship",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Memorial Garden Chapel",
    imageUrl: "/images/sunday-service.jpg",
    organization: "MARYLAND CHRISTIAN FELLOWSHIP",
    friends_going: 3
  },
  {
    id: "2",
    title: "Sign up for an Alternative Break experience!",
    date: "Thursday, September 12",
    time: "12:00 PM",
    location: "Online",
    imageUrl: "/images/alternative-break.jpg",
    organization: "Leadership & Community Service-Learning",
    friends_going: 0
  },
  {
    id: "3",
    title: "Maryland Bhangra Practices",
    date: "Sunday, November 19",
    time: "12:00 PM",
    location: "Adele Gladfelter Rehearsal Studio",
    imageUrl: "/images/bhangra-practices.jpg",
    organization: "Maryland Bhangra",
    friends_going: 2
  },
  {
    id: "4",
    title: "Worship Service",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Stamp Margaret Brent 2123",
    imageUrl: "/images/worship-service.jpg",
    organization: "Oasis",
    friends_going: 1
  },
  {
    id: "5",
    title: "Pa'lante Latin Dance Company Performance Team Practice",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Terpzone Activity Room A",
    imageUrl: "/images/palante-dance.jpg",
    organization: "Pa'lante Latin Dance Company",
    friends_going: 5
  },
  {
    id: "6",
    title: "Kairos Sunday Service",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Stamp Prince George's Room",
    imageUrl: "/images/kairos-service.jpg",
    organization: "Kairos Christian Fellowship",
    friends_going: 0
  },
  {
    id: "7",
    title: "Chess Club Weekly Meeting",
    date: "Monday, November 20",
    time: "6:00 PM",
    location: "Stamp Student Union Room 1234",
    imageUrl: "/images/chess-club.jpg",
    organization: "UMD Chess Club",
    friends_going: 2
  },
  {
    id: "8",
    title: "Intro to Python Workshop",
    date: "Tuesday, November 21",
    time: "4:00 PM",
    location: "Computer Science Building Room 1115",
    imageUrl: "/images/python-workshop.jpg",
    organization: "Computer Science Department",
    friends_going: 4
  },
  {
    id: "9",
    title: "Terps Basketball Game",
    date: "Wednesday, November 22",
    time: "7:30 PM",
    location: "Xfinity Center",
    imageUrl: "/images/basketball-game.jpg",
    organization: "Maryland Athletics",
    friends_going: 10
  },
  {
    id: "10",
    title: "Environmental Club Campus Cleanup",
    date: "Saturday, November 25",
    time: "10:00 AM",
    location: "McKeldin Mall",
    imageUrl: "/images/campus-cleanup.jpg",
    organization: "UMD Environmental Club",
    friends_going: 3
  },
  {
    id: "11",
    title: "Career Fair: STEM Industries",
    date: "Monday, November 27",
    time: "1:00 PM",
    location: "Stamp Grand Ballroom",
    imageUrl: "/images/career-fair.jpg",
    organization: "University Career Center",
    friends_going: 7
  },
  {
    id: "12",
    title: "Mindfulness Meditation Session",
    date: "Tuesday, November 28",
    time: "5:30 PM",
    location: "Eppley Recreation Center",
    imageUrl: "/images/meditation.jpg",
    organization: "UMD Health Center",
    friends_going: 1
  },
  {
    id: "13",
    title: "International Food Festival",
    date: "Friday, December 1",
    time: "6:00 PM",
    location: "Nyumburu Amphitheater",
    imageUrl: "/images/food-festival.jpg",
    organization: "International Student Association",
    friends_going: 8
  },
  {
    id: "14",
    title: "Hackathon: Build for Social Good",
    date: "Saturday, December 2",
    time: "9:00 AM",
    location: "Iribe Center",
    imageUrl: "/images/hackathon.jpg",
    organization: "Technica",
    friends_going: 6
  },
  {
    id: "15",
    title: "A Cappella Showcase",
    date: "Sunday, December 3",
    time: "7:00 PM",
    location: "Clarice Smith Performing Arts Center",
    imageUrl: "/images/acappella.jpg",
    organization: "UMD A Cappella Council",
    friends_going: 5
  }
];


export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = sampleEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
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
        {filteredEvents.map(event => (
          <div key={event.id} className="flex items-start space-x-4 border-b pb-4">
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{event.organization}</div>
              {event.friends_going > 0 && (
                <div className="text-sm text-gray-600 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <Users size={14} className="mr-1" />
                  <span>{event.friends_going} friend{event.friends_going > 1 ? 's' : ''} going</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
