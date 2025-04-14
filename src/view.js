/**
 * All static views
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function reviewController(fastify, _opts) {
  fastify.get("/", function (request, reply) {
    reply.sendFile("home.html");
  });

  fastify.get("/actor", function (request, reply) {
    reply.sendFile("actor.html");
  });

  fastify.get("/login", function (request, reply) {
    reply.sendFile("login.html");
  });

  fastify.get("/movies", function (request, reply) {
    reply.sendFile("movies.html");
  });

  fastify.get("/ratings", function (request, reply) {
    reply.sendFile("ratings.html");
  });
}
