import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, NavLink, redirect, useLoaderData } from '@remix-run/react';
import { Edit3 } from 'react-feather';
import { Modal } from '~/components/modal';
import { getPostById, updatePost } from '~/modules/posts/posts.core';
import { Post } from '~/modules/posts/posts.types';

export async function loader({ params }: LoaderFunctionArgs) {
    const postId = params.postId;
    if (!postId) throw new Error('Post ID not provided');

    try {
        const post = await getPostById(Number(postId));

        return { post };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const postId = params.postId;
    if (!postId) throw new Error('User ID not provided');

    try {
        const formData = await request.formData();
        const content = String(formData.get('content'));
        await updatePost(Number(postId), content);

        return redirect(`/feed`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export default function EditPostModal() {
    const { post } = useLoaderData<typeof loader>() as {
        post: Post;
    };

    return (
        <Modal onCloseTo={`/feed`} size="600">
            <Modal.Header>
                <Modal.Title>Edit Post</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Make changes to your post here. You can also delete the post.
            </Modal.Description>

            <Form method="put">
                <textarea
                    className="h-24 w-full resize-none rounded-lg border border-gray-300 p-3 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="content"
                    placeholder="What's on your mind?"
                    defaultValue={post.content!}
                />

                <div className="mt-3 flex justify-end gap-3">
                    <NavLink to={`/feed`}>
                        <button className="flex items-center justify-center rounded-md bg-gray-500 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-gray-600 active:bg-gray-700">
                            Cancel
                        </button>
                    </NavLink>

                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
                    >
                        <Edit3 className="mr-2" size={16} /> Update
                    </button>
                </div>
            </Form>
        </Modal>
    );
}
