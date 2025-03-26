import {
  createMovie,
  deleteMovieById,
  getMovieById,
  getMovies,
  updateMovieById,
} from "../services/movieService.js";

/**
 * User routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function movieController(fastify, _opts) {
  fastify.get("/hello/movies", function (_request, reply) {
    reply.send({ controller: "movies" });
  });

  fastify.get("/movies", async (request, reply) => {
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
  });

  fastify.get("/movies/:movie_id", async (request, reply) => {
    const { movie_id } = request.params;

    try {
      const movie = await getMovieById(fastify.db, movie_id);

      if (!movie) {
        return reply.code(404).send({ error: "Movie not found" });
      }

      // TODO add fetch cast aise movies.cast = []
      // TODO add fetch awards aise movies.awards = []
      // TODO add fetch reviews aise movies.reviews = []

      reply.send(movie);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.post("/movies", async (request, reply) => {
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
  });

  fastify.put("/movies/:movie_id", async (request, reply) => {
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
  });

  fastify.delete("/movies/:movie_id", async (request, reply) => {
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
  });
}
