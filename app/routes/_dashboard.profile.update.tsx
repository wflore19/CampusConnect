import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';
import {
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { getSession, user } from '~/utils/session.server';
import { getUserDetails } from '~/modules/users/users.queries';
import { UserDetails } from '~/modules/users/users.types';
import { db } from 'db/src';
import { UserDetailsRelationshipStatus, UserDetailsSex } from 'db/src/dist/db';
import React from 'react';
import { EditProfileModal } from '~/modules/users/users.ui';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    try {
        const userDetails = await getUserDetails(id);

        return {
            userDetails: userDetails ? userDetails : {},
        };
    } catch (error) {
        console.error(error);
    }
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    try {
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

        return redirect(`/profile`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}

type LoaderData = {
    userDetails: Partial<UserDetails>;
};

export default function EditPostModal() {
    const { userDetails } = useLoaderData<typeof loader>() as LoaderData;

    return (
        <React.Fragment>
            <EditProfileModal userDetails={userDetails} />
        </React.Fragment>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
