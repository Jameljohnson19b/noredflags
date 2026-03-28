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
    const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;
    console.log(`[AnalysisService] Environment Check: ${environment}`);
    console.log(`[AnalysisService] Target Endpoint: ${this.CLOUD_FUNCTION_URL}`);

    const user = auth.currentUser;
    if (!user) {
      console.error("[AnalysisService] No user found in session.");
      return { success: false, error: "Authentication required to analyze signals." };
    }

    try {
      const idToken = await user.getIdToken();
      
      // Mandatory timeout to prevent UI hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds

      console.log(`[AnalysisService] Firing request to Cloud Function...`);
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
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const data = await response.json();
      console.log(`[AnalysisService] Result:`, data);
      
      if (!response.ok) {
        return { success: false, error: data.error || `Server returned ${response.status}` };
      }

      return { success: true, signal: data.signal };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.error("[AnalysisService] Request timed out.");
        return { success: false, error: "The server took too long to respond. Is the Backend running?" };
      }
      console.error("[AnalysisService] Network/Logic Error:", e);
      return { success: false, error: e.message };
    }
  }
}
