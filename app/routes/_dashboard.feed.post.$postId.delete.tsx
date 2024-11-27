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

            <div className="flex justify-end gap-3">
                <NavLink to={`/feed`}>
                    <button className="flex items-center justify-center rounded-md bg-gray-500 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-gray-600 active:bg-gray-700">
                        Cancel
                    </button>
                </NavLink>

                <Form method="delete">
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-red-600 active:bg-red-700"
                    >
                        <Trash2 className="mr-2" size={16} /> Delete
                    </button>
                </Form>
            </div>
        </Modal>
    );
}
