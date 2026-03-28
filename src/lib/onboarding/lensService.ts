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
   * Path: users/{uid}/profile/lens
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

    const lensRef = doc(db, 'users', userUid, 'profile', 'lens');
    
    await setDoc(lensRef, {
      ...lens,
      updatedAt: Date.now()
    }, { merge: true });

    return { success: true };
  }

  /**
   * Retrieves the user's saved Relationship Lens.
   */
  static async getLens(): Promise<RelationshipLens | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const lensRef = doc(db, 'users', user.uid, 'profile', 'lens');
    const snap = await getDoc(lensRef);

    if (snap.exists()) {
      return snap.data() as RelationshipLens;
    }

    return null;
  }
}
