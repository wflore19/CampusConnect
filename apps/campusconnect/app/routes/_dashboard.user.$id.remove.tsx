import { Button } from '@radix-ui/themes';
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';
import { Form, NavLink, useLoaderData } from '@remix-run/react';
import { RiUserMinusFill } from '@remixicon/react';
import { Modal } from '~/components/modal';
import { removeFriend } from '@campusconnect/db';
import { getSession, user } from '~/utils/session.server';

export async function loader({ params }: LoaderFunctionArgs) {
    const id = params.id;
    if (!id) throw new Error('user ID not provided');

    return id;
}

export default function DeletePostModal() {
    const id = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/user/${id}`} size="600">
            <Modal.Header>
                <Modal.Title>Confirm Delete</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Are you sure you want to remove this friend?
            </Modal.Description>

            <Modal.Actions>
                <NavLink to={`/user/${id}`}>
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
                    <Button type="submit" color="red">
                        <RiUserMinusFill size={16} /> Confirm
                    </Button>
                </Form>
            </Modal.Actions>
        </Modal>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);
    const id = params.id;

    if (!userId) throw new Error('User ID not provided');

    try {
        await removeFriend(Number(id), userId);
        return redirect(`/user/${id}`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}
