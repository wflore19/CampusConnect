import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db/src";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { getGoogleAuthURL } from "~/utils/auth";
import { getSession, user } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);

    if (!session.has('user_id')) {
        return { googleAuthUrl: getGoogleAuthURL() };
    }

    const id = await user(session);
    const profile = await db
        .selectFrom('users')
        .select(['name', 'imageUrl'])
        .where('id', '=', id)
        .executeTakeFirst();

    return {
        name: profile?.name,
        imageUrl: profile?.imageUrl,
    };
}
export default function PublicLayout() {
    const { name, imageUrl } = useLoaderData<typeof loader>();
    
    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-800">
            <Header name={name} imageUrl={imageUrl} />
            <Outlet />
            <Footer />
            </div>
    )
}