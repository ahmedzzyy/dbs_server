# DBS Project Server

A Fastify‑based API server for a Movie Management System. This project provides RESTful endpoints for movies, users, reviews, watchlists, and actors, along with JWT‑based authentication and Swagger documentation.

---

## Table of Contents

- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [NPM Scripts](#npm-scripts)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Testing & Quality Assurance](#testing--quality-assurance)

---

## Features

- **Fastify Server:** High-performance API server built with [Fastify](https://fastify.dev/docs/latest/Guides/Getting-Started/).
- **Database Integration:** PostgreSQL connection using `pg` and migration support with `node-pg-migrate`.
- **Authentication:** JWT‑based authentication.
- **API Documentation:** Swagger and Swagger‑UI integration for interactive API docs.
- **Linting & Formatting:** ESLint and Prettier integration.

---

## Setup & Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/ahmedzzyy/dbs_server.git
    cd dbs_server
    ```
2. **Install Dependencies:**

    ```bash
    npm install
    ```
3. **Setup Environment Variables:**
- Copy the [`example.env`](./example.env) file to `.env`

---

## Environment Configuration
- Edit `.env` to set:
    - `PORT`: Port for the API (default is `5500`).
    - `FRONTEND_LOCAL_URL`: URL for CORS configuration.
    - `DATABASE_URL`: PostgreSQL connection string.
        - Jaise `postgres://someuser:somepassword@somehost:5432/somedatabase`
    - `JWT_SECRET`: Secret key for signing JWT tokens.

- Example Configuration
    ```env
    PORT=5500
    FRONTEND_LOCAL_URL=http://localhost:3000
    DATABASE_URL=postgres://username:password@localhost:5432/dbs_movies
    JWT_SECRET=your-secret-key
    ```

*Note: The database must already exist and be accessible via the provided connection string.*

---

## NPM Scripts

- **Start Server:**
  ```bash
  npm run start
  ```
- **Development Mode (with watch mode):**
  ```bash
  npm run dev
  ```
- **Linting:** (Javascript errors ke liye)
  ```bash
  npm run lint
  ```
- **Prettier Format Check:** (formatting check ke liye)
  ```bash
  npm run check
  ```
- **Auto Format with Prettier:** (automatic formatting ke liye)
  ```bash
  npm run format
  ```
- **Database Migrations:**
  - Run migrations (up or down):
    ```bash
    npm run migrate <up|down>
    ```
  - Create a new migration:
    ```bash
    npm run migrate:create <migration-name>
    ```

---

## API Endpoints

The server registers several groups of endpoints, all prefixed with `/api`:

- **Movies:** Endpoints to manage movie data.
- **Users:** Endpoints for user registration, login, and profile management.
- **Reviews:** Endpoints to submit and retrieve reviews.
- **Watchlist:** Endpoints to manage user watchlists.
- **Actors:** Endpoints to manage actor information.

For detailed API documentation, run the server and navigate to:
```
http://localhost:5500/docs
```
This Swagger‑UI interface provides interactive API details including request/response formats and parameter descriptions.

---

## Usage Examples

### Starting the Server

After configuring `.env` file, simply run:

```bash
npm run start
```

A log message indicating the server is listening is shown, e.g.:
```
Server listening on http://localhost:5500
```

### Making an Authenticated Request

1. **Login:**
   - POST to `/api/users/login` with credentials.
   - Receive a JWT token on successful authentication.

2. **Access Protected Endpoints:**
   - Include the JWT token in the `Authorization` header as:
     ```
     Authorization: Bearer <token>
     ```

---

## Testing & Quality Assurance

- **Unit Testing:**
  - (Will be implemented if needed)
- **Linting & Formatting:**
  - Use the provided NPM scripts to enforce code quality:
    ```bash
    npm run lint
    npm run check
    ```