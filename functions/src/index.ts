import { onRequest } from 'firebase-functions/v2/https';
import { analyzeSessionHandler } from './routes/analyzeSession';
import { env } from './config/env';

export const analyzeSession = onRequest(
  {
    secrets: [env.DEEPSEEK_API_KEY],
    cors: true,
  },
  analyzeSessionHandler
);

// We will add createCheckoutSession and more webhook logic here later as per the BUILD ORDER
