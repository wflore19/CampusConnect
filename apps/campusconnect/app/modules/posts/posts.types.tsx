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
    id: number; // Ensure 'id' is not nullable
    userId: number;
    firstName: string;
    lastName: string;
    profilePicture: string;
    content: string;
    createdAt: Date;
};

