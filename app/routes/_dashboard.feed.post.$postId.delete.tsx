import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, NavLink } from "@remix-run/react";
import { Trash2 } from "react-feather";
import { Modal } from "~/components/modal";
import { deletePost } from "~/modules/posts/posts.core";

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
                Are you sure you want to delete this post? This action cannot
                be undone.
            </Modal.Description>

            <div className="flex justify-end gap-3">
                <NavLink to={`/feed`}>
                    <button className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-150 ease-in-out">
                        Cancel
                    </button>
                </NavLink>

                <Form method="delete">
                <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-150 ease-in-out"
                >
                    <Trash2 className="mr-2" size={16} /> Delete
                </button>

                </Form>
            </div>
        </Modal>
    );
}

