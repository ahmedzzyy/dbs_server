/**
 * User routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function movieController(fastify, _opts) {
  fastify.get("/movies", function (_request, reply) {
    reply.send({ controller: "movies" });
  });
}
