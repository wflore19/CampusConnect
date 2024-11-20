import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getUsersList } from '~/modules/users/users.core';
import { ensureUserAuthenticated, user } from '~/utils/session.server';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
};

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
    const session = await ensureUserAuthenticated(request);
    const id = user(session);

    try {
        const users = await getUsersList(id);
        return users;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function Home() {
    // List of users
    const { users } = useLoaderData<typeof loader>() as { users: User[] };

    return (
        <div>
            {users.map((user) => (
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
