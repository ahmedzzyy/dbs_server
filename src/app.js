import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

const fastify = Fastify({
  logger: true,
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
