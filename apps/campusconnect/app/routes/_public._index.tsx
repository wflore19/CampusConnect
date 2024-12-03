import {
    Container,
    Heading,
    Text,
    Grid,
    Box,
    Section,
    Button,
    Card,
    Flex,
} from '@radix-ui/themes';
import { Link, redirect, useRouteLoaderData } from '@remix-run/react';
import React from 'react';
import { GoogleButton } from '~/components/google-button';

export async function loader() {
    return redirect('/login');
    //  return {};
}

export default function Index() {
    const { googleAuthUrl } = useRouteLoaderData('routes/_public') as {
        googleAuthUrl: string;
    };

    return (
        <Container size="3" p="6">
            {/* Hero Section */}
            <Section size="3">
                <Flex
                    justify={'center'}
                    align={'center'}
                    direction={'column'}
                    gap="4"
                >
                    <Heading size="8" mb="4" weight="bold">
                        Say Goodbye to
                        <br />
                        Loneliness.
                    </Heading>
                    <Text size="5" color="blue" mb="6">
                        Find study buddies, join clubs, attend events and make
                        new friends all in one place.
                    </Text>
                    <GoogleButton href={googleAuthUrl!}>Sign Up</GoogleButton>
                </Flex>
            </Section>

            {/* Features Section */}
            <Section size="3">
                <Grid columns="3" gap="4">
                    {features.map((feature, index) => (
                        <Card key={index} variant="surface">
                            <Heading as="h3" size="5" mb="2" color="blue">
                                {feature.title}
                            </Heading>
                            <Text color="gray" size="2">
                                {feature.description}
                            </Text>
                        </Card>
                    ))}
                </Grid>
            </Section>

            {/* Call To Action Section */}
            <Section size="3">
                <Card variant="surface">
                    <Box className="text-center" p="6">
                        <Heading size="6" mb="2" color="green">
                            Ready to Connect?
                        </Heading>
                        <Text size="4" mb="6" color="gray">
                            Join CampusConnect today and start building
                            meaningful connections on your campus.
                        </Text>
                        <Flex gap="4" justify="center">
                            <React.Fragment>
                                <Button size="3" variant="solid" asChild>
                                    <Link to="/login">Log In</Link>
                                </Button>
                                <Button
                                    size="3"
                                    variant="solid"
                                    color="green"
                                    asChild
                                >
                                    <Link to="/signup">Sign Up</Link>
                                </Button>
                            </React.Fragment>
                        </Flex>
                    </Box>
                </Card>
            </Section>
        </Container>
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
