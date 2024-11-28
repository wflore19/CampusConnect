# CampusConnect: Building Community on Campus

CampusConnect is a web app designed to foster an online community on university
campuses. It provides a platform for students to stay up to date with the latest
news. It also allows them to connect with friends and events, making it easier
to find things to do.

## Tech Stack

-   Typescript
-   React
-   Radix Themes UI Component
-   Remix.run
-   PostgreSQL
-   Redis
-   Google OAuth2
-   DigitalOcean (Droplet, Spaces)
-   Nginx
-   PM2

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

### Database Management

The project uses Kysely as an type-safe SQL query builder with migrations for
schemas (tables, columns, etc.). management.

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on contributing to
this project.
