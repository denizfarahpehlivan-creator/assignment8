import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const publicDirectory = path.join(currentDirectory, "public");

app.use(express.static(publicDirectory));
let requestsServed = 0;

// Log every incoming request.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Count every request, including static files and missing paths.
app.use((req, res, next) => {
  requestsServed += 1;
  next();
});

app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello from Deniz's server");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
