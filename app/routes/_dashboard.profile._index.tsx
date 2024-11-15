import { useRouteLoaderData } from '@remix-run/react';
import { Divider } from '~/components/divider';
import { Text } from '~/components/text';
import { MapPin } from 'react-feather';

export default function Profile() {
    const { name, email, major, year, interests, location, imageUrl } =
        useRouteLoaderData('routes/_dashboard') as {
            name: string;
            email: string;
            major: string;
            year: string;
            interests: string[];
            location: string;
            imageUrl: string;
        };

    return (
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">
                {name}&apos;s Profile
            </Text>

            <Divider />

            <div className="mt-3 space-y-4">
                <img
                    src={imageUrl}
                    alt={name}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />

                <div>
                    <Text className="font-semibold">Email</Text>
                    <Text>{email}</Text>
                </div>

                <div>
                    <Text className="font-semibold">Major</Text>
                    <Text>{major}</Text>
                </div>

                <div>
                    <Text className="font-semibold">Year</Text>
                    <Text>{year}</Text>
                </div>

                <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <Text>{location}</Text>
                </div>

                <div>
                    <Text className="font-semibold">Interests</Text>
                    <Text>{interests.join(', ')}</Text>
                </div>
            </div>
        </div>
    );
}
