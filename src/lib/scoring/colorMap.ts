import { Colors } from '../../constants/colors';
import { RiskLevel } from './riskWeights';

/**
 * Returns the color associated with a classification type.
 * Color = meaning.
 */
export function getScoreColor(classification: RiskLevel | string): string {
  switch (classification) {
    case 'Green Flag':
    case 'Personal Match':
      return Colors.safe; // 🟢 Safe
    case 'Yellow Flag':
    case 'Needs Clarification':
      return Colors.caution; // 🟡 Caution
    case 'Personal Mismatch':
      return Colors.warning; // 🟠 Warning
    case 'Red Flag':
      return Colors.maxRisk; // 🔴 Max Risk
    default:
      return Colors.textMuted;
  }
}

/**
 * Returns the color associated with a numeric risk score (0-100).
 * Scoring logic maps ranges to visual indicators.
 */
export function getColorFromScore(score: number): string {
  if (score >= 80) return Colors.maxRisk;     // 🔴 MAX
  if (score >= 50) return Colors.warning;     // 🟠 WARNING
  if (score >= 30) return Colors.caution;     // 🟡 CAUTION
  return Colors.safe;                         // 🟢 SAFE
}
