# CampusConnect: Building Community on Campus

CampusConnect is a web application designed to combat loneliness and foster
meaningful connections on university campuses. It provides a platform for
students to find study buddies, event companions, and friends who share their
interests within their university community.

## Tech Stack

-   Frontend: React
-   Backend: Node.js with Remix framework
-   Database: PostgreSQL
-   Authentication: Google OAuth2
-   Cloud Services: DigitalOcean, AWS S3
-   Languages: TypeScript

## Project Structure

### Routes

The application consists of the following main routes:

-   Public Routes:

    -   Login (`_public.login.tsx`)
    -   Signup (`_public.signup.tsx`)
    -   Privacy Policy (`_public.privacy-policy.tsx`)
    -   Home (`_public._index.tsx`)

-   Protected Routes:

    -   Home (`_dashboard.home.tsx`)
    -   Events List (`_dashboard.events._index.tsx`)
    -   Single Event View (`_dashboard.event.$id.tsx`)
    -   Friends List (`_dashboard.friends.tsx`)
    -   User Profile (`_dashboard.profile._index.tsx`)
    -   Other User's Profile (`_dashboard.user.$id.tsx`)
    -   Users List (`_dashboard.users.tsx`)

-   API Routes:
    -   Friend Request Handling (`api.friend-request.$id.tsx`)
    -   Google OAuth (`oauth.google.tsx`)
    -   Logout (`logout.tsx`)

### Modules

The application is organized into modules:

-   Users (`modules/users/`)
-   Friends (`modules/friends/`)
-   Events (`modules/events/`)

Each module typically contains core functionality, types, and UI components.

### Utilities

-   Authentication (`utils/auth.ts`)
-   Session Management (`utils/session.server.ts`)
-   Environment Variables (`utils/env.ts`)
-   S3 Configuration (`utils/s3-config.server.ts`)
-   CSS Utilities (`utils/cx.ts`)

### Database

The project uses Kysely as an SQL query builder with migrations for schema
management. Key migrations include:

-   User table structure changes
-   Event table modifications
-   Friend request system implementation

## Core Features

-   User Authentication (Google OAuth)
-   Event Management (Create, Search, Register)
-   User Profiles
-   Friend System

## Prerequisites

To run the application, you will need the following:

1.  Node.js 20.x
2.  PostgreSQL 17.x
3.  Google OAuth2 credentials (Free)
4.  DigitalOcean or AWS S3 credentials (GitHub Student Developer Pack)

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn`
3. Set up environment variables (copy `.env.example` to `.env` and fill in the
   values)
4. Run database migrations: `yarn migrate`
5. Start the development server: `yarn dev`

## Deployment

Deployment instructions can be found in `docs/deploy.md`.
