const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articles");
const morgan = require("morgan");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(morgan("dev"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/articles", commentRoutes, articleRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
