import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const publicDirectory = path.join(currentDirectory, "public");

app.use(express.static(publicDirectory));

app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello from Deniz's server");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
