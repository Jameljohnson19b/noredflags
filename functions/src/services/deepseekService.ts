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
2. directly inconsistent with the user's stated preferences (e.g. they want monogamy, and the partner suggests an open relationship).
`;
    }

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are REDFLAGS, a real-time emotional intelligence tool for dating. 
Your job is to interpret user input by passing it through 4 interpretation layers:
1. Universal caution signals
2. Personal mismatch signals
3. Personal match signals
4. Contextual offsets

${lensContext}

Evaluate the user's statement. You MUST classify it strictly as ONE of the following output types:
"Red Flag", "Yellow Flag", "Green Flag", "Personal Mismatch", "Personal Match", "Needs Clarification".

Output strictly in JSON format: {"riskLevel": "<Output Type>", "reasoning": "<Explanation mapping directly to the lens or universal rules>", "confidence": <number between 0 and 1>}.`
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
