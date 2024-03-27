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
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});
router.get("/test(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});
export default router;
