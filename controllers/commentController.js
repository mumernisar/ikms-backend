const db = require("../firebase");
const users = require("../users.json");

// Fetch comments for an article
exports.getComments = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const snapshot = await db
      .collection("comments")
      .where("articleId", "==", articleId)
      .get();
    const comments = snapshot.docs.map((doc) => ({
      commentId: doc.id,
      ...doc.data(),
    }));

    // Augment comments with user details from users.json
    const enrichedComments = comments.map((comment) => {
      const user = users.find((u) => u.id === comment.userId);
      return {
        ...comment,
        userName: user ? user.name : "Unknown User",
      };
    });

    res.json(enrichedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// Add a comment to an article
exports.addComment = async (req, res) => {
  try {
    const articleId  = req.params.id;
    const { userId, content } = req.body;
    console.log(req.params, req.body);

    if (!content || !userId) {
      return res.status(400).json({ error: "Content and userId are required" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const newComment = {
      articleId,
      userId,
      content,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("comments").add(newComment);
    res
      .status(201)
      .json({ commentId: docRef.id, message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Delete a comment (Admin only)
exports.deleteComment = async (req, res) => {
  try {
    const { id: articleId, feedbackId } = req.params;

    const commentDoc = db.collection("comments").doc(feedbackId);
    const commentSnap = await commentDoc.get();

    if (!commentSnap.exists) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const commentData = commentSnap.data();
    if (commentData.articleId !== articleId) {
      return res
        .status(400)
        .json({ error: "Comment does not belong to this article" });
    }

    await commentDoc.delete();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
