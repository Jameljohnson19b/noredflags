// Standard runtime environment access
// When deployed with secrets: ["DEEPSEEK_API_KEY"], 
// Firebase populates process.env.DEEPSEEK_API_KEY automatically.

export const env = {
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production'
};
