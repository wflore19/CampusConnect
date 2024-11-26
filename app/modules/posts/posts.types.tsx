export type Posts = {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    profilePicture: string;
    content: string;
    createdAt: Date;
}[];

export type Post = {
    id: number | null;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    profilePicture: string | null;
    content: string | null;
    createdAt: Date | null;
}
