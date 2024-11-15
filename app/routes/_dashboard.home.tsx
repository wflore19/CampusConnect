import type { MetaFunction } from '@remix-run/node';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { Calendar, Users, Compass } from 'react-feather';

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

export default function Home() {
    const { name, imageUrl } = useRouteLoaderData('routes/_dashboard') as {
        name: string;
        imageUrl: string;
    };

    return (
        <div className="mx-auto max-w-4xl px-2 py-6">
            <div className="mb-6 text-3xl font-bold">
                Welcome to CampusConnect, {name}{' '}
                <span>
                    <img
                        src={imageUrl}
                        alt=""
                        className="h-16 w-16 rounded-full object-cover"
                    />
                </span>
            </div>

            <div className="mb-8 rounded-lg bg-blue-100 p-4">
                <p className="text-lg">
                    Discover new friendships, exciting events, and build your
                    campus community. Say goodbye to loneliness and hello to
                    meaningful connections!
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 flex items-center text-xl font-semibold">
                        <Users className="mr-2" /> Connect with Friends
                    </h2>
                    <p className="mb-4">
                        Find study buddies, event companions, and friends who
                        share your interests.
                    </p>
                    <Link
                        to="/friends"
                        className="text-blue-600 hover:underline"
                    >
                        Explore Friends &rarr;
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 flex items-center text-xl font-semibold">
                        <Calendar className="mr-2" /> Discover Events
                    </h2>
                    <p className="mb-4">
                        Join campus activities, workshops, and social gatherings
                        tailored to your interests.
                    </p>
                    <Link
                        to="/events"
                        className="text-blue-600 hover:underline"
                    >
                        Browse Events &rarr;
                    </Link>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold">Get Started</h2>
                <ul className="list-inside list-disc space-y-2">
                    <li>Complete your profile and add your interests</li>
                    <li>
                        Browse upcoming events and mark the ones you&apos;re
                        interested in
                    </li>
                    <li>
                        Connect with friends who share similar interests or are
                        attending the same events
                    </li>
                    <li>Create your own events or study groups</li>
                </ul>
            </div>

            <div className="mt-8 rounded-lg bg-green-100 p-4">
                <h2 className="mb-2 flex items-center text-xl font-semibold">
                    <Compass className="mr-2" /> Explore Your Campus Community
                </h2>
                <p>
                    CampusConnect is your gateway to a more engaged, inclusive,
                    and vibrant campus life. Start exploring now and make the
                    most of your university experience!
                </p>
            </div>
        </div>
    );
}
