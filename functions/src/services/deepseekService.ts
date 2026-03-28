import { env } from '../config/env';

export interface DeepSeekResponse {
  riskLevel: 'Red Flag' | 'Yellow Flag' | 'Green Flag' | 'Personal Mismatch' | 'Personal Match' | 'Needs Clarification';
  reasoning: string;
  confidence: number;
}

/**
 * Service to handle communication with DeepSeek API for risk analysis.
 */
export class DeepSeekService {
  private static readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';

  static async analyzeStatement(statement: string, rawLensData?: any): Promise<DeepSeekResponse> {
    const apiKey = env.DEEPSEEK_API_KEY.value();

    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not configured in the environment.");
    }

    // Build the structural prompt defining the user's specific constraints (The Relationship Lens)
    let lensContext = '';
    if (rawLensData) {
      lensContext = `
USER RELATIONSHIP LENS (Preferences):
- Who they are: ${rawLensData.whoAmI || 'Unknown'}
- THE WANT LIST: ${rawLensData.userWants || 'Unknown'}
- THE NO LIST: ${rawLensData.userDontWants || 'Unknown'}
- Who they date: ${rawLensData.whoTheyDate || 'Unknown'}
- Relationship Goals: ${rawLensData.relationshipGoals || 'Unknown'}
- Monogamy Preference: ${rawLensData.monogamy || 'Unknown'}
- Desire for Children: ${rawLensData.desireForChildren || 'Unknown'}
- Open to Partners with Children: ${rawLensData.openToChildren || 'Unknown'}
- Financial Stability Importance: ${rawLensData.financialImportance || 'Unknown'}
- Ambition Importance: ${rawLensData.ambitionImportance || 'Unknown'}
- Lifestyle Preferences: ${rawLensData.lifestyle || 'Unknown'}
- Hard Dealbreakers: ${rawLensData.hardDealbreakers || 'None stated'}
- Soft Concerns: ${rawLensData.softConcerns || 'None stated'}

CRITICAL RULE:
A trait should not be labeled a red flag unless it is:
1. broadly concerning across contexts, or
2. directly inconsistent with the user's stated preferences.
`;
    }

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are the REDFLAGS Analysis Engine. You are NOT a chatbot.

CORE OPERATING PROTOCOL:
1. Interpret statements about a dating partner's behavior, personality, or traits.
2. PASS/FAIL criteria: If the input is NOT relevant to dating or a person, classify as "Needs Clarification" with reasoning "Out of scope: REDFLAGS only analyzes dating signals."
3. NO SMALL TALK. NO ADVICE. NO ROLEPLAY. NO EXPLAINING TOPICS.
4. ONLY return JSON.

ANALYSIS LAYERS:
- Universal caution signals (e.g., aggression, deception, lack of effort)
- Personal mismatch (vs. User Relationship Lens)
- Personal match (vs. User Relationship Lens)
- Contextual offsets (e.g., humor, high-stress situation)

${lensContext}

Output strictly in JSON format: {"riskLevel": "<Output Type>", "reasoning": "<Concise reasoning mapping to the lens or universal rules>", "confidence": <number between 0 and 1>}.`
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
