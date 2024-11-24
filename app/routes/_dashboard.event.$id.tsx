import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Calendar, MapPin } from 'react-feather';
import {
	Heading,
	Text,
	Card,
	Flex,
	Avatar,
	Separator,
	Link,
} from '@radix-ui/themes';
import { getEventById } from '~/modules/events/events.core';
import { getUserById } from '~/modules/users/users.core';

type LoaderData = {
	event: {
		id: string;
		name: string;
		date: Date;
		startTime: Date;
		endTime: Date;
		location: string;
		imageUrl: string;
		organizerId: string;
	};
	organizerUser: {
		id: string;
		firstName: string;
		lastName: string;
		profilePicture: string;
	};
};

export async function loader({ params }: LoaderFunctionArgs) {
	const { id } = params;
	if (!id) throw new Error('Event ID is required');

	try {
		const event = await getEventById(parseInt(id));

		if (event.organizerId === null) throw new Error('Organizer ID is null');

		const organizerUser = await getUserById(event.organizerId);

		return { event, organizerUser };
	} catch (error) {
		throw new Error((error as Error).message);
	}
}

export default function EventPage() {
	const { event, organizerUser } = useLoaderData<LoaderData>();

	const formattedDate = event.date.toLocaleDateString();
	const formattedStartTime = event.startTime.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
	const formattedEndTime = event.endTime.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<>
			<Heading size="8" mb="6">
				{event.name}
			</Heading>
			<Separator size="4" mb="4" />

			<Card>
				<Avatar
					size="9"
					src={event.imageUrl}
					fallback={event.name}
					radius="full"
					mb="4"
				/>

				<Flex align="center" mb="3">
					<Calendar size={16} />
					<Text size="3" ml="2">
						{formattedDate} at {formattedStartTime} -{' '}
						{formattedEndTime}
					</Text>
				</Flex>

				<Flex align="center" mb="3">
					<MapPin size={16} />
					<Text size="3" ml="2">
						{event.location}
					</Text>
				</Flex>

				<Flex align={'center'} mb="3" gap={'2'}>
					<Text size="3" weight="bold">
						Organizer
					</Text>
					<Flex align={'center'} gap={'2'}>
						<Link href={`/user/${organizerUser.id}`}>
							{organizerUser.firstName} {organizerUser.lastName}
						</Link>
						<Avatar
							radius="full"
							size="1"
							src={organizerUser.profilePicture}
							fallback={`${organizerUser.firstName}${organizerUser.lastName}`}
						/>
					</Flex>
				</Flex>
			</Card>
		</>
	);
}
