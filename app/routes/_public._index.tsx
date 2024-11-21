import type { MetaFunction } from '@remix-run/node';
import { Link, redirect, useRouteLoaderData } from '@remix-run/react';
import { GoogleButton } from '~/components/google-button';

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

export async function loader() {
    return redirect('/login');
}

export default function Index() {
    const { name, googleAuthUrl } = useRouteLoaderData('routes/_public') as {
        name: string;
        googleAuthUrl: string;
    };

    return (
        <main className="container mx-auto flex-grow px-4 py-8">
            {/* Hero Section */}
            <section className="mb-16 mt-8 flex flex-col items-center justify-center text-center">
                <h2 className="mb-6 text-5xl font-bold leading-tight">
                    Say Goodbye to
                    <br />
                    Loneliness.
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-900">
                    Find study buddies, join clubs, attend events and make new
                    friends all in one place.
                </p>
                {!name ? (
                    <GoogleButton href={googleAuthUrl!}>Sign Up</GoogleButton>
                ) : (
                    <Link
                        to="/home"
                        className="inline-block rounded border border-blue-500 bg-white px-4 py-2 text-blue-500 transition duration-300 ease-in-out hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Go to Dashboard
                    </Link>
                )}
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
                        <p className="text-gray-700">{feature.description}</p>
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
                    {!name ? (
                        <>
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
                        </>
                    ) : (
                        <Link
                            to="/home"
                            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white transition duration-300 hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </div>
            </section>
        </main>
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
