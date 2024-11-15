import type { LoaderFunction } from '@remix-run/node';
import { redirect, useRouteLoaderData } from '@remix-run/react';
import { GoogleButton } from '~/components/google-button';
import { getSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);

    if (!session.has('user_id')) {
        return { };
    }

    return redirect('/home');
};

export default function SignUp() {
    const { googleAuthUrl } = useRouteLoaderData("routes/_public") as { googleAuthUrl: string };

    return (
            <main className="flex flex-grow items-center justify-center bg-gray-100">
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                        <h1 className="mb-6 text-center text-2xl font-bold">
                            Sign Up
                        </h1>
                        <div>
                            {!!googleAuthUrl && (
                                <GoogleButton href={googleAuthUrl}>
                                    Sign up
                                </GoogleButton>
                            )}
                        </div>
                    </div>
                </div>
            </main>
    );
}
