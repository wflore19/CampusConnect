import { type Transaction } from 'kysely';

import { db } from '../shared/db';
import { type DB } from '../shared/types';
import { migrate } from '../use-cases/migrate';
import { truncate } from '../use-cases/truncate';

async function main() {
  try {
    await migrate({ db });
    console.log('(1/3) Ran migrations and initialized tables. ✅');

    await db.transaction().execute(async (trx) => {
      await truncate(trx);
      await seed(trx);
      });
    await seed2()

    console.log('(2/3) Wiped all data. ✅');
    console.log('(3/3) Seeded the database. ✅');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

async function seed(trx: Transaction<DB>) {  
  await trx
    .insertInto('events')
    .values([
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
    ])
    .execute();

  await trx
    .insertInto('users')
    .values([
      {
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        major: "Environmental Science",
        year: "Junior",
        location: "West Campus",
        interests: ["Sustainability", "Hiking", "Photography"],
        imageUrl: "https://ui-avatars.com/api/?name=Alex+Rivera"
      },
      {
        name: "Mia Thompson",
        email: "mia.thompson@example.com",
        major: "Computer Engineering",
        year: "Sophomore",
        location: "North Campus",
        interests: ["Robotics", "AI", "Rock Climbing"],
        imageUrl: "https://ui-avatars.com/api/?name=Mia+Thompson"
      },
      {
        name: "Jamal Ahmed",
        email: "jamal.ahmed@example.com",
        major: "Business Analytics",
        year: "Senior",
        location: "Off-campus",
        interests: ["Data Science", "Basketball", "Cooking"],
        imageUrl: "https://ui-avatars.com/api/?name=Jamal+Ahmed"
      },
      {
        name: "Sophia Chen",
        email: "sophia.chen@example.com",
        major: "Biomedical Engineering",
        year: "Freshman",
        location: "East Campus",
        interests: ["Medical Research", "Violin", "Volunteering"],
        imageUrl: "https://ui-avatars.com/api/?name=Sophia+Chen"
      },
      {
        name: "Ethan Goldstein",
        email: "ethan.goldstein@example.com",
        major: "Political Science",
        year: "Junior",
        location: "South Campus",
        interests: ["Debate", "Model UN", "Writing"],
        imageUrl: "https://ui-avatars.com/api/?name=Ethan+Goldstein"
      },
      {
        name: "Zoe Nguyen",
        email: "zoe.nguyen@example.com",
        major: "Graphic Design",
        year: "Senior",
        location: "Art District",
        interests: ["Digital Art", "Photography", "Yoga"],
        imageUrl: "https://ui-avatars.com/api/?name=Zoe+Nguyen"
      },
      {
        name: "Lucas Fernandez",
        email: "lucas.fernandez@example.com",
        major: "Mechanical Engineering",
        year: "Sophomore",
        location: "Engineering Complex",
        interests: ["3D Printing", "Cycling", "Renewable Energy"],
        imageUrl: "https://ui-avatars.com/api/?name=Lucas+Fernandez"
      }
    ])
    .execute();
}

async function seed2() {
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
        .insertInto('eventAttendees')
        .values({
          eventId: event.id,
          userId: attendee.id
        })
        .execute();
    }
  }

  // Create some friendships
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (Math.random() < 0.5) { // 50% chance of friendship
        await db
          .insertInto('friendships')
          .values({
            userId: users[i].id,
            friendId: users[j].id
          })
          .execute();
      }
    }
  }
}

main();
