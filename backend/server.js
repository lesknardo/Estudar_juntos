import express from "express";
import multer from "multer";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configura o multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Banco de dados SQLite
const dbPromise = open({
  filename: "database.sqlite",
  driver: sqlite3.Database,
});

// Cria a tabela se não existir
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subject TEXT,
      condition TEXT,
      distance REAL,
      image TEXT,
      latitude REAL,
      longitude REAL
    );
  `);
})();

// Adicionar livro
app.post("/books", upload.single("image"), async (req, res) => {
  try {
    const { title, subject, condition, distance, latitude, longitude } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const db = await dbPromise;
    await db.run(
      `INSERT INTO books (title, subject, condition, distance, image, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, subject, condition, distance || 0, image, latitude || null, longitude || null]
    );

    res.json({ success: true, message: "Livro adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar livro:", error);
    res.status(500).json({ error: "Erro ao adicionar livro" });
  }
});

// Listar livros
app.get("/books", async (req, res) => {
  const db = await dbPromise;
  const books = await db.all("SELECT * FROM books");
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});