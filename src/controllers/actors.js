import { getActorByID, getActors } from "../services/actorService.js";

/**
 * Actor Routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function reviewController(fastify, _opts) {
  fastify.get(
    "/hello/actors",
    {
      schema: {
        description: "Testing endpoint for the actors controller.",
        summary: "Test actors endpoint",
        tags: ["actor"],
        response: {
          200: {
            description: "Returns the actors controller name.",
            type: "object",
            properties: {
              controller: { type: "string", example: "actors" },
            },
          },
        },
      },
    },
    function (_request, reply) {
      reply.send({ controller: "actors" });
    },
  );

  fastify.get(
    "/actors/:actor_id",
    {
      schema: {
        description: "Retrieves an actor by its ID.",
        summary: "Get actor by ID",
        tags: ["actor"],
        params: {
          type: "object",
          properties: {
            actor_id: {
              type: "number",
              description: "ID of the actor",
            },
          },
          required: ["actor_id"],
        },
        response: {
          200: {
            description: "Actor found",
            type: "object",
            properties: {
              actor_id: { type: "number", example: 1 },
              actor_name: { type: "string", example: "John Doe" },
              country: { type: "string", example: "USA" },
              // You can add more properties as needed
            },
          },
          404: {
            description: "Actor not found",
            type: "object",
            properties: {
              error: { type: "string", example: "Actor not found" },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string", example: "<Server Error>" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { actor_id } = request.params;

      try {
        const actor = await getActorByID(fastify.db, actor_id);

        reply.code(200).send(actor);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.get(
    "/actors",
    {
      schema: {
        description: "Retrieves a list of actors.",
        summary: "List actors",
        tags: ["actor"],
        response: {
          200: {
            description: "A list of actors",
            type: "array",
            items: {
              type: "object",
              properties: {
                actor_id: { type: "number", example: 1 },
                actor_name: { type: "string", example: "John Doe" },
                country: { type: "string", example: "USA" },
                // Additional actor properties can be defined here
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string", example: "<Server Error>" },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      try {
        const actors = await getActors(fastify.db);

        reply.code(200).send(actors);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );
}
