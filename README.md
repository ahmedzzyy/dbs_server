# DBS Project Server

## ENV checklist

- Copy [`example.env`](./example.env) to make a `.env` file.
- `PORT` points to the PORT to use for the API endpoint, if not specified `5500` is used.
- `FRONTEND_LOCAL_URL` points to frontend URL for CORS configuration if any
- `DATABASE_URL` points to the PostgreSQL connection string of the particular database
    - Make sure the database is already created
    - For example, `postgres://someuser:somepassword@somehost:5432/somedatabase`
    - Jaise `postgres://postgres:somepassword@localhost:5432/dbs_movies`
- `JWT_SECRET` points to the secret key to sign JWT payloads

## NPM Commands Checklist
- Running the fastify server
```bash
npm run start
```

- Run ESLint checks (Javascript errors ke liye)
```bash
npm run lint
```

- Run Prettier format checks (formatting check ke liye)
```bash
npm run check
```

- Run Prettier to format (automatically formatting ke liye)
```bash
npm run format
```

- Run migration or undo
```bash
npm run migrate <up / down>
```

- Run migration or undo
```bash
npm run migrate:create <migration-name>
```