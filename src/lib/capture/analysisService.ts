import { auth } from '../firebase';
import { Alert } from 'react-native';

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
  private static readonly CLOUD_FUNCTION_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/noredflags-db069/us-central1') + '/analyzeSession';

  /**
   * Dispatches the captured statement to the backend for Personalized AI Analysis.
   * Now with forced alerts to debug the "nothing happened" issue.
   */
  static async analyzeSignal(statement: string, sessionId: string): Promise<SignalResponse> {
    const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;
    console.log(`[AnalysisService] Targeting: ${this.CLOUD_FUNCTION_URL}`);

    const user = auth.currentUser;
    if (!user) {
      const msg = "Authentication required. Please check your login status.";
      Alert.alert("Auth Error", msg);
      return { success: false, error: msg };
    }

    try {
      const idToken = await user.getIdToken();
      console.log(`[AnalysisService] Sending Signal to: ${this.CLOUD_FUNCTION_URL}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        Alert.alert("AI Engine Timeout", "The interpretation engine is taking too long. Please ensure your cloud functions are active.");
      }, 30000);

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

      if (!response.ok) {
        console.error("[AnalysisService] Engine Error Status:", response.status);
        const errorMsg = data.error || `Server Status ${response.status}`;
        Alert.alert("Engine Failure", errorMsg);
        return { success: false, error: errorMsg };
      }

      return { success: true, signal: data.signal };
    } catch (e: any) {
      const errorMsg = e.name === 'AbortError' ? "AI Connection Timed Out" : e.message;
      console.error("[AnalysisService] Exception:", errorMsg);
      Alert.alert("AI Engine Offline", `Failed to reach the AI Engine.\n\nError: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  }
  
  /**
   * Dispatches a base64 encoded image to the backend for OCR and analysis.
   */
  static async analyzeImage(base64: string, sessionId: string): Promise<SignalResponse> {
    const user = auth.currentUser;
    if (!user) {
      const msg = "Authentication required.";
      return { success: false, error: msg };
    }

    try {
      const idToken = await user.getIdToken();
      console.log(`[AnalysisService] Uploading Image Signal to: ${this.CLOUD_FUNCTION_URL}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        Alert.alert("Vision Timeout", "The image analysis engine took too long. Check your connection or retry with a smaller image.");
      }, 35000);

      const response = await fetch(this.CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          image: base64,
          sessionId,
          userId: user.uid
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || `Vision Engine Status ${response.status}`;
        Alert.alert("Engine Failure", errorMsg);
        return { success: false, error: errorMsg };
      }

      return { success: true, signal: data.signal };
    } catch (e: any) {
      const errorMsg = e.name === 'AbortError' ? "Vision Request Timed Out" : e.message;
      console.error("[AnalysisService] Image Error:", errorMsg);
      Alert.alert("Network Failure", `Failed to reach the Vision Engine.\n\nError: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  }
}
