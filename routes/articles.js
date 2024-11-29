const express = require("express");
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { searchArticles } = require("../controllers/articleController");

const router = express.Router();

// Define article routes
router.post("/search", searchArticles);
router.get("/", getArticles); // Get all articles
router.get("/:id", getArticleById); // Get a single article by ID
router.post("/", createArticle); // Create a new article
router.put("/:id", updateArticle); // Update an article by ID
router.delete("/:id", deleteArticle); // Delete an article by ID

module.exports = router;
