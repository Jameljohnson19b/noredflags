import * as admin from 'firebase-admin';

// Initialize with application default credentials for use with Emulator or Cloud
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
