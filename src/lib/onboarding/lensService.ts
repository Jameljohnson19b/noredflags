import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface RelationshipLens {
  whoAmI: string;
  userWants: string;
  userDontWants: string;
  whoTheyDate: string;
  relationshipGoals: string;
  monogamy: string;
  desireForChildren: string;
  openToChildren: string;
  financialImportance: string;
  ambitionImportance: string;
  lifestyle: string;
  hardDealbreakers: string;
  softConcerns: string;
  updatedAt?: number;
}

export class LensService {
  /**
   * Saves the Relationship Lens profile to the user's Firestore document.
   * Path: users/{uid} (field: lens)
   */
  static async saveLens(lens: RelationshipLens) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
        console.warn("Dev Mode: Simulating Relationship Lens Cloud Save...");
        await new Promise(r => setTimeout(r, 500));
        return { success: true };
    }

    let userUid = auth.currentUser?.uid;

    if (!userUid) {
      throw new Error("Authentication required to save Relationship Lens.");
    }

    const userRef = doc(db, 'users', userUid);
    
    console.log(`[LensService] Writing lens data to users/${userUid}`);
    try {
      await setDoc(userRef, {
        lens,
        lensUpdatedAt: Date.now()
      }, { merge: true });
      console.log(`[LensService] Success: Lens saved.`);
    } catch (err) {
      console.error(`[LensService] Firestore Error:`, err);
      throw err;
    }

    return { success: true };
  }

  /**
   * Retrieves the user's saved Relationship Lens.
   */
  static async getLens(): Promise<RelationshipLens | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists() && snap.data().lens) {
      return snap.data().lens as RelationshipLens;
    }

    return null;
  }
}
