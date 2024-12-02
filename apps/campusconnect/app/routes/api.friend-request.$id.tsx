import { type ActionFunctionArgs } from '@remix-run/node';
import { acceptFriendRequest, rejectFriendRequest } from '@campusconnect/db';
import { queueFriendRequest } from '~/modules/friends/friends.queue.server';

import { getSession, user } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const formData = await request.formData();
    const userId = String(formData.get('id'));
    const status = String(formData.get('status'));

    if (!userId) throw new Error('User ID not provided');
    if (!status) throw new Error('Status not provided');

    try {
        if (status === 'accepted') {
            await acceptFriendRequest(parseInt(userId), id);
            return {};
        } else if (status === 'rejected') {
            await rejectFriendRequest(parseInt(userId), id);
            return {};
        } else if (status === 'sending') {
            await queueFriendRequest(id, parseInt(userId));
            return { success: true, type: 'add' };
        }
    } catch (error) {
        return { error: (error as Error).message };
    }
}
