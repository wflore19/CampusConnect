# CampusConnect: Building Community on Campus

CampusConnect is a web app designed to foster an online community on university
campuses. It provides a platform for students to stay up to date with the latest
news. It also allows them to connect with friends and events, making it easier
to find things to do.

## Tech Stack

-   Frontend: React, Radix Themes UI library
-   Backend: Remix framework
-   Database: PostgreSQL, Redis
-   Authentication: Google OAuth2
-   Cloud Services: DigitalOcean, AWS S3
-   Languages: TypeScript

## Project Structure

### Routes

The application consists of the following main routes:

-   Public Routes:

    -   Ex. Login (`_public.login.tsx`)

-   Protected Routes:

    -   Ex. Home (`_dashboard.home.tsx`)

-   API Routes:

    -   Ex. Friend Request Handling (`api.friend-request.$id.tsx`)

### Modules

The application is organized into modules:

-   Ex. Users (`modules/users/`)

Each module typically contains core functionality, queries, types, and UI
components.

### Utilities

-   Authentication (`utils/auth.ts`)
-   Session Management (`utils/session.server.ts`)

### Database

The project uses Kysely as an SQL query builder with migrations for schema
management. Key migrations include:

-   Table additions and modifications, and column additions and changes

## Core Features

-   User Profiles
-   Friend System

## Prerequisites

To run the application, you will need the following:

1.  Node.js 20.x
2.  PostgreSQL 17.x
3.  Redis 7.x
4.  Google OAuth2 credentials (Free)
5.  DigitalOcean or AWS S3 credentials (GitHub Student Developer Pack)

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn`
3. Set up environment variables (copy `.env.example` to `.env` and fill in the
   values)
4. Run database migrations: `yarn migrate`
5. Start the development server: `yarn dev`

## Deployment

Deployment instructions can be found in `docs/deploy.md`.
