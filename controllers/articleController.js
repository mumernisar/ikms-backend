const db = require("../firebase");
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your Gemini API key

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

    // Prepare the prompt for Gemini
    const prompt = `
      You are an AI that ranks articles based on their relevance to the query "${query}".
      The articles are:
      ${articles
        .map((article, index) => `${index + 1}. ${article.title}`)
        .join("\n")}
      Return the top 3 most relevant article titles.
    `;

    // Make a request to Google Gemini
    const response = await axios.post(
      "https://ai.google.dev/v1/gemini/completions",

      {
        model: "gemini-large",
        prompt: prompt,
        max_tokens: 70,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Process the response and filter articles
    const rankedTitles = response.data.choices[0].text
      .trim()
      .split("\n")
      .map((line) => line.trim());

    const relevantArticles = articles.filter((article) =>
      rankedTitles.includes(article.title)
    );

    res.json(relevantArticles);
  } catch (error) {
    console.error(
      "Error performing AI-powered search:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error performing AI-powered search" });
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
