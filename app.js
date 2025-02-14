require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const express = require("express");

const app = express();
const port = 3000;
const sql = neon(process.env.DATABASE_URL);

app.use(express.json()); // Middleware para recibir JSON en las solicitudes POST

// 🔹 Ruta para obtener todas las tareas
app.get("/", async (req, res) => {
  try {
    const tareas = await sql`SELECT * FROM tarea;`;
    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).send("Error al obtener las tareas");
  }
});

// 🔹 Ruta para agregar una nueva tarea
app.post("/tareas", async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const nuevaTarea = await sql`
      INSERT INTO tareas (titulo, descripcion) 
      VALUES (${titulo}, ${descripcion}) 
      RETURNING *;
    `;

    res.status(201).json(nuevaTarea[0]); // Devuelve la tarea recién creada
  } catch (error) {
    console.error("Error al agregar la tarea:", error);
    res.status(500).send("Error al agregar la tarea");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});