import { type ActionFunctionArgs } from '@remix-run/node';
import { insertFriendRequest, rejectFriendRequest } from '@campusconnect/db';
import { getSession, user } from '~/utils/session.server';

export async function action({ request, params }: ActionFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);
    const id = Number(params.id);

    try {
        await insertFriendRequest(userId, id, userId);
        return { success: true, type: 'cancel_request' };
    } catch (error) {
        return { error: (error as Error).message };
    }
}