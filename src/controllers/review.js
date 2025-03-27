import { createReview, deleteReviewById } from "../services/reviewService.js";

/**
 * Review Routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function reviewController(fastify, _opts) {
  fastify.get(
    "/reviews",
    {
      schema: {
        description: "Testing endpoint for the reviews controller.",
        summary: "Test reviews endpoint",
        tags: ["review"],
        response: {
          200: {
            description: "Returns the reviews controller name.",
            type: "object",
            properties: {
              controller: { type: "string", example: "reviews" },
            },
          },
        },
      },
    },
    function (_request, reply) {
      reply.send({ controller: "reviews" });
    },
  );

  fastify.post(
    "/movies/:movie_id/reviews",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Creates a new review for a movie by an authenticated user. The rating must be between 1 and 10.",
        summary: "Create review",
        tags: ["review"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            movie_id: {
              type: "integer",
              description: "ID of the movie being reviewed",
            },
          },
          required: ["movie_id"],
        },
        body: {
          type: "object",
          required: ["rating"],
          properties: {
            rating: {
              type: "number",
              description: "Rating between 1 and 10",
              minimum: 1,
              maximum: 10,
            },
            comment: {
              type: "string",
              description: "Optional comment for the review",
            },
          },
        },
        response: {
          201: {
            description: "Review created successfully.",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Review created successfully.",
              },
              review: {
                type: "object",
                properties: {
                  review_id: { type: "integer" },
                  rating: { type: "number" },
                  comment: { type: "string" },
                  movie_id: { type: "integer" },
                },
              },
            },
          },
          400: {
            description:
              "Bad request - rating out of bounds or missing required fields.",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Rating should be between 1 and 10",
              },
            },
          },
          401: {
            description: "Unauthorized - Authentication errors",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Authentication required",
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
    async (request, reply) => {
      const userId = request.user.id;
      const { movie_id } = request.params;

      const { rating, comment } = request.body;
      if (rating < 1 || rating > 10) {
        return reply.code(400).send({
          error: "Rating should be between 1 and 10",
        });
      }

      try {
        const review = await createReview(fastify.db, userId, movie_id, {
          rating,
          comment,
        });

        reply.code(201).send({
          message: "Review created successfully.",
          review,
        });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.delete(
    "/movies/:movie_id/reviews/:review_id",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Deletes a review by its ID for a given movie by an authenticated user.",
        summary: "Delete review",
        tags: ["review"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            movie_id: {
              type: "integer",
              description: "ID of the movie whose review is to be deleted",
            },
            review_id: {
              type: "integer",
              description: "ID of the review to delete",
            },
          },
          required: ["movie_id", "review_id"],
        },
        response: {
          200: {
            description: "Review deleted successfully.",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Review deleted successfully",
              },
            },
          },
          401: {
            description: "Unauthorized - Authentication errors",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Authentication required",
              },
            },
          },
          404: {
            description: "Review not found",
            type: "object",
            properties: {
              error: { type: "string", example: "Review not found" },
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
      const userId = request.user.id;
      const { movie_id, review_id } = request.params;

      try {
        const success = await deleteReviewById(
          fastify.db,
          userId,
          movie_id,
          review_id,
        );

        if (!success) {
          return reply.code(404).send({ error: "Review not found" });
        }

        reply.send({ message: "Review deleted successfully" });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );
}
