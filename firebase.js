const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ikms-d78d2.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;
