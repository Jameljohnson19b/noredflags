import { Colors } from '../../constants/colors';

/**
 * Returns the color associated with a risk score mapping.
 * Color = meaning.
 */
export function getScoreColor(score: number): string {
  if (score === 0) return Colors.safe;
  if (score <= 5) return Colors.caution;
  if (score <= 15) return Colors.warning;
  if (score <= 25) return Colors.escalation1;
  if (score <= 40) return Colors.escalation2;
  if (score <= 60) return Colors.escalation3;
  if (score <= 80) return Colors.escalation4;
  return Colors.maxRisk;
}
