import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  tier: 'none' | 'core' | 'pro';
  createdAt: number;
}

export class UserService {
  /**
   * Retrieves the current user's profile and tier.
   */
  static async getProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }

    // Default to free if doc doesn't exist
    return {
      uid: user.uid,
      email: user.email,
      tier: 'none',
      createdAt: Date.now()
    };
  }

  /**
   * Updates the user's tier after a successful purchase.
   */
  static async updateTier(tier: 'none' | 'core' | 'pro'): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { 
      tier,
      updatedAt: Date.now()
    }, { merge: true });
  }
}
