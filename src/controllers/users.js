import {
  createUser,
  deleteUserById,
  findUserByEmail,
  getUserById,
  updateUserById,
} from "../services/userService.js";
import { comparePassword, hashPassword } from "../utils/passwordUtil.js";
import { generateToken } from "../utils/authUtil.js";

/**
 * User routes
 * @param {import("fastify").FastifyInstance} fastify - Fastify instance
 * @param {Object} _opts - Fastify options (unused)
 */
export default async function userController(fastify, _opts) {
  fastify.get("/users", function (_request, reply) {
    reply.send({ controller: "users" });
  });

  fastify.post("/register", async (request, reply) => {
    try {
      const { username, email, password } = request.body;

      if (!email || !password) {
        return reply
          .code(400)
          .send({ error: "Both e-mail and password are required." });
      }

      const existingUser = await findUserByEmail(fastify.db, email);
      if (existingUser) {
        return reply
          .code(409)
          .send({ error: "Both e-mail and password are required." });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await createUser(fastify.db, {
        username,
        email,
        password: hashedPassword,
      });

      reply.code(201).send({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.post("/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply
          .code(400)
          .send({ error: "Both e-mail and password are required." });
      }

      const user = await findUserByEmail(fastify.db, email);

      if (!user) {
        return reply.code(401).send({ error: "Invalid credentials." });
      }

      const valid = await comparePassword(password, user.Password);
      if (!valid) {
        return reply.code(401).send({ error: "Invalid credentials." });
      }

      const token = generateToken({ id: user.User_ID, email: user.Email });
      reply.send({ message: "Login successful", token });
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.get(
    "/users/:user_id",
    {
      preValidation: fastify.authenticate,
    },
    async (request, reply) => {
      const { user_id } = request.params;

      try {
        const user = await getUserById(fastify.db, user_id);

        if (!user) {
          return reply.code(404).send({ error: "User not found" });
        }

        reply.send(user);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.get(
    "/users/me",
    {
      preValidation: fastify.authenticate,
    },
    async (request, reply) => {
      const userId = request.user.id;

      try {
        const user = await getUserById(fastify.db, userId);

        if (!user) {
          return reply.code(404).send({ error: "User not found" });
        }

        reply.send(user);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.put(
    "/users/me",
    {
      preValidation: fastify.authenticate,
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { username, email, password } = request.body;

      if (
        username === undefined &&
        email === undefined &&
        password === undefined
      ) {
        return reply.code(400).send({
          error:
            "At least one field (username, email, or password) must be provided for update",
        });
      }

      try {
        const user = await updateUserById(fastify.db, userId, {
          username,
          email,
          password,
        });
        if (!user) {
          return reply.code(404).send({ error: "User not found" });
        }

        reply.send({ message: "User updated successfully.", user });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.delete(
    "/users/me",
    {
      preValidation: fastify.authenticate,
    },
    async (request, reply) => {
      const userId = request.user.id;

      try {
        const success = await deleteUserById(fastify.db, userId);

        if (!success) {
          return reply.code(404).send({ error: "User not found" });
        }

        reply.send({ message: "User deleted successfully." });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );
}
