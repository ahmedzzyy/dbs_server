import { getCastByMovieID } from "../services/actorService.js";
import {
  createMovie,
  deleteMovieById,
  getMovieById,
  getMovies,
  updateMovieById,
} from "../services/movieService.js";
import { getReviewsByMovieID } from "../services/reviewService.js";

/**
 * Movie routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function movieController(fastify, _opts) {
  fastify.get(
    "/hello/movies",
    {
      schema: {
        description: "Testing endpoint for the movies controller.",
        summary: "Test movies endpoint",
        tags: ["movies"],
        response: {
          200: {
            description: "Returns the movies controller name.",
            type: "object",
            properties: {
              controller: { type: "string", example: "movies" },
            },
          },
        },
      },
    },
    function (_request, reply) {
      reply.send({ controller: "movies" });
    },
  );

  fastify.get(
    "/movies",
    {
      schema: {
        description:
          "Retrieves a list of movies with optional pagination, sorting, and filtering.",
        summary: "List movies",
        tags: ["movies"],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1, description: "Page number" },
            pageSize: {
              type: "number",
              default: 10,
              description: "Number of movies per page",
            },
            sortBy: { type: "string", description: "Field to sort by" },
            sortDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              default: "ASC",
              description: "Sort direction",
            },
            // Additional filters can be provided as query parameters
          },
          additionalProperties: { type: "string" },
        },
        response: {
          200: {
            description: "A paginated list of movies",
            type: "object",
            properties: {
              movies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Movie_ID: { type: "integer" },
                    Title: { type: "string" },
                    Genre: { type: "string" },
                    Director: { type: "string" },
                    Release_Year: { type: "string" },
                    Language: { type: "string" },
                  },
                },
              },
              page: { type: "number" },
              pageSize: { type: "number" },
              totalCount: { type: "number" },
              totalPages: { type: "number" },
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
      const {
        page = 1,
        pageSize = 10,
        sortBy,
        sortDirection,
        ...filters
      } = request.query;

      try {
        const movies = await getMovies(
          fastify.db,
          Number(page),
          Number(pageSize),
          {
            sortBy,
            sortDirection,
            filters,
          },
        );

        reply.send(movies);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.get(
    "/movies/:movie_id",
    {
      schema: {
        description:
          "Retrieves a movie by its ID. If found, returns movie details along with its reviews.",
        summary: "Get movie by ID",
        tags: ["movies"],
        params: {
          type: "object",
          properties: {
            movie_id: {
              type: "integer",
              description: "ID of the movie",
            },
          },
          required: ["movie_id"],
        },
        response: {
          200: {
            description: "Movie found",
            type: "object",
            properties: {
              Movie_ID: { type: "integer" },
              Title: { type: "string" },
              Genre: { type: "string" },
              Director: { type: "string" },
              Release_Year: { type: "string" },
              Language: { type: "string" },
              reviews: {
                type: "array",
                description: "List of reviews for the movie",
                items: {
                  type: "object",
                  properties: {
                    review_id: { type: "integer" },
                    user_id: { type: "integer" },
                    Username: { type: "string" },
                    rating: { type: "number" },
                    comment: { type: "string" },
                  },
                },
              },
              cast: {
                type: "array",
                items: {
                  type: "object",
                  description: "Cast of the specified movie",
                  properties: {
                    Actor_ID: { type: "number" },
                    Actor_Name: { type: "string" },
                    Country: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Movie not found",
            type: "object",
            properties: {
              error: { type: "string", example: "Movie not found" },
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
      const { movie_id } = request.params;

      try {
        const movie = await getMovieById(fastify.db, movie_id);

        if (!movie) {
          return reply.code(404).send({ error: "Movie not found" });
        }

        // TODO add fetch awards aise movies.awards = []
        const reviews = await getReviewsByMovieID(fastify.db, movie_id);
        movie.reviews = reviews;

        const cast = await getCastByMovieID(fastify.db, movie_id);
        movie.cast = cast;

        reply.send(movie);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.post(
    "/movies",
    {
      schema: {
        description: "Creates a new movie.",
        summary: "Create movie",
        tags: ["movies"],
        body: {
          type: "object",
          required: ["title", "genre", "director", "releaseYear", "language"],
          properties: {
            title: { type: "string", description: "Title of the movie" },
            genre: { type: "string", description: "Genre of the movie" },
            director: { type: "string", description: "Director of the movie" },
            releaseYear: {
              type: "string",
              description: "Release year of the movie",
            },
            language: { type: "string", description: "Original language" },
          },
        },
        response: {
          201: {
            description: "Movie created successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Movie created successfully",
              },
              movie: {
                type: "object",
                properties: {
                  Movie_ID: { type: "integer" },
                  Title: { type: "string" },
                  Genre: { type: "string" },
                  Director: { type: "string" },
                  Release_Year: { type: "string" },
                  Language: { type: "string" },
                },
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
      const { title, genre, director, releaseYear, language } = request.body;

      try {
        const movie = await createMovie(fastify.db, {
          title,
          genre,
          director,
          releaseYear,
          language,
        });
        reply.code(201).send({ message: "Movie created successfully", movie });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.put(
    "/movies/:movie_id",
    {
      schema: {
        description:
          "Updates a movie by its ID. At least one field must be provided.",
        summary: "Update movie",
        tags: ["movies"],
        params: {
          type: "object",
          properties: {
            movie_id: {
              type: "integer",
              description: "ID of the movie to update",
            },
          },
          required: ["movie_id"],
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            genre: { type: "string" },
            director: { type: "string" },
            releaseYear: { type: "string" },
            language: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Movie updated successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Movie updated successfully.",
              },
              movie: {
                type: "object",
                properties: {
                  Movie_ID: { type: "integer" },
                  Title: { type: "string" },
                  Genre: { type: "string" },
                  Director: { type: "string" },
                  Release_Year: { type: "string" },
                  Language: { type: "string" },
                },
              },
            },
          },
          400: {
            description: "Bad request - no valid fields provided for update",
            type: "object",
            properties: {
              error: {
                type: "string",
                example:
                  "At least one field (title, genre, director, releaseYear or language) must be provided for update",
              },
            },
          },
          404: {
            description: "Movie not found",
            type: "object",
            properties: {
              error: { type: "string", example: "Movie not found" },
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
      const { movie_id } = request.params;
      const { title, genre, director, releaseYear, language } = request.body;

      if (
        title === undefined &&
        genre === undefined &&
        director === undefined &&
        releaseYear === undefined &&
        language === undefined
      ) {
        return reply.code(400).send({
          error:
            "At least one field (title, genre, director, releaseYear or language) must be provided for update",
        });
      }

      try {
        const movie = await updateMovieById(fastify.db, movie_id, {
          title,
          genre,
          director,
          releaseYear,
          language,
        });
        if (!movie) {
          return reply.code(404).send({ error: "Movie not found" });
        }

        reply.send({ message: "Movie updated successfully.", movie });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.delete(
    "/movies/:movie_id",
    {
      schema: {
        description: "Deletes a movie by its ID.",
        summary: "Delete movie",
        tags: ["movies"],
        params: {
          type: "object",
          properties: {
            movie_id: {
              type: "integer",
              description: "ID of the movie to delete",
            },
          },
          required: ["movie_id"],
        },
        response: {
          200: {
            description: "Movie deleted successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Movie deleted successfully.",
              },
            },
          },
          404: {
            description: "Movie not found",
            type: "object",
            properties: {
              error: { type: "string", example: "Movie not found" },
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
      const { movie_id } = request.params;

      try {
        const success = await deleteMovieById(fastify.db, movie_id);

        if (!success) {
          return reply.code(404).send({ error: "Movie not found" });
        }

        reply.send({ message: "Movie deleted successfully." });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );
}
