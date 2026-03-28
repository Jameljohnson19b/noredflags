export const RISK_WEIGHTS = {
  'Green Flag': 0,
  'Personal Match': 0,
  'Needs Clarification': 2,
  'Yellow Flag': 5,
  'Personal Mismatch': 15,
  'Red Flag': 34,
};

export type RiskLevel = keyof typeof RISK_WEIGHTS;
