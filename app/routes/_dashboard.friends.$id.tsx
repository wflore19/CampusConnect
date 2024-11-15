import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Text } from '~/components/text';
import { Divider } from '~/components/divider';
import { MapPin } from 'react-feather';
import { db } from 'db/src';

interface Friend {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    major: string;
    year: string;
    location: string | null;
    interests: string[] | null;
}

type LoaderData = {
    friend: Friend;
};

export async function loader({
    params,
}: LoaderFunctionArgs): Promise<LoaderData> {
    const friendId = params.id;

    if (!friendId) {
        throw new Error('Friend ID is required');
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
            'interests',
        ])
        .where('id', '=', friendId)
        .executeTakeFirst();

    if (!friend) {
        throw new Error('Friend not found');
    }

    return { friend };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: `${data?.friend.name}'s Profile - Campus Connect` },
        {
            name: 'description',
            content: `View ${data?.friend.name}'s profile on Campus Connect`,
        },
    ];
};

export default function FriendProfilePage() {
    const { friend } = useLoaderData<LoaderData>();

    return (
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">
                {friend.name}&apos;s Profile
            </Text>

            <Divider />

            <div className="mt-3 space-y-4">
                <img
                    src={friend.imageUrl!}
                    alt={friend.name}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />

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
                    <Text>{friend.interests!.join(', ')}</Text>
                </div>
            </div>
        </div>
    );
}
