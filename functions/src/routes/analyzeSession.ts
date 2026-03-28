import { Request } from 'firebase-functions/v2/https';
import { DeepSeekService } from '../services/deepseekService';
import { db } from '../config/firebaseAdmin';

// Fix: Using any for response to resolve typing mismatch with Express during build
export const analyzeSessionHandler = async (req: Request, res: any): Promise<void> => {
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

    const lensRef = db.collection('users').doc(userId).collection('profile').doc('lens');
    const lensSnap = await lensRef.get();
    
    const activeLens = lensSnap.exists ? lensSnap.data() : userContext;

    const analysis = await DeepSeekService.analyzeStatement(statement, activeLens);

    const signalData = {
      content: statement,
      riskLevel: analysis.riskLevel,
      reasoning: analysis.reasoning,
      confidence: analysis.confidence,
      createdAt: new Date().getTime(),
    };

    await db.collection('users').doc(userId).collection('sessions').doc(sessionId).collection('signals').add(signalData);

    res.status(200).json({ success: true, signal: signalData });
  } catch (error: any) {
    console.error("Handler Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
