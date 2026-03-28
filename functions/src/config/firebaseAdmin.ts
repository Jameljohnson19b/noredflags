import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccount.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
