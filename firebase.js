const admin = require("firebase-admin");
const PATH = process.env.FIREBASE_SERVICE_ACCOUNT || "./firebase-service-account.json";
const serviceAccount = require(PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ikms-d78d2.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;
