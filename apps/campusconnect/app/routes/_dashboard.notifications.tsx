import { useNotifications } from '../modules/notifications/notifications.context';
import {
    Box,
    Card,
    Flex,
    Tabs,
    Text,
    Avatar,
    ScrollArea,
} from '@radix-ui/themes';
import { NotificationsResponse } from '~/modules/notifications/notifications.types';
import { getTimeAgo } from '~/utils/time';

export default function NotificationsPage() {
    const { notifications } = useNotifications();

    return (
        <Box>
            <Card size="1">
                <Flex direction="column" gap="3">
                    <Text size="5" weight="bold">
                        Notifications
                    </Text>

                    <Tabs.Root defaultValue="all">
                        <Tabs.List>
                            <Tabs.Trigger value="all">All</Tabs.Trigger>
                            <Tabs.Trigger value="mentions">
                                Mentions
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="all">
                            <ScrollArea
                                style={{ height: 'calc(100vh - 150px)' }}
                            >
                                {notifications.map((notification, idx) => (
                                    <NotificationItem
                                        key={idx}
                                        notification={notification}
                                    />
                                ))}
                            </ScrollArea>
                        </Tabs.Content>
                        <Tabs.Content value="mentions">
                            <ScrollArea
                                style={{ height: 'calc(100vh - 150px)' }}
                            >
                                {notifications.map((notification, idx) => (
                                    <NotificationItem
                                        key={idx}
                                        notification={notification}
                                    />
                                ))}
                            </ScrollArea>
                        </Tabs.Content>
                    </Tabs.Root>
                </Flex>
            </Card>
        </Box>
    );
}

function NotificationItem({
    notification,
}: {
    notification: NotificationsResponse;
}) {
    return (
        <Flex
            p="3"
            gap="3"
            align="start"
            style={{
                borderBottom: '1px solid var(--gray-5)',
            }}
        >
            <Flex direction="column" gap="1">
                <Flex gap="2" align="center">
                    <Text weight="bold">{notification.type}</Text>
                    <Text size="1" color="gray">
                        {getTimeAgo(new Date(notification.createdAt))}
                    </Text>
                </Flex>

                <Text>{notification.message}</Text>
            </Flex>
        </Flex>
    );
}
