import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const publicDirectory = path.join(currentDirectory, "public");

const courses = [
  { id: 1, title: "Web Programming", credits: 6 },
  { id: 2, title: "Database Systems", credits: 5 },
  { id: 3, title: "Software Engineering", credits: 5 },
];

let requestsServed = 0;

// Log every incoming request.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Count all requests, including static files and 404 responses.
app.use((req, res, next) => {
  requestsServed += 1;
  next();
});

app.use(express.static(publicDirectory));

app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello from Deniz's server");
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /api/admin");
});

app.get("/old-page", (req, res) => {
  res.redirect("/hello");
});

app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/api/headers", (req, res) => {
  res.json({
    userAgent: req.get("User-Agent") || null,
    accept: req.get("Accept") || null,
  });
});

app.post("/api/subscribe", (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get("/api/admin", (req, res) => {
  res.status(403).json({ error: "Forbidden" });
});

app.get("/api/stats", (req, res) => {
  res.json({ requestsServed });
});

// Keep the fallback after all routes.
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }

  res.status(404).type("text/plain").send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
