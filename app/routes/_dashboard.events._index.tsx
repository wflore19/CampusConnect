import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Calendar, MapPin } from 'react-feather';
import { Box, Heading, Card, Flex, Text, Avatar, Grid } from '@radix-ui/themes';
import { getEvents } from '~/modules/events/events.core';

export const meta: MetaFunction = () => {
    return [
        { title: 'Events - Campus Connect' },
        { name: 'description', content: 'Browse and search for campus events' },
    ];
};

export async function loader() {
    const events = await getEvents();

    return events;
}

export default function Events() {
    const events = useLoaderData<typeof loader>();

    return (
        <Box p="6">
            <Heading size="8" mb="6">
                Events
            </Heading>

            <Grid gap="4">
                {events.map((event) => (
                    <Card key={event.id}>
                        <Flex>
                            <Avatar
                                size="7"
                                src={event.imageUrl || undefined}
                                fallback={event.name?.[0] || 'E'}
                                radius="none"
                            />
                            <Box ml="4">
                                <Link to={`/event/${event.id}`}>
                                    <Text size="5" weight="bold" mb="1">
                                        {event.name}
                                    </Text>
                                </Link>
                                <Flex align="center" mb="1">
                                    <Calendar size={14} />
                                    <Text size="2" color="gray" ml="1">
                                        {event.date
                                            ? formatDate(new Date(event.date))
                                            : 'No date'}{' '}
                                        at{' '}
                                        {event.startTime
                                            ? formatTime(
                                                  new Date(event.startTime)
                                              )
                                            : 'No start time'}{' '}
                                        -{' '}
                                        {event.endTime
                                            ? formatTime(
                                                  new Date(event.endTime)
                                              )
                                            : 'No end time'}
                                    </Text>
                                </Flex>

                                <Flex align="center" mb="1">
                                    <MapPin size={14} />
                                    <Text size="2" color="gray" ml="1">
                                        {event.location}
                                    </Text>
                                </Flex>
                                <Flex align="center" mb="1">
                                    <Text size="2" color="gray">
                                        Organizer ID: {event.organizerId}
                                    </Text>
                                </Flex>
                                <Text size="3" mt="2">
                                    {event.description}
                                </Text>
                            </Box>
                        </Flex>
                    </Card>
                ))}
            </Grid>
        </Box>
    );
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
