import * as admin from 'firebase-admin';

// Unified Admin SDK initialization
if (!admin.apps.length) {
    admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
