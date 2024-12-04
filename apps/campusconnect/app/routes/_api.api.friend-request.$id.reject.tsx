import { type ActionFunctionArgs } from '@remix-run/node';
import { rejectFriendRequest } from '@campusconnect/db';
import { getSession, user } from '~/utils/session.server';

export async function action({ request, params }: ActionFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);
    const id = Number(params.id);

    try {
        await rejectFriendRequest(userId, id, id);
        return { success: true, type: 'cancel_request' };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
