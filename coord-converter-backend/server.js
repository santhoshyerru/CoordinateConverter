require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const mysql = require("mysql2/promise");

// Enable CORS
fastify.register(require("fastify-cors"), {
  origin: true, // adjust this in production
});

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a route to save coordinates
fastify.post("/save-coords", async (request, reply) => {
  const { lat, lng, notes } = request.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO coords_data (lat, lng, notes, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [lat, lng, notes]
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

// Run the server
const start = async () => {
  try {
    await fastify.listen(process.env.PORT);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
