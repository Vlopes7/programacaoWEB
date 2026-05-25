import express from "express";
import cors from "cors";
import "dotenv/config";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "servidor rodando"
  });
});

app.post("/continentes", async (req, res) => {
  try {
    const { nome } = req.body;

    const continente = await prisma.continente.create({
      data: {
        nome
      }
    });

    res.status(201).json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar continente" });
  }
});

app.get("/continentes", async (req, res) => {
  try {
    const continentes = await prisma.continente.findMany();
    res.json(continentes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar continentes" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});