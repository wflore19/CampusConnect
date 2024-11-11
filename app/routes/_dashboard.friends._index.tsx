import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Search, MapPin, Users, Book } from "react-feather";

// Add type definitions for the icon components
type IconProps = React.ComponentProps<"svg"> & { size?: number | string };
const Icon = ({ size, ...props }: IconProps) => (
  <svg width={size} height={size} {...props} />
);
const BookIcon = (props: IconProps) => <Icon {...props}><Book /></Icon>;
const MapPinIcon = (props: IconProps) => <Icon {...props}><MapPin /></Icon>;
const UsersIcon = (props: IconProps) => <Icon {...props}><Users /></Icon>;

export const meta: MetaFunction = () => {
  return [
    { title: "Friends - Campus Connect" },
    { name: "description", content: "Browse and search for campus friends" },
  ];
};

type Friend = {
  id: string;
  name: string;
  major: string;
  year: string;
  location: string;
  interests: string[];
  friends: number;
  imageUrl: string;
};

const sampleFriends: Friend[] = [
  {
    id: "1",
    name: "Alex Rivera",
    major: "Environmental Science",
    year: "Junior",
    location: "West Campus",
    interests: ["Sustainability", "Hiking", "Photography"],
    friends: 52,
    imageUrl: "https://ui-avatars.com/api/?name=Alex+Rivera"
  },
  {
    id: "2",
    name: "Mia Thompson",
    major: "Computer Engineering",
    year: "Sophomore",
    location: "North Campus",
    interests: ["Robotics", "AI", "Rock Climbing"],
    friends: 38,
    imageUrl: "https://ui-avatars.com/api/?name=Mia+Thompson"
  },
  {
    id: "3",
    name: "Jamal Ahmed",
    major: "Business Analytics",
    year: "Senior",
    location: "Off-campus",
    interests: ["Data Science", "Basketball", "Cooking"],
    friends: 65,
    imageUrl: "https://ui-avatars.com/api/?name=Jamal+Ahmed"
  },
  {
    id: "4",
    name: "Sophia Chen",
    major: "Biomedical Engineering",
    year: "Freshman",
    location: "East Campus",
    interests: ["Medical Research", "Violin", "Volunteering"],
    friends: 23,
    imageUrl: "https://ui-avatars.com/api/?name=Sophia+Chen"
  },
  {
    id: "5",
    name: "Ethan Goldstein",
    major: "Political Science",
    year: "Junior",
    location: "South Campus",
    interests: ["Debate", "Model UN", "Writing"],
    friends: 47,
    imageUrl: "https://ui-avatars.com/api/?name=Ethan+Goldstein"
  },
  {
    id: "6",
    name: "Zoe Nguyen",
    major: "Graphic Design",
    year: "Senior",
    location: "Art District",
    interests: ["Digital Art", "Photography", "Yoga"],
    friends: 58,
    imageUrl: "https://ui-avatars.com/api/?name=Zoe+Nguyen"
  },
  {
    id: "7",
    name: "Lucas Fernandez",
    major: "Mechanical Engineering",
    year: "Sophomore",
    location: "Engineering Complex",
    interests: ["3D Printing", "Cycling", "Renewable Energy"],
    friends: 31,
    imageUrl: "https://ui-avatars.com/api/?name=Lucas+Fernandez"
  }
];

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = sampleFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-2">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Friends"
            className="w-full p-2 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFriends.map(friend => (
          <div key={friend.id} className="flex items-start space-x-4 border-b pb-4">
            <img src={friend.imageUrl} alt={friend.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-grow">
              <Link to={`/friends/${friend.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg">{friend.name}</h3>
              </Link>
              <div className="text-sm text-gray-600 flex items-center">
                <BookIcon size={14} className="mr-1" />
                <span>{friend.major} - {friend.year}</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <MapPinIcon size={14} className="mr-1" />
                <span>{friend.location}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Interests: {friend.interests.join(", ")}
              </div>
              <div className="text-sm text-gray-600 mt-1 flex items-center">
                <UsersIcon size={14} className="mr-1" />
                <span>{friend.friends} friends</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
