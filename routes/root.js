import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from 'path';
const __dirname = dirname(__filename);
const router = express.Router();
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});
router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});
router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});
export default router;
