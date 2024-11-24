import { type ActionFunctionArgs } from '@remix-run/node';
import { db } from 'db/src';
import { UserDetailsRelationshipStatus, UserDetailsSex } from 'db/src/dist/db';
import { getSession, user } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request);
	const id = user(session);

	const formData = await request.formData();
	const aboutMe = formData.get('aboutMe');
	const sex = formData.get('sex');
	const age = formData.get('age');
	const birthday = formData.get('birthday');
	const favoriteBooks = formData.get('favoriteBooks');
	const favoriteMovies = formData.get('favoriteMovies');
	const favoriteMusic = formData.get('favoriteMusic');
	const hometown = formData.get('hometown');
	const interests = formData.get('interests');
	const relationshipStatus = formData.get('relationshipStatus');
	const school = formData.get('school');
	const work = formData.get('work');

	try {
		console.log('Updating profile...');

		// If record does NOT exists, insert, else update
		const record = await db
			.selectFrom('userDetails')
			.where('userId', '=', id)
			.executeTakeFirst();

		if (!record) {
			await db
				.insertInto('userDetails')
				.values({
					userId: id,
					aboutMe: aboutMe ? String(aboutMe) : null,
					sex: sex ? (String(sex) as UserDetailsSex) : null,
					age: age ? Number(age) : null,
					birthday: birthday ? String(birthday) : null,
					favoriteBooks: favoriteBooks ? String(favoriteBooks) : null,
					favoriteMovies: favoriteMovies
						? String(favoriteMovies)
						: null,
					favoriteMusic: favoriteMusic ? String(favoriteMusic) : null,
					hometown: hometown ? String(hometown) : null,
					interests: interests ? String(interests) : null,
					relationshipStatus: relationshipStatus
						? (String(
								relationshipStatus
							) as UserDetailsRelationshipStatus)
						: null,
					school: school ? String(school) : null,
					work: work ? String(work) : null,
				})
				.executeTakeFirst();
		} else {
			await db
				.updateTable('userDetails')
				.set({
					userId: id,
					aboutMe: aboutMe ? String(aboutMe) : null,
					sex: sex ? (String(sex) as UserDetailsSex) : null,
					age: age ? Number(age) : null,
					birthday: birthday ? String(birthday) : null,
					favoriteBooks: favoriteBooks ? String(favoriteBooks) : null,
					favoriteMovies: favoriteMovies
						? String(favoriteMovies)
						: null,
					favoriteMusic: favoriteMusic ? String(favoriteMusic) : null,
					hometown: hometown ? String(hometown) : null,
					interests: interests ? String(interests) : null,
					relationshipStatus: relationshipStatus
						? (String(
								relationshipStatus
							) as UserDetailsRelationshipStatus)
						: null,
					school: school ? String(school) : null,
					work: work ? String(work) : null,
				})
				.where('userId', '=', id)
				.executeTakeFirst();
		}

		return {};
	} catch (error) {
		return { error: (error as Error).message };
	}
}
