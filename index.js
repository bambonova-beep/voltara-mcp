import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Supermemory } from "supermemory";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Inicializa Supermemory usando la API Key del ambiente (Render la guardará como variable)
const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY,
});

// GET para verificar que el servidor está vivo
app.get("/", (req, res) => {
  res.send("VOLTARA MCP server activo.");
});

// POST para guardar memoria
app.post("/add-memory", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing 'content' field" });
    }

    const memory = await client.memories.add({
      content,
    });

    res.json({
      ok: true,
      saved: memory,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Render usará el puerto asignado automáticamente
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor MCP VOLTARA activo en puerto ${PORT}`);
});
