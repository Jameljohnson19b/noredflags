import { defineString } from 'firebase-functions/params';

export const env = {
  DEEPSEEK_API_KEY: defineString('DEEPSEEK_API_KEY'),
};
