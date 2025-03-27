import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import "dotenv/config";

import pool, { closeDB, connectDB } from "./db/connect.js";
import { authenticateRequest } from "./utils/authUtil.js";

const fastify = Fastify({
  logger: true,
});

// Auth
fastify.decorate("authenticate", authenticateRequest);

// DB Setup
fastify.decorate("db", pool);

await connectDB();

const shutDown = async () => {
  await closeDB();
  process.exit(0);
};

fastify.addHook("onClose", async (_instance, done) => {
  await closeDB();
  done();
});

// CORS
await fastify.register(cors, {
  origin: process.env.FRONTEND_LOCAL_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
});

// Swagger
await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API for Movie Management System",
      description: "Created for DBS Project",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5500}`,
        description: "Local Development Server",
      },
    ],
    tags: [
      { name: "movies", description: "Movie related end-points" },
      { name: "users", description: "users related end-points" },
      { name: "review", description: "Review related end-points" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          name: "authorization",
          type: "apiKey",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer token for JWT Authentication",
          in: "header",
        },
      },
    },
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  staticCSP: true,
});

// Controllers / Routes
await Promise.all([
  fastify.register(await import("./controllers/movies.js"), { prefix: "/api" }),
  fastify.register(await import("./controllers/users.js"), { prefix: "/api" }),
  fastify.register(await import("./controllers/review.js"), { prefix: "/api" }),
]);

// Server Run
const PORT = process.env.PORT || 5500;
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server : Listening on ${address}`);
});

// Graceful Exit from fastify and pg
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
