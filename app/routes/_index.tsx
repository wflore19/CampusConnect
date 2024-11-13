import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { ensureUserAuthenticated, user } from '~/utils/session.server';

export const meta: MetaFunction = () => {
    return [
        { title: 'CampusConnect - Building Community on Campus' },
        {
            name: 'description',
            content:
                'Connect with peers, find events, and combat loneliness on your university campus.',
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await ensureUserAuthenticated(request);
    const id = await user(session);

    const profile = await db
        .selectFrom('users')
        .select(['name', 'imageUrl'])
        .where('id', '=', id)
        .executeTakeFirst();

    if (!profile) {
        throw new Error('User not found');
    }

    return { name: profile.name, imageUrl: profile.imageUrl };
}

export default function Index() {
    const { name, imageUrl } = useLoaderData<typeof loader>();

    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-800">
            <header className="bg-blue-600 py-4 sm:py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-center sm:mb-0 sm:text-left">
                            <h1 className="text-3xl font-bold text-white sm:text-4xl">
                                CampusConnect
                            </h1>
                            <p className="mt-1 text-lg text-white sm:mt-2 sm:text-xl">
                                Building Community on Campus
                            </p>
                        </div>
                        {name ? (
                            <div className="flex items-center space-x-4">
                                <img
                                    src={
                                        imageUrl
                                            ? imageUrl
                                            : 'https://ui-avatars.com/api/?name=' +
                                              name
                                    }
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <Link
                                    to="/home"
                                    className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition duration-300 hover:bg-blue-50 sm:text-base"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition duration-300 hover:bg-blue-50 sm:text-base"
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto flex-grow px-4 py-8">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-800">
                        Say Goodbye to Campus Loneliness
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
                        Find study buddies, event companions, and friends who
                        share your interests – all within your university
                        community.
                    </p>
                    <Link
                        to="/home"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white transition duration-300 hover:bg-blue-700"
                    >
                        Join CampusConnect
                    </Link>
                </section>

                {/* Features Section */}
                <section className="mb-16 grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded-lg bg-blue-50 p-6 shadow-sm"
                        >
                            <h3 className="mb-3 text-2xl font-semibold text-blue-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Call To Action Section */}
                <section className="rounded-lg bg-green-50 p-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-green-800">
                        Ready to Connect?
                    </h2>
                    <p className="mb-8 text-xl text-gray-700">
                        Join CampusConnect today and start building meaningful
                        connections on your campus.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/login"
                            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white transition duration-300 hover:bg-blue-700"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-white transition duration-300 hover:bg-green-700"
                        >
                            Sign Up
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="mt-auto bg-gray-100 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2023 CampusConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

const features = [
    {
        title: 'Event Discovery',
        description:
            'Search, host, and register for campus events that match your interests.',
    },
    {
        title: 'Interest Matching',
        description:
            'Connect with peers who share your passions and academic goals.',
    },
    {
        title: 'Smart Reminders',
        description:
            'Never miss an event with our personalized notification system.',
    },
];
