import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, redirect, useLoaderData } from "@remix-run/react";
import { Edit3 } from "react-feather";
import { Modal } from "~/components/modal";
import { getPostById, updatePost } from "~/modules/posts/posts.core";
import { Post } from "~/modules/posts/posts.types";

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
        await updatePost(Number(postId), content)

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
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="content"
                    placeholder="What's on your mind?"
                    defaultValue={post.content!}
                />

                <div className="flex justify-end gap-3 mt-3">
                    <NavLink to={`/feed`}>
                        <button className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-150 ease-in-out">
                            Cancel
                        </button>
                    </NavLink>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-150 ease-in-out"
                    >
                        <Edit3 className="mr-2" size={16} /> Update
                    </button>

                </div>
            </Form>
        </Modal>
    );
}
