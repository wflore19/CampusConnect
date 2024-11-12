import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db/src";
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

export const loader: LoaderFunction = async () => {
  const friends = await db
    .selectFrom('users')
    .leftJoin('friendships', 'users.id', 'friendships.user_id')
    .select([
      'users.id',
      'users.name',
      'users.email',
      'users.image_url as imageUrl',
      'users.major',
      'users.year',
      'users.location',
      'users.interests',
    ])
    .select(() => [
      db.fn.count('friendships.friend_id').as('friendCount')
    ])
    .groupBy('users.id')
    .execute();

  const parsedFriends = friends.map(friend => ({
    ...friend,
    friends: Number(friend.friendCount)
  }));

  return { friends: parsedFriends };
};

export default function Friends() {
  const { friends } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friends.filter((friend: Friend) =>
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
        {filteredFriends.map((friend: Friend) => (
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
