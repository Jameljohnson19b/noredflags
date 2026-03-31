import { RiskLevel } from './riskWeights';

export interface ClassifiedStatement {
  content: string;
  riskLevel: RiskLevel;
  confidence: number; // 0 to 1
  reasoning: string;
}

/**
 * Uses DeepSeek to classify statements into risk signals.
 * Currently stubbed out as we iterate on the AI pipeline.
 */
export async function classifyStatement(statement: string): Promise<ClassifiedStatement> {
  return {
    content: statement,
    riskLevel: 'Yellow Flag',
    confidence: 0.8,
    reasoning: 'Stub classification for testing UI prior to full DeepSeek integration',
  };
}
