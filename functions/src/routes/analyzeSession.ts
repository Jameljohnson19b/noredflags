import { Request, Response } from 'firebase-functions/v2/https';
import { DeepSeekService } from '../services/deepseekService';
import { db } from '../config/firebaseAdmin';

export const analyzeSessionHandler = async (req: Request, res: Response): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { statement, sessionId, userId, userContext } = req.body;

    if (!statement || !sessionId || !userId) {
       res.status(400).json({ error: 'Missing required fields: statement, sessionId, userId.' });
       return;
    }

    // Capture what was said. Reveal what it might mean.
    const analysis = await DeepSeekService.analyzeStatement(statement, userContext);

    const signalData = {
      content: statement,
      riskLevel: analysis.riskLevel,
      reasoning: analysis.reasoning,
      confidence: analysis.confidence,
      createdAt: new Date().getTime(),
    };

    // Store in Firestore securely
    await db.collection('users').doc(userId).collection('sessions').doc(sessionId).collection('signals').add(signalData);

    res.status(200).json({ success: true, signal: signalData });
  } catch (error: any) {
    console.error("Handler Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
