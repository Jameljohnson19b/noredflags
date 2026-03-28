export const STABILITY_WEIGHTS = {
  // Traits that reduce risk score implicitly
  calming: -1,
  reassurance: -2,
  consistent: -3,
  supportive: -5,
};

export type StabilityLevel = keyof typeof STABILITY_WEIGHTS;
