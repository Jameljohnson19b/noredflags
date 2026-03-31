import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface SubjectProfile {
  id: string;
  name: string;
  type?: string; 
  notes?: string;
  createdAt: number;
  lastSignalAt?: number;
  isArchived?: boolean;
}

export class SubjectService {
  /**
   * Retrieves all active persons being tracked by the user.
   */
  static async getSubjects(): Promise<SubjectProfile[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const subjectsRef = collection(db, 'users', user.uid, 'subjects');
    const q = query(subjectsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubjectProfile));
  }

  /**
   * Creates a new person to track.
   * Enforces limits based on tier.
   */
  static async createSubject(name: string, tier: 'none' | 'core' | 'pro' = 'none'): Promise<{ success: boolean; id?: string; error?: string }> {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Auth required' };

    // 1. Check Limits 🛑
    const currentSubjects = await this.getSubjects();
    const limitCount = tier === 'pro' ? 10 : 3;

    if (currentSubjects.length >= limitCount) {
      return { 
        success: false, 
        error: `Limit reached. ${tier === 'pro' ? 'Pro' : 'Free'} accounts are limited to ${limitCount} profiles.` 
      };
    }

    // 2. Create the Profile 👤
    const subjectId = doc(collection(db, 'users', user.uid, 'subjects')).id;
    const subjectRef = doc(db, 'users', user.uid, 'subjects', subjectId);

    const newSubject: SubjectProfile = {
      id: subjectId,
      name,
      createdAt: Date.now(),
      isArchived: false
    };

    await setDoc(subjectRef, newSubject);
    return { success: true, id: subjectId };
  }
}
