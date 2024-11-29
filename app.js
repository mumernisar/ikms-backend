const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articles");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/articles", articleRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
