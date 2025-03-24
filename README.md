# DBS Project Server

## ENV checklist

- Copy [`example.env`](./example.env) to make a `.env` file.
- PORT points to the PORT to use for the API endpoint, if not specified `5500` is used.
- FRONTEND_LOCAL_URL points to frontend URL for CORS configuration if any
- PG_USER should point to PostgreSQL username to use
- PG_HOST should point to PostgreSQL host to use
- PG_DB should point to PostgreSQL database to use (should already be created)
- PG_PASSWORD should point to PostgreSQL password of the username provided
- PG_PORT should point to port on which PostgreSQL is running

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