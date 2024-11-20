import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';

export const meta: MetaFunction = () => {
    return [
        { title: 'CampusConnect - Your Campus Community' },
        {
            name: 'description',
            content:
                'Connect with friends, discover events, and build your campus community',
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const friendsList = await getFriendsList(id);

    return friendsList;
}

export default function Home() {
    // List of users
    const friendsList = useLoaderData<typeof loader>() as {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
    }[];

    return (
        <div>
            {friendsList.map((user) => (
                <div key={user.id}>
                    <img src={user.profilePicture} alt="" className="w-12" />
                    <h2>{`${user.firstName} ${user.lastName}`}</h2>
                    <p>{user.email}</p>
                    <Link to={`/user/${user.id}`}>View Profile</Link>
                </div>
            ))}
        </div>
    );
}
