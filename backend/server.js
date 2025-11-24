const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("books.db");

// Cria a tabela se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    subject TEXT,
    condition TEXT,
    latitude REAL,
    longitude REAL,
    image TEXT,
    donorId TEXT,
    donorName TEXT
  )
`).run();

// LISTAR TODOS
app.get("/books", (req, res) => {
  const books = db.prepare("SELECT * FROM books").all();
  res.json(books);
});

// BUSCAR POR ID
app.get("/books/:id", (req, res) => {
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Livro não encontrado" });
  }

  res.json(book);
});

// CRIAR LIVRO
app.post("/books", (req, res) => {
  const {
    title,
    author,
    subject,
    condition,
    latitude,
    longitude,
    image,
    donorId,
    donorName,
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO books 
    (title, author, subject, condition, latitude, longitude, image, donorId, donorName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    title,
    author,
    subject,
    condition,
    latitude,
    longitude,
    image,
    donorId,
    donorName
  );

  res.json({ id: result.lastInsertRowid, message: "Livro criado" });
});

// DELETAR LIVRO
app.delete("/books/:id", (req, res) => {
  db.prepare("DELETE FROM books WHERE id = ?").run(req.params.id);
  res.json({ message: "✅ Livro deletado com sucesso" });
});

// Iniciar servidor
app.listen(3000, "0.0.0.0", () => {
  console.log("✅ Backend rodando em http://192.168.1.104:3000");
});