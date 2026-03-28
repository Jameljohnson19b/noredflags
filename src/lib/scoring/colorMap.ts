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
