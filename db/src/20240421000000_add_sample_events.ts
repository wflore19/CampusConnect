import { type Kysely } from 'kysely';

type Event = {
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  organization: string;
};
const sampleEvents: Event[] = [
  {
    title: "Sunday Service with Maryland Christian Fellowship",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Memorial Garden Chapel",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "MARYLAND CHRISTIAN FELLOWSHIP",
  },
  {
    title: "Sign up for an Alternative Break experience!",
    date: "Thursday, September 12",
    time: "12:00 PM",
    location: "Online",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Leadership & Community Service-Learning",
  },
  {
    title: "Maryland Bhangra Practices",
    date: "Sunday, November 19",
    time: "12:00 PM",
    location: "Adele Gladfelter Rehearsal Studio",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Maryland Bhangra",
  },
  {
    title: "Worship Service",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Stamp Margaret Brent 2123",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Oasis",
  },
  {
    title: "Pa'lante Latin Dance Company Performance Team Practice",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Terpzone Activity Room A",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Pa'lante Latin Dance Company",
  },
  {
    title: "Kairos Sunday Service",
    date: "Sunday, November 19",
    time: "11:00 AM",
    location: "Stamp Prince George's Room",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Kairos Christian Fellowship",
  },
  {
    title: "Chess Club Weekly Meeting",
    date: "Monday, November 20",
    time: "6:00 PM",
    location: "Stamp Student Union Room 1234",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "UMD Chess Club",
  },
  {
    title: "Intro to Python Workshop",
    date: "Tuesday, November 21",
    time: "4:00 PM",
    location: "Computer Science Building Room 1115",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Computer Science Department",
  },
  {
    title: "Terps Basketball Game",
    date: "Wednesday, November 22",
    time: "7:30 PM",
    location: "Xfinity Center",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Maryland Athletics",
  },
  {
    title: "Environmental Club Campus Cleanup",
    date: "Saturday, November 25",
    time: "10:00 AM",
    location: "McKeldin Mall",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "UMD Environmental Club",
    
  },
  {
    title: "Career Fair: STEM Industries",
    date: "Monday, November 27",
    time: "1:00 PM",
    location: "Stamp Grand Ballroom",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "University Career Center",

  },
  {
    title: "Mindfulness Meditation Session",
    date: "Tuesday, November 28",
    time: "5:30 PM",
    location: "Eppley Recreation Center",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "UMD Health Center",
  },
  {
    title: "International Food Festival",
    date: "Friday, December 1",
    time: "6:00 PM",
    location: "Nyumburu Amphitheater",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "International Student Association",
  },
  {
    title: "Hackathon: Build for Social Good",
    date: "Saturday, December 2",
    time: "9:00 AM",
    location: "Iribe Center",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "Technica",
  },
  {
    title: "A Cappella Showcase",
    date: "Sunday, December 3",
    time: "7:00 PM",
    location: "Clarice Smith Performing Arts Center",
    imageUrl: "https://random.imagecdn.app/400/400",
    organization: "UMD A Cappella Council",
  }
];

export async function up(db: Kysely<any>) {
  // Insert sample events
  for (const event of sampleEvents) {
    await db
      .insertInto('events')
      .values({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        image_url: event.imageUrl,
        organization: event.organization
      })
      .execute();
  }

  // Get all users and events
  const users = await db.selectFrom('users').select(['id', 'name']).execute();
  const events = await db.selectFrom('events').select('id').execute();

  // Create some random event attendances
  for (const event of events) {
    const attendees = users
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * users.length));

    for (const attendee of attendees) {
      await db
        .insertInto('event_attendees')
        .values({
          event_id: event.id,
          user_id: attendee.id
        })
        .execute();
    }
  }
}

export async function down(db: Kysely<any>) {
  // Remove all sample events and their attendees
  await db.deleteFrom('event_attendees').execute();
  await db.deleteFrom('events').execute();
}
