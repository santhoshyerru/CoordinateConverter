require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const mysql = require("mysql2/promise");

fastify.register(require("@fastify/cors"), {
  origin: true, // adjust this in production
});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

fastify.post("/save-coords", async (request, reply) => {
  const { lat, lng } = request.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO coords_data (lat, lng, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [lat, lng]
    );
    await connection.end();

    reply.code(201).send({ id: result.insertId });
  } catch (error) {
    fastify.log.error(error);
    reply
      .code(500)
      .send({ error: "An error occurred while saving the coordinates" });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
