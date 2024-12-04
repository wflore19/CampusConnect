import { Button, TextArea } from '@radix-ui/themes';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, redirect, useLoaderData } from '@remix-run/react';
import { RiEdit2Line } from '@remixicon/react';
import { Modal } from '~/components/modal';
import { type FeedPost, getPostById, updatePost } from '@campusconnect/db';

export async function loader({ params }: LoaderFunctionArgs) {
    const postId = params.postId;
    if (!postId) throw new Error('Post ID not provided');

    try {
        const post: FeedPost = await getPostById(Number(postId));

        return post;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function EditPostModal() {
    const post = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/feed`}>
            <Modal.Header>
                <Modal.Title>Edit Post</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Make changes to your post here.
            </Modal.Description>

            <Form method="put">
                <Modal.Content>
                    <TextArea
                        name="content"
                        defaultValue={post.content || ''}
                        placeholder="What's on your mind?"
                        resize="vertical"
                        size={'3'}
                        maxLength={240}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <Link to={`/feed`}>
                        <Button
                            type="button"
                            color="gray"
                            variant="soft"
                            highContrast
                        >
                            Cancel
                        </Button>
                    </Link>

                    <Button type="submit" color="indigo" variant="soft">
                        <RiEdit2Line size={20} /> Update
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const postId = params.postId;
    if (!postId) throw new Error('User ID not provided');

    try {
        const formData = await request.formData();
        const content = String(formData.get('content')).trim();
        await updatePost(Number(postId), content);

        return redirect(`/feed`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}
