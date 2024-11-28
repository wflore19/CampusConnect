import { db } from "db/src";

/**
 * Get all posts from friends
 * @param id
 * @returns {Promise<Array>} - An array of posts
 *
 * @example
 * const posts = await getPosts(1);
 */
export async function getPostsById(id: number) {
    if (!id) throw new Error('User ID not provided');

    const friendsPosts = await db
        .selectFrom('posts')
        .leftJoin('users', 'users.id', 'posts.userId')
        .select([
            'users.firstName',
            'users.lastName',
            'users.profilePicture',
            'posts.id',
            'posts.userId',
            'posts.content',
            'posts.createdAt',
        ])
        .where('users.id', '=', id)
        .orderBy('posts.createdAt', 'desc')
        .execute();

    if (!friendsPosts) throw new Error('Posts not found');

    return friendsPosts;
}

/**
 * Get a post by ID
 * @param id
 * @returns {Promise<Object>} - The post object
 * @throws {Error} - If the post is not found
 *
 * @example
 * const post = await getPostById(1);
 */
export async function getPostById(id: number) {
    const post = await db
        .selectFrom('posts')
        .select([
            'posts.id',
            'posts.userId',
            'posts.content',
            'posts.createdAt',
        ])
        .where('posts.id', '=', id)
        .executeTakeFirst();

    if (!post) {
        throw new Error('Post not found');
    }

    return post;
}

/**
 * Create a post
 * @param userId
 * @param content
 * @returns
 *
 * @example
 * const post = await createPost(1, 'Hello', 'This is a post');
 */
export async function createPost(userId: number, content: string) {
    const post = await db
        .insertInto('posts')
        .values({
            userId: userId,
            content: content,
        })
        .executeTakeFirst();

    if (!post) {
        throw new Error('Post not created');
    }

    return post;
}

/**
 * Update a post
 * @param postId
 * @param content
 * @returns
 *
 * @example
 * const post = await updatePost(1, 'This is a post');
 */
export async function updatePost(postId: number, content: string) {
    const post = await db
        .updateTable('posts')
        .set({
            content: content,
        })
        .where('id', '=', postId)
        .executeTakeFirst();

    if (!post) {
        throw new Error('Post not updated');
    }

    return post;
}

/**
 * Delete a post
 * @param postId
 * @returns
 *
 * @example
 * const post = await deletePost(1);
 */
export async function deletePost(postId: number) {
    const post = await db
        .deleteFrom('posts')
        .where('id', '=', postId)
        .executeTakeFirst();

    if (!post) {
        throw new Error('Post not deleted');
    }

    return post;
}
