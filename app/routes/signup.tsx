import type { LoaderFunction } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { getGoogleAuthURL } from '../utils/auth';
import { GoogleButton } from '~/components/google-button';
import { getSession, user } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const id = user(session);

    if (id) {
        return redirect('/home');
    }

    const googleAuthUrl = getGoogleAuthURL();

    return {
        googleAuthUrl,
    };
};

export default function SignUp() {
    const { googleAuthUrl } = useLoaderData<typeof loader>();

    return (
        <div className="flex min-h-screen flex-col">
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
                        <Link
                            to="/home"
                            className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition duration-300 hover:bg-blue-50 sm:text-base"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex flex-grow items-center justify-center bg-gray-100">
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                        <h1 className="mb-6 text-center text-2xl font-bold">
                            Sign Up
                        </h1>
                        <div>
                            {!!googleAuthUrl && (
                                <GoogleButton href={googleAuthUrl} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}