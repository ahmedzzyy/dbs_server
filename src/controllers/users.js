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
  fastify.get(
    "/users",
    {
      schema: {
        description: "Testing endpoint for the user controller",
        tags: ["users"],
        summary: "Test endpoint",
        response: {
          200: {
            type: "object",
            properties: {
              controller: { type: "string", example: "users" },
            },
          },
        },
      },
    },
    function (_request, reply) {
      reply.send({ controller: "users" });
    },
  );

  fastify.post(
    "/register",
    {
      schema: {
        description:
          "Registers a new user with a username, email, and password",
        tags: ["users"],
        summary: "Register user",
        body: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: {
              type: "string",
              format: "email",
            },
            password: { type: "string" },
          },
        },
        response: {
          201: {
            description: "User registered successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User registered successfully",
              },
              user: {
                type: "object",
                properties: {
                  user_id: { type: "number" },
                  registration_date: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
          400: {
            description: "Bad request - missing fields",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Both e-mail and password are required.",
              },
            },
          },
          409: {
            description: "Conflict - user already exists",
            type: "object",
            properties: {
              error: { type: "string", example: "User already exists." },
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
    },
  );

  fastify.post(
    "/login",
    {
      schema: {
        description: "Logs in an existing user using email and password.",
        summary: "User login",
        tags: ["users"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Login successful",
            type: "object",
            properties: {
              message: { type: "string", example: "Login successful" },
              token: {
                type: "string",
                description: "JWT token",
              },
            },
          },
          400: {
            description: "Bad request - missing fields",
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Both e-mail and password are required.",
              },
            },
          },
          401: {
            description: "Invalid credentials",
            type: "object",
            properties: {
              error: { type: "string", example: "Invalid credentials." },
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

        const valid = await comparePassword(password, user.password);
        if (!valid) {
          return reply.code(401).send({ error: "Invalid credentials." });
        }

        const token = generateToken({ id: user.user_id, email: user.email });
        reply.send({ message: "Login successful", token });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    },
  );

  fastify.get(
    "/users/:user_id",
    {
      preValidation: fastify.authenticate,
      schema: {
        description:
          "Retrieves a user's details by their ID. Requires authentication.",
        summary: "Get user by ID",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            user_id: {
              type: "integer",
              description: "ID of the user to retrieve",
            },
          },
          required: ["user_id"],
        },
        response: {
          200: {
            description: "User found",
            type: "object",
            properties: {
              user_id: { type: "integer" },
              registration_date: { type: "string" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
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
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string", example: "User not found" },
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
      schema: {
        description:
          "Retrieves the details of the currently authenticated user.",
        summary: "Get current user",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "User found",
            type: "object",
            properties: {
              user_id: { type: "integer" },
              registration_date: { type: "string" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
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
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string", example: "User not found" },
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
      schema: {
        description:
          "Updates the authenticated user's details. At least one field (username, email, or password) must be provided.",
        summary: "Update current user",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            description: "User updated successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User updated successfully.",
              },
              user: {
                type: "object",
                properties: {
                  user_id: { type: "integer" },
                  registration_date: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
          400: {
            description: "Bad request - no update fields provided",
            type: "object",
            properties: {
              error: {
                type: "string",
                example:
                  "At least one field (username, email, or password) must be provided for update",
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
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string", example: "User not found" },
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
      schema: {
        description: "Deletes the currently authenticated user.",
        summary: "Delete current user",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "User deleted successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User deleted successfully.",
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
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string", example: "User not found" },
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
