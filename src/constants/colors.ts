export const Colors = {
  // Base UI - strictly black and white
  background: '#000000',
  text: '#FFFFFF',
  textMuted: '#A3A3A3',
  border: '#262626',
  card: '#171717',

  // Signal Colors
  safe: '#22C55E', // 🟢 Safe
  caution: '#EAB308', // 🟡 Caution
  warning: '#F97316', // 🟠 Warning
  
  // Escalation flow
  escalation1: '#F25C2A',
  escalation2: '#F04438',
  escalation3: '#E53935',
  escalation4: '#D32F2F',

  maxRisk: '#EF4444', // 🔴 Max Risk
};

export type SignalColor = 
  | 'safe'
  | 'caution'
  | 'warning'
  | 'escalation1'
  | 'escalation2'
  | 'escalation3'
  | 'escalation4'
  | 'maxRisk';
