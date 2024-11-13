import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getGoogleAuthURL } from '../utils/auth';
import { GoogleButton } from '~/components/google-button';

export const loader: LoaderFunction = async () => {
    const googleAuthUrl = getGoogleAuthURL();

    return {
        googleAuthUrl,
    };
};

export default function SignUp() {
    const { googleAuthUrl } = useLoaderData<typeof loader>();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">Sign Up</h1>
                <div>
                    {!!googleAuthUrl && <GoogleButton href={googleAuthUrl} />}
                </div>
            </div>
        </div>
    );
}
