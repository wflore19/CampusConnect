import { db } from "db/src";

/**
 * Get all posts from friends
 * @param id
 * @returns {Promise<Array>} - An array of posts
 *
 * @example
 * const posts = await getPosts(1);
 */
/**
 * Get the total number of posts for a user
 * @param userId
 * @returns {Promise<number>} - The total number of posts
 *
 * @example
 * const totalPosts = await getTotalPostsCount(1);
 */
export async function getTotalPostsCount(userId: number): Promise<number> {
    if (!userId) throw new Error('User ID not provided');

    const result = await db
        .selectFrom('posts')
        .leftJoin('users', 'users.id', 'posts.userId')
        .select(db.fn.count('posts.id').as('totalCount'))
        .where('users.id', '=', userId)
        .executeTakeFirst();

    if (!result || !result.totalCount) {
        throw new Error('Unable to fetch total posts count');
    }

    return parseInt(result.totalCount.toString(), 10);

}

export async function getPostsById(id: number, limit: number = 10, offset: number = 0) {
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
        .limit(limit)
        .offset(offset)
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
    await db
        .insertInto('posts')
        .values({
            userId,
            content,
        })
        .execute();

    // Fetch the newly created post to include related fields
    const post = await db
        .selectFrom('posts')
        .leftJoin('users', 'users.id', 'posts.userId')
        .select([
            'posts.id',
            'posts.userId',
            'users.firstName',
            'users.lastName',
            'users.profilePicture',
            'posts.content',
            'posts.createdAt',
        ])
        .orderBy('posts.createdAt', 'desc')
        .limit(1)
        .executeTakeFirst();

    if (!post) {
        throw new Error('Post creation failed');
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
