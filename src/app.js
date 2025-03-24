import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

import { closeDB, connectDB } from "./db/connect.js";

const fastify = Fastify({
  logger: true,
});

// DB Setup
await connectDB();

const shutDown = async () => {
  await closeDB();
  process.exit(0);
}

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

// Controllers / Routes
fastify.get("/", function (_request, reply) {
  reply.send({ hello: "world" });
});

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