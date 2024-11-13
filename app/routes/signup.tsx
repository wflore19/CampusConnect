import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGoogleAuthURL } from "../utils/auth";
import { GoogleButton } from "~/components/google-button";

export const loader: LoaderFunction = async () => {
  const googleAuthUrl = getGoogleAuthURL()

  return {
    googleAuthUrl,
  };
};

export default function SignUp() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <div>
          {!!googleAuthUrl && <GoogleButton href={googleAuthUrl} />}
        </div>
      </div>
    </div>
  );
}
