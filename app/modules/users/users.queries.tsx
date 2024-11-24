import { db } from 'db/src';

/**
 * Get user details
 * @param id - User ID
 * @returns User details
 *
 * @example
 * const userDetails = await getUserDetails(1);
 */
export async function getUserDetails(id: number) {
	const userDetails = await db
		.selectFrom('userDetails')
		.select([
			'userId',
			'sex',
			'relationshipStatus',
			'age',
			'birthday',
			'hometown',
			'interests',
			'favoriteMusic',
			'favoriteMovies',
			'favoriteBooks',
			'aboutMe',
			'school',
			'work',
		])
		.where('userId', '=', id)
		.executeTakeFirst();

	return userDetails;
}
