import { useRouteLoaderData } from '@remix-run/react';
import { Divider } from '~/components/divider';
import { Text } from '~/components/text';

export default function Profile() {
    const { firstName, lastName, email, profilePicture } = useRouteLoaderData(
        'routes/_dashboard'
    ) as {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
    };

    return (
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">
                {firstName} {lastName}&apos;s Profile
            </Text>

            <Divider />

            <div className="mt-3 space-y-4">
                <img
                    src={profilePicture}
                    alt={firstName + ' ' + lastName}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />

                <div>
                    <Text className="font-semibold">Email</Text>
                    <Text>{email}</Text>
                </div>
            </div>
        </div>
    );
}
