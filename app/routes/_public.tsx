import { Flex } from '@radix-ui/themes';
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { getGoogleAuthURL } from '~/utils/auth';
import { getSession } from '~/utils/session.server';

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
    const session = await getSession(request);

    if (!session.has('user_id')) {
        return { googleAuthUrl: getGoogleAuthURL() };
    }

    return null;
}

export default function PublicLayout() {
    return (
        <Flex direction="column" justify="between" minHeight="100vh">
            <Flex direction="column" gap="9">
                <Header />
                <Outlet />
            </Flex>
            <Footer />
        </Flex>
    );
}
