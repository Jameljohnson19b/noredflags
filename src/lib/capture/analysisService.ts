import { auth } from '../firebase';

export interface SignalResponse {
  success: boolean;
  signal?: {
    content: string;
    riskLevel: string;
    reasoning: string;
    confidence: number;
    createdAt: number;
  };
  error?: string;
}

export class AnalysisService {
  private static readonly CLOUD_FUNCTION_URL = process.env.EXPO_PUBLIC_API_URL + '/analyzeSession';

  /**
   * Dispatches the captured statement to the backend for Personalized AI Analysis.
   * Connects the Relationship Lens automatically via the userId.
   */
  static async analyzeSignal(statement: string, sessionId: string): Promise<SignalResponse> {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required to analyze signals.");

    const idToken = await user.getIdToken();

    try {
      const response = await fetch(this.CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          statement,
          sessionId,
          userId: user.uid
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || "Analysis failed." };
      }

      return { success: true, signal: data.signal };
    } catch (e: any) {
      console.error("Analysis Service Error:", e);
      return { success: false, error: e.message };
    }
  }
}
