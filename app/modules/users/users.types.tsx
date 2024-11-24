export type UserProfile = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
};

export type UserDetails = {
    userId: number | null;
    sex: string | null;
    relationshipStatus: string | null;
    age: number | null;
    birthday: string | null;
    hometown: string | null;
    interests: string | null;
    favoriteMusic: string | null;
    favoriteMovies: string | null;
    favoriteBooks: string | null;
    aboutMe: string | null;
    school: string | null;
    work: string | null;
};
