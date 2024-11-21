import type { MetaFunction } from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';
import { Calendar, Users, Compass } from 'react-feather';
import { Box, Flex, Heading, Text, Card, Grid, Link } from '@radix-ui/themes';

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
    const { firstName } = useRouteLoaderData('routes/_dashboard') as {
        firstName: string;
    };

    return (
        <>
            <Box width={'full'}>
                <Flex align="center" mb="6" gap={{ initial: '1', md: '4' }}>
                    <Heading size={{ initial: '6', md: '6' }}>
                        Welcome to CampusConnect, {firstName}
                    </Heading>
                </Flex>
            </Box>

            <Card mb="8">
                <Text size="4">
                    Discover new friendships, exciting events, and build your
                    campus community. Say goodbye to loneliness and hello to
                    meaningful connections!
                </Text>
            </Card>

            <Grid columns={{ initial: '1', sm: '2' }} gap="6" mb="8">
                <Card>
                    <Flex align="center" mb="2">
                        <Users />
                        <Heading size="4" ml="2">
                            Connect with Friends
                        </Heading>
                    </Flex>
                    <Text as="p" mb="2">
                        Find study buddies, event companions, and friends who
                        share your interests.
                    </Text>
                    <Link href="/friends">
                        <Text>Explore Friends →</Text>
                    </Link>
                </Card>

                <Card>
                    <Flex align="center" mb="2">
                        <Calendar />
                        <Heading size="4" ml="2">
                            Discover Events
                        </Heading>
                    </Flex>
                    <Text as="p" mb="2">
                        Join campus activities, workshops, and social gatherings
                        tailored to your interests.
                    </Text>
                    <Link href="/events">
                        <Text>Browse Events →</Text>
                    </Link>
                </Card>
            </Grid>

            <Box mb="8">
                <Heading size="6" mb="4">
                    Get Started
                </Heading>
                <ul>
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
            </Box>

            <Card>
                <Flex align="center" mb="2">
                    <Compass />
                    <Heading size="6" ml="2">
                        Explore Your Campus Community
                    </Heading>
                </Flex>
                <Text>
                    CampusConnect is your gateway to a more engaged, inclusive,
                    and vibrant campus life. Start exploring now and make the
                    most of your university experience!
                </Text>
            </Card>
        </>
    );
}
