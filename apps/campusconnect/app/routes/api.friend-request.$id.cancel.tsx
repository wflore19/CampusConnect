import { type ActionFunctionArgs } from '@remix-run/node';
import { cancelFriendRequest } from '@campusconnect/db';

import { getSession, user } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const formData = await request.formData();
    const userId = String(formData.get('id'));

    if (!userId) throw new Error('User ID not provided');

    try {
        await cancelFriendRequest(id, Number(userId));
        return { success: true, type: 'cancel_request' };
    } catch (error) {
        console.error('Error removing friend:', error);
        return { error: (error as Error).message };
    }
}
