import { Button } from '@radix-ui/themes';
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';
import { Form, NavLink, useLoaderData } from '@remix-run/react';
import { Trash2 } from 'react-feather';
import { Modal } from '~/components/modal';
import { removeFriend } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';

export async function loader({ params }: LoaderFunctionArgs) {
    const userId = params.id;
    if (!userId) throw new Error('user ID not provided');

    return { userId };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);
    const userId = params.id;

    if (!userId) throw new Error('User ID not provided');

    try {
        await removeFriend(id, Number(userId));
        return redirect(`/user/${userId}`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export default function DeletePostModal() {
    const { userId } = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/feed`} size="600">
            <Modal.Header>
                <Modal.Title>Confirm Delete</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Are you sure you want to remove this friend?
            </Modal.Description>

            <Modal.Actions>
                <NavLink to={`/user/${userId}`}>
                    <Button
                        type="button"
                        color="gray"
                        variant="soft"
                        highContrast
                    >
                        Cancel
                    </Button>
                </NavLink>

                <Form method="delete">
                    <Button type="submit">
                        <Trash2 size={16} /> Confirm
                    </Button>
                </Form>
            </Modal.Actions>
        </Modal>
    );
}
