const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ikms-d78d2.firebaseio.com", // Replace with your project ID
});

const db = admin.firestore();

const mockComments = [
  {
    articleId: "VNfHVlaV2XdakSJVWGxE",
    comment: "Great article! Learned a lot about AI.",
    author: "John Doe",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "Zf6taDLA30N7kJqDgEM4",
    comment: "I disagree with some points here.",
    author: "Jane Smith",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "bfvGQjFJjYLsoZdPeebu",
    comment: "This needs more examples.",
    author: "Alice Johnson",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "gL9iXUZrBsaDAbEBkTzz",
    comment: "Very insightful article, thanks for sharing!",
    author: "Bob Brown",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "hSM09Wa4cl2y4WupXvcL",
    comment: "Some links are broken, please fix them.",
    author: "Charlie Davis",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "mnNetzZu86dMr1kgRJBR",
    comment: "Well-written and easy to follow.",
    author: "Emily White",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "wGnk5wOeoQ9eEvHWuHlN",
    comment: "Is there a follow-up to this article?",
    author: "Frank Green",
    createdAt: new Date().toISOString(),
  },
  {
    articleId: "wp2j3hLAg57Vg8GhzUOU",
    comment: "I love the detailed explanation in this piece.",
    author: "Grace Blue",
    createdAt: new Date().toISOString(),
  },
];

// Script to populate comments
const addMockComments = async () => {
  try {
    const batch = db.batch();

    mockComments.forEach((comment) => {
      const commentRef = db.collection("comments").doc();
      batch.set(commentRef, comment);
    });

    await batch.commit();
    console.log("Mock comments added successfully!");
  } catch (error) {
    console.error("Error adding mock comments:", error);
  }
};

addMockComments();
