import {
    Flex,
    Card,
    Text,
    Separator,
    Box,
    Button,
    Link,
} from '@radix-ui/themes';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect, useRouteLoaderData } from '@remix-run/react';
import { GoogleButton } from '~/components/google-button';
import { getSession } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);

    if (!session.has('user_id')) {
        return {};
    }

    return redirect('/home');
}

export default function LoginPage() {
    const googleAuthURL = useRouteLoaderData('routes/_public') as string;

    return (
        <Flex align="center" justify="center">
            <Card size="3" mt="9" style={{ width: 400 }}>
                <Text size="6" weight={'bold'}>
                    Sign in
                </Text>

                <Flex mt="9" justify="end" gap="3" direction={'column'}>
                    <GoogleButton href={googleAuthURL}>
                        <Text>Sign in</Text>
                    </GoogleButton>

                    <Flex align={'center'}>
                        <Separator my="3" size="4" />
                        <Box px={'3'}>
                            <Text size="6" color="gray">
                                or
                            </Text>
                        </Box>
                        <Separator my="3" size="4" />
                    </Flex>

                    <Button
                        variant="classic"
                        asChild
                        style={{ padding: 0 }}
                        size={'4'}
                    >
                        <Link href={'/signup'} rel="noopener noreferrer">
                            Sign Up
                        </Link>
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
}
