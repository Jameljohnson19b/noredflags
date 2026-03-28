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
    console.log(`[AnalysisService] Environment: ${environment}`);
    console.log(`[AnalysisService] Target URL: ${this.CLOUD_FUNCTION_URL}`);

    const isLocalhost = this.CLOUD_FUNCTION_URL?.includes('127.0.0.1') || this.CLOUD_FUNCTION_URL?.includes('localhost');

    // MOCK RESPONSE FOR LOCAL SIMULATOR TESTING:
    // This allows the user to test the Audit -> Report flow even if the 
    // backend is not reachable or in dev mode.
    if (environment === 'development' || (environment === 'production' && isLocalhost)) {
      console.warn("AnalysisService: Simulating DeepSeek Analysis (Dev/Localhost Match)...");
      await new Promise(r => setTimeout(r, 1500)); // Simulate AI latency
      return { 
        success: true, 
        signal: {
          content: statement,
          riskLevel: 'Yellow Flag',
          reasoning: "MOCK: The AI detected ambiguous intent and potentially inconsistent communication patterns. Recommend a deeper audit of the tone.",
          confidence: 0.88,
          createdAt: Date.now()
        } 
      };
    }

    const user = auth.currentUser;
    if (!user) {
      console.error("[AnalysisService] No user found in Auth.");
      return { success: false, error: "Authentication required to analyze signals." };
    }

    try {
      const idToken = await user.getIdToken();
      
      // Add a timeout to the fetch to prevent "nothing happened" scenarios
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      console.log(`[AnalysisService] Sending request to backend...`);
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
      console.log(`[AnalysisService] Backend Response Received:`, data);
      
      if (!response.ok) {
        return { success: false, error: data.error || `Server Error: ${response.status}` };
      }

      return { success: true, signal: data.signal };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.error("[AnalysisService] Request Timed Out.");
        return { success: false, error: "Analysis timed out. Is the backend server running?" };
      }
      console.error("[AnalysisService] Error:", e);
      return { success: false, error: e.message };
    }
  }
}
