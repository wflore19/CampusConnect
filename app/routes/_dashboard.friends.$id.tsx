import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { MapPin, Users } from "react-feather";

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


type LoaderData = {
  friend: Friend;
};

export const loader: LoaderFunction = async ({ params }) => {
  const friend = sampleFriends.find(f => f.id === params.id);

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
    <div className="p-6">
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
        
        <div className="flex items-center">
          <Users size={16} className="mr-2" />
          <Text>{friend.friends} friends</Text>
        </div>
      </div>
    </div>
  );
}
