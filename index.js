import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Supermemory } from "supermemory";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY,
});

app.get("/", (req, res) => {
  res.send("VOLTARA MCP server activo.");
});

// Retorna el estado del servidor y la conexión con Supermemory
app.get("/status", async (req, res) => {
  try {
    await client.documents.list({ limit: 1 });
    res.json({
      ok: true,
      status: "online",
      supermemory: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      status: "degraded",
      supermemory: "error",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Retorna las últimas sesiones (documentos/memorias) registradas en Supermemory
app.get("/sessions", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const result = await client.documents.list({
      limit,
      page,
      order: "desc",
    });

    res.json({
      ok: true,
      sessions: result.memories,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/add-memory", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing 'content' field" });
    }

    const memory = await client.add({ content });

    res.json({
      ok: true,
      saved: memory,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor MCP VOLTARA activo en puerto ${PORT}`);
});
