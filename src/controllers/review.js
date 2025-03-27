import { createReview, deleteReviewById } from "../services/reviewService.js";

/**
 * Review Routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function reviewController(fastify, _opts) {
  fastify.get("/reviews", function (_request, reply) {
    reply.send({ controller: "reviews" });
  });

  fastify.post(
    "/movies/:movie_id/reviews",
    { preValidation: fastify.authenticate },
    async (request, reply) => {
      const userId = request.user.id;
      const { movie_id } = request.params;

      const { rating, comment } = request.body;
      if (rating < 1 || rating > 10) {
        return reply.code(400).send({
          error: "Rating should be between 0 and 1",
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
    { preValidation: fastify.authenticate },
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
