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
    const { nome, descricao } = req.body;
    const continente = await prisma.continente.create({
      data: { nome, descricao }
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

app.get("/continentes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const continente = await prisma.continente.findUnique({
      where: { id }
    });
    if (!continente) {
      return res.status(404).json({ error: "Continente não encontrado" });
    }
    res.json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar continente" });
  }
});

app.put("/continentes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { nome, descricao } = req.body;
    const continente = await prisma.continente.update({
      where: { id },
      data: { nome, descricao }
    });
    res.json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar continente" });
  }
});

app.delete("/continentes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.continente.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar continente" });
  }
});

app.post("/paises", async (req, res) => {
  try {
    const { nome, populacao, idiomaOficial, moeda, continenteId } = req.body;
    const pais = await prisma.pais.create({
      data: {
        nome,
        populacao: Number(populacao),
        idiomaOficial,
        moeda,
        continenteId: Number(continenteId)
      }
    });
    res.status(201).json(pais);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar país" });
  }
});

app.get("/paises", async (req, res) => {
  try {
    const paises = await prisma.pais.findMany();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar países" });
  }
});

app.get("/paises/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pais = await prisma.pais.findUnique({
      where: { id }
    });
    if (!pais) {
      return res.status(404).json({ error: "País não encontrado" });
    }
    res.json(pais);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar país" });
  }
});

app.put("/paises/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { nome, populacao, idiomaOficial, moeda, continenteId } = req.body;
    const pais = await prisma.pais.update({
      where: { id },
      data: {
        nome,
        populacao: populacao ? Number(populacao) : undefined,
        idiomaOficial,
        moeda,
        continenteId: continenteId ? Number(continenteId) : undefined
      }
    });
    res.json(pais);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar país" });
  }
});

app.delete("/paises/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.pais.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar país" });
  }
});

app.post("/cidades", async (req, res) => {
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    const cidade = await prisma.cidade.create({
      data: {
        nome,
        populacao: Number(populacao),
        latitude: Number(latitude),
        longitude: Number(longitude),
        paisId: Number(paisId)
      }
    });
    res.status(201).json(cidade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar cidade" });
  }
});

app.get("/cidades", async (req, res) => {
  try {
    const cidades = await prisma.cidade.findMany();
    res.json(cidades);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cidades" });
  }
});

app.get("/cidades/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const cidade = await prisma.cidade.findUnique({
      where: { id }
    });
    if (!cidade) {
      return res.status(404).json({ error: "Cidade não encontrada" });
    }
    res.json(cidade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cidade" });
  }
});

app.put("/cidades/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    const cidade = await prisma.cidade.update({
      where: { id },
      data: {
        nome,
        populacao: populacao ? Number(populacao) : undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        paisId: paisId ? Number(paisId) : undefined
      }
    });
    res.json(cidade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cidade" });
  }
});

app.delete("/cidades/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.cidade.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar cidade" });
  }
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});