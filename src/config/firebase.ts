import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

const serviceAccount = require("../../energi-97c18-firebase-adminsdk-fbsvc-60d43c77d2.json") as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://energi-97c18-default-rtdb.europe-west1.firebasedatabase.app",
});

const auth = admin.auth(); // Corrigido para usar o Firebase Admin SDK
const db = admin.firestore();

export { auth, db, admin };
