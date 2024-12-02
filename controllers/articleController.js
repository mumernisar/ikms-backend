const db = require("../firebase");
require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your Gemini API key
console.log(GEMINI_API_KEY);

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.searchArticles = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Fetch all articles from Firestore
    const snapshot = await db.collection("articles").get();
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Prepare the article list for the AI prompt
    const articleList = articles
      .map((article, index) => `${index + 1}. ${article.title}`)
      .join("\n");

    const prompt = `Rank the following articles by relevance to the query: "${query}" and return only the article titles as a plain list, one title per line. Do not include numbering, explanations, or extra text.
    
The articles are:
${articleList}`;

    // Use the Gemini model to generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Parse suggestions
    const suggestions = result.response
      .text()
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== ""); // Remove empty lines

    // Match AI suggestions with actual articles
    const relevantArticles = suggestions
      .map((suggestion) => {
        const normalizedSuggestion = suggestion.toLowerCase();

        return articles.find(
          (article) => article.title.toLowerCase() === normalizedSuggestion
        );
      })
      .filter(Boolean); // Remove any unmatched items
    console.log("sending relevant articles", relevantArticles);
    res.json({ relevantArticles });
  } catch (error) {
    console.error("Error performing AI-powered search:", error);
    res.status(500).json({
      error: "Failed to fetch AI-powered suggestions. Check logs for details.",
    });
  }
};

// Fetch all articles
exports.getArticles = async (req, res) => {
  try {
    const snapshot = await db.collection("articles").get();
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("sending articles", articles);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// Fetch a single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("articles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching article details:", error);
    res.status(500).json({ error: "Error fetching article details" });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const docRef = await db.collection("articles").add({
      title,
      content,
      createdAt: new Date().toISOString(),
    });

    res
      .status(201)
      .json({ id: docRef.id, message: "Article created successfully" });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Error creating article" });
  }
};

// Update an existing article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const docRef = db.collection("articles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Article not found" });
    }

    await docRef.update({
      title,
      content,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: "Article updated successfully" });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Error updating article" });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("articles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Article not found" });
    }

    await docRef.delete();

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Error deleting article" });
  }
};
