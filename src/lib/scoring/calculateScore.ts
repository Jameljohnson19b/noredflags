import { applyRecentBoost } from './recentWeightBoost';
import { RISK_WEIGHTS, RiskLevel } from './riskWeights';

export interface SignalEvent {
  id: string;
  type: RiskLevel;
  timestamp: number;
}

export function calculateSessionScore(events: SignalEvent[], currentTime: number = Date.now()): number {
  let totalScore = 0;
  
  // Define recent threshold (e.g., last 15 minutes) as per requirements
  const RECENT_THRESHOLD_MS = 15 * 60 * 1000;

  events.forEach(event => {
    let weight = RISK_WEIGHTS[event.type] || 0;
    
    if (currentTime - event.timestamp <= RECENT_THRESHOLD_MS) {
      weight = applyRecentBoost(weight);
    }
    
    totalScore += weight;
  });

  return totalScore;
}
