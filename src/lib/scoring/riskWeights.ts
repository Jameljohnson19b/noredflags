export const RISK_WEIGHTS = {
  safe: 0,
  caution: 1,
  warning: 3,
  escalation1: 5,
  escalation2: 8,
  escalation3: 13,
  escalation4: 21,
  maxRisk: 34,
};

export type RiskLevel = keyof typeof RISK_WEIGHTS;
