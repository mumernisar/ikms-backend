const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ikms-d78d2.firebaseio.com", // Replace with your project ID
});

const db = admin.firestore();

// Read mock data from JSON file
const mockData = JSON.parse(fs.readFileSync("mockData.json", "utf-8"));

// Function to upload data to Firestore
const uploadData = async () => {
  try {
    const batch = db.batch();
    const collectionRef = db.collection("articles");

    mockData.forEach((data) => {
      const docRef = collectionRef.doc(); // Auto-generate document ID
      batch.set(docRef, data);
    });

    await batch.commit();
    console.log("Mock data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading mock data:", error);
  }
};

// Run the upload function
uploadData();
