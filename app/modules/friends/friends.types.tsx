export interface FriendshipStatusControlProps {
    friendRequest:
        | {
              uid1: number;
              uid2: number;
              status: string;
          }
        | undefined;
    userId: number;
    id: number;
}

export type Friend = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
};
