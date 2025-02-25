// /src/utils/firebaseConfig.ts
import * as admin from 'firebase-admin';

const serviceAccount = require('caminho/para/sua/chave/firebase.json'); // Altere para o caminho correto do seu arquivo de chave

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'seu-bucket.appspot.com' // Substitua pelo seu bucket do Firebase Storage
});

const bucket = admin.storage().bucket();

export { bucket };
