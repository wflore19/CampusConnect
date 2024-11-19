import { sql, type Kysely } from 'kysely';

const sampleFriends = [
    {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        major: 'Environmental Science',
        year: 'Junior',
        location: 'West Campus',
        interests: ['Sustainability', 'Hiking', 'Photography'],
        image_url: 'https://ui-avatars.com/api/?name=Alex+Rivera',
    },
    {
        name: 'Mia Thompson',
        email: 'mia.thompson@example.com',
        major: 'Computer Engineering',
        year: 'Sophomore',
        location: 'North Campus',
        interests: ['Robotics', 'AI', 'Rock Climbing'],
        image_url: 'https://ui-avatars.com/api/?name=Mia+Thompson',
    },
    {
        name: 'Jamal Ahmed',
        email: 'jamal.ahmed@example.com',
        major: 'Business Analytics',
        year: 'Senior',
        location: 'Off-campus',
        interests: ['Data Science', 'Basketball', 'Cooking'],
        image_url: 'https://ui-avatars.com/api/?name=Jamal+Ahmed',
    },
    {
        name: 'Sophia Chen',
        email: 'sophia.chen@example.com',
        major: 'Biomedical Engineering',
        year: 'Freshman',
        location: 'East Campus',
        interests: ['Medical Research', 'Violin', 'Volunteering'],
        image_url: 'https://ui-avatars.com/api/?name=Sophia+Chen',
    },
    {
        name: 'Ethan Goldstein',
        email: 'ethan.goldstein@example.com',
        major: 'Political Science',
        year: 'Junior',
        location: 'South Campus',
        interests: ['Debate', 'Model UN', 'Writing'],
        image_url: 'https://ui-avatars.com/api/?name=Ethan+Goldstein',
    },
    {
        name: 'Zoe Nguyen',
        email: 'zoe.nguyen@example.com',
        major: 'Graphic Design',
        year: 'Senior',
        location: 'Art District',
        interests: ['Digital Art', 'Photography', 'Yoga'],
        image_url: 'https://ui-avatars.com/api/?name=Zoe+Nguyen',
    },
    {
        name: 'Lucas Fernandez',
        email: 'lucas.fernandez@example.com',
        major: 'Mechanical Engineering',
        year: 'Sophomore',
        location: 'Engineering Complex',
        interests: ['3D Printing', 'Cycling', 'Renewable Energy'],
        image_url: 'https://ui-avatars.com/api/?name=Lucas+Fernandez',
    },
];

export async function up(db: Kysely<any>) {
    for (const friend of sampleFriends) {
        await db
            .insertInto('users')
            .values({
                email: friend.email,
                name: friend.name,
                major: friend.major,
                year: friend.year,
                location: friend.location,
                interests: friend.interests,
                image_url: friend.image_url,
            })
            .execute();
    }
}

export async function down(db: Kysely<any>) {
    await sql`
        DELETE FROM users
    `.execute(db);
}
