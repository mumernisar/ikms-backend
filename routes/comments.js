const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Fetch comments for an article
router.get("/:id/feedback", commentController.getComments);

// Add a comment to an article
router.post("/:id/feedback", commentController.addComment);

// Delete a comment
router.delete("/:id/feedback/:feedbackId", commentController.deleteComment);

module.exports = router;
