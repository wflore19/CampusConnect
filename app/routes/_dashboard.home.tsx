import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Calendar, Users, Compass } from "react-feather";

export const meta: MetaFunction = () => {
  return [
    { title: "CampusConnect - Your Campus Community" },
    { name: "description", content: "Connect with friends, discover events, and build your campus community" },
  ];
};

export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to CampusConnect</h1>
      
      <div className="bg-blue-100 p-4 rounded-lg mb-8">
        <p className="text-lg">
          Discover new friendships, exciting events, and build your campus community. 
          Say goodbye to loneliness and hello to meaningful connections!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" /> Connect with Friends
          </h2>
          <p className="mb-4">Find study buddies, event companions, and friends who share your interests.</p>
          <Link to="/friends" className="text-blue-600 hover:underline">
            Explore Friends &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" /> Discover Events
          </h2>
          <p className="mb-4">Join campus activities, workshops, and social gatherings tailored to your interests.</p>
          <Link to="/events" className="text-blue-600 hover:underline">
            Browse Events &rarr;
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Complete your profile and add your interests</li>
          <li>Browse upcoming events and mark the ones you&apos;re interested in</li>
          <li>Connect with friends who share similar interests or are attending the same events</li>
          <li>Create your own events or study groups</li>
        </ul>
      </div>

      <div className="mt-8 bg-green-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Compass className="mr-2" /> Explore Your Campus Community
        </h2>
        <p>
          CampusConnect is your gateway to a more engaged, inclusive, and vibrant campus life. 
          Start exploring now and make the most of your university experience!
        </p>
      </div>
    </div>
  );
}
