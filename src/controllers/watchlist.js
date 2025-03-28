import { getMoviesByWatchlistID } from "../services/movieService.js";
import {
  addMovieToWatchlist,
  createWatchlist,
  getWatchlistsByUserID,
  removeMovieFromWatchlist,
} from "../services/watchlistService.js";

/**
 * Watchlist routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function watchlistController(fastify, _opts) {
  fastify.get(
    "/hello/watchlist",
    {
      schema: {
        description: "Testing endpoint for the watchlists controller.",
        summary: "Test watchlist endpoint",
        tags: ["watchlist"],
        response: {
          200: {
            description: "Returns the watchlist controller name.",
            type: "object",
            properties: {
              controller: { type: "string", example: "watchlist" },
            },
          },
        },
      },
    },
    function (_request, reply) {
      reply.send({ controller: "watchlist" });
    },
  );

  fastify.get(
    "/users/me/watchlists",
    {
      preValidation: fastify.authenticate,
      schema: {
        description: "Retrieves all watchlists for the authenticated user.",
        summary: "Get user's watchlists",
        tags: ["watchlist"],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "List of watchlists retrieved successfully.",
            type: "array",
            items: {
              type: "object",
              properties: {
                watchlist_id: { type: "number", example: 1 },
                watchlist_name: { type: "string", example: "Favorites" },
              },
            },
          },
          401: {
            description: "Authentication error",
            type: "object",
            properties: {
              error: { type: "string", example: "Authentication required" },
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

      try {
        const watchlists = await getWatchlistsByUserID(fastify.db, userId);

        reply.send(watchlists);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.get(
    "/users/me/watchlists/:watchlist_id",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Retrieves movies for a specific watchlist belonging to the authenticated user.",
        summary: "Get movies by watchlist ID",
        tags: ["watchlist"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            watchlist_id: {
              type: "number",
              description: "ID of the watchlist",
            },
          },
          required: ["watchlist_id"],
        },
        response: {
          200: {
            description: "Movies retrieved successfully.",
            type: "array",
            items: {
              type: "object",
              properties: {
                movieId: { type: "number", example: 101 },
                title: { type: "string", example: "Inception" },
                genre: { type: "string", example: "Sci-Fi" },
                director: { type: "string", example: "Christopher Nolan" },
                release_year: { type: "number", example: 2010 },
                language: { type: "string", example: "English" },
              },
            },
          },
          401: {
            description: "Authentication error",
            type: "object",
            properties: {
              error: { type: "string", example: "Authentication required" },
            },
          },
          404: {
            description: "Watchlist not found for the current user.",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Watchlist not found for the current user",
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
      const { watchlist_id } = request.params;

      try {
        const userWatchlists = await getWatchlistsByUserID(fastify.db, userId);

        const watchlistBelongs = userWatchlists.find(
          (watchlist) =>
            Number(watchlist.watchlist_id) === Number(watchlist_id),
        );

        if (!watchlistBelongs) {
          return reply
            .code(404)
            .send({ error: "Watchlist not found for the current user" });
        }

        const movies = await getMoviesByWatchlistID(fastify.db, watchlist_id);

        reply.send(movies);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.post(
    "/users/me/watchlists",
    {
      preValidation: fastify.authenticate,
      schema: {
        description: "Creates a new watchlist for the authenticated user.",
        summary: "Create watchlist",
        tags: ["watchlist"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "Name of the watchlist",
            },
          },
        },
        response: {
          201: {
            description: "Watchlist created successfully.",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Watchlist created successfully",
              },
              watchlist: {
                type: "object",
                properties: {
                  watchlist_id: { type: "number", example: 1 },
                  watchlist_name: { type: "string", example: "Favorites" },
                  user_id: { type: "number", example: 123 },
                },
              },
            },
          },
          401: {
            description: "Authentication error",
            type: "object",
            properties: {
              error: { type: "string", example: "Authentication required" },
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
      const { name } = request.body;

      try {
        const watchlist = await createWatchlist(fastify.db, userId, { name });

        reply
          .code(201)
          .send({ message: "Watchlist created successfully", watchlist });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.post(
    "/users/me/watchlists/:watchlist_id",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Adds a movie to the specified watchlist for the authenticated user.",
        summary: "Add movie to watchlist",
        tags: ["watchlist"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            watchlist_id: {
              type: "number",
              description: "ID of the watchlist",
            },
          },
          required: ["watchlist_id"],
        },
        querystring: {
          type: "object",
          properties: {
            movieId: {
              type: "number",
              description: "ID of the movie to add",
            },
          },
          required: ["movieId"],
        },
        response: {
          201: {
            description: "Movie added to watchlist successfully.",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Movie added to watchlist successfully",
              },
              updatedWatchlist: {
                type: "object",
                properties: {
                  watchlistId: { type: "number", example: 1 },
                  watchlistName: { type: "string", example: "Favorites" },
                  movies: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        movieId: { type: "number", example: 101 },
                        title: { type: "string", example: "Inception" },
                        genre: { type: "string", example: "Sci-Fi" },
                        director: {
                          type: "string",
                          example: "Christopher Nolan",
                        },
                        release_year: { type: "number", example: 2010 },
                        language: { type: "string", example: "English" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Authentication error",
            type: "object",
            properties: {
              error: { type: "string", example: "Authentication required" },
            },
          },
          404: {
            description: "Watchlist not found for the current user.",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Watchlist not found for the current user",
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
      const { watchlist_id } = request.params;
      const { movieId } = request.query;

      try {
        const userWatchlists = await getWatchlistsByUserID(fastify.db, userId);

        const watchlistBelongs = userWatchlists.find(
          (watchlist) =>
            Number(watchlist.watchlist_id) === Number(watchlist_id),
        );

        if (!watchlistBelongs) {
          return reply
            .code(404)
            .send({ error: "Watchlist not found for the current user" });
        }

        const updatedWatchlist = await addMovieToWatchlist(
          fastify.db,
          watchlist_id,
          movieId,
        );

        reply.code(201).send({
          message: "Movie added to watchlist successfully",
          updatedWatchlist,
        });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.delete(
    "/users/me/watchlist/:watchlist_id/movies/:movie_id",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Removes a movie from the specified watchlist for the authenticated user.",
        summary: "Remove movie from watchlist",
        tags: ["watchlist"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            watchlist_id: {
              type: "number",
              description: "ID of the watchlist",
            },
            movie_id: {
              type: "number",
              description: "ID of the movie to remove",
            },
          },
          required: ["watchlist_id", "movie_id"],
        },
        response: {
          200: {
            description: "Movie removed successfully from watchlist.",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Movie removed successfully from watchlist",
              },
            },
          },
          401: {
            description: "Authentication error",
            type: "object",
            properties: {
              error: { type: "string", example: "Authentication required" },
            },
          },
          404: {
            description: "Watchlist or movie not found.",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Movie not found in this watchlist",
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
      const { watchlist_id, movie_id } = request.params;

      try {
        const userWatchlists = await getWatchlistsByUserID(fastify.db, userId);

        const watchlistBelongs = userWatchlists.find(
          (watchlist) =>
            Number(watchlist.watchlist_id) === Number(watchlist_id),
        );

        if (!watchlistBelongs) {
          return reply
            .code(404)
            .send({ error: "Watchlist not found for the current user" });
        }

        const success = await removeMovieFromWatchlist(
          fastify.db,
          watchlist_id,
          movie_id,
        );

        if (!success) {
          return reply
            .code(404)
            .send({ error: "Movie not found in this watchlist" });
        }

        reply.send({ message: "Movie removed successfully from watchlist" });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );
}
