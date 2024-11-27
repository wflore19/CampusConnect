import { Button } from '@radix-ui/themes';
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';
import { Form, NavLink } from '@remix-run/react';
import { Trash2 } from 'react-feather';
import { Modal } from '~/components/modal';
import { deletePost } from '~/modules/posts/posts.core';

export async function loader({ params }: LoaderFunctionArgs) {
    const postId = params.postId;
    if (!postId) throw new Error('Post ID not provided');

    return { postId };
}

export async function action({ params }: ActionFunctionArgs) {
    const postId = params.postId;

    if (!postId) throw new Error('User ID not provided');

    try {
        await deletePost(Number(postId));
        return redirect(`/feed`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export default function DeletePostModal() {
    return (
        <Modal onCloseTo={`/feed`} size="600">
            <Modal.Header>
                <Modal.Title>Confirm Delete</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Are you sure you want to delete this post? This action cannot be
                undone.
            </Modal.Description>

            <Modal.Actions>
                <NavLink to={`/feed`}>
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
                        <Trash2 size={16} /> Delete
                    </Button>
                </Form>
            </Modal.Actions>
        </Modal>
    );
}
