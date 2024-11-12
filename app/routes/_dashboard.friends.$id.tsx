import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { MapPin } from "react-feather";
import { db } from "db/src";

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

type LoaderData = {
  friend: Friend;
};

export const loader: LoaderFunction = async ({ params }) => {
  const friendId = params.id;

  if (!friendId) {
    throw new Response("Not Found", { status: 404 });
  }

  const friend = await db
    .selectFrom('users')
    .select([
      'id',
      'name',
      'email',
      'imageUrl',
      'major',
      'year',
      'location',
      'interests'
    ])
    .where('id', '=', friendId)
    .executeTakeFirst();

  if (!friend) {
    throw new Response("Friend not found", { status: 404 });
  }

  return { friend };
};



export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.friend.name}'s Profile - Campus Connect` },
    { name: "description", content: `View ${data?.friend.name}'s profile on Campus Connect` },
  ];
};

export default function FriendProfilePage() {
  const { friend } = useLoaderData<LoaderData>();

  return (
    <div className="py-6 px-2">
      <Text className="text-3xl font-bold mb-4">{friend.name}&apos;s Profile</Text>

      <Divider />
      
      <div className="space-y-4 mt-3">
        <img src={friend.imageUrl} alt={friend.name} className="w-32 h-32 rounded-full object-cover mb-4" />
        
        <div>
          <Text className="font-semibold">Major</Text>
          <Text>{friend.major}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Year</Text>
          <Text>{friend.year}</Text>
        </div>
        
        <div className="flex items-center">
          <MapPin size={16} className="mr-2" />
          <Text>{friend.location}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Interests</Text>
          <Text>{friend.interests.join(", ")}</Text>
        </div>
      </div>
    </div>
  );
}
