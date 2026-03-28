import { env } from '../config/env';

export interface DeepSeekResponse {
  riskLevel: 'safe' | 'caution' | 'warning' | 'escalation1' | 'escalation2' | 'escalation3' | 'escalation4' | 'maxRisk';
  reasoning: string;
  confidence: number;
}

/**
 * Service to handle communication with DeepSeek API for risk analysis.
 */
export class DeepSeekService {
  private static readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';

  static async analyzeStatement(statement: string, userContext?: string): Promise<DeepSeekResponse> {
    const apiKey = env.DEEPSEEK_API_KEY.value();

    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not configured in the environment.");
    }

    // Capture tailored alignment rules dynamically adjusting the system parameters
    const tailoredPrompt = userContext 
      ? `The user provided this background and their relationship "Green Lights" (goals): "${userContext}". Let their specific needs heavily guide whether this statement is a "Green for Go" (safe) or a "Stop on Red" flag.`
      : ``;

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are REDFLAGS, a real-time emotional intelligence tool for dating. Stop wasting time and figure out if someone is a green for go or if we stop on red! Evaluate the given statement. ${tailoredPrompt} Map the statement into one of the following risk levels strictly: safe, caution, warning, escalation1, escalation2, escalation3, escalation4, maxRisk. Output strictly in JSON format: {"riskLevel": "<level>", "reasoning": "<explanation>", "confidence": <number between 0 and 1>}.`
        },
        {
          role: "user",
          content: statement
        }
      ],
      response_format: { type: "json_object" }
    };

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API responded with status: ${response.status}`);
      }

      const data: any = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content) as DeepSeekResponse;
    } catch (error) {
      console.error("DeepSeek Analysis Error:", error);
      throw new Error("Failed to analyze statement.");
    }
  }
}
