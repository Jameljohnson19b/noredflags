import { Request, Response } from "express";
import { deepseekService } from "../services/deepseekService";
import { db } from "../lib/firebase";

/**
 * REDFLAGS AI Analysis Handler
 * Unified route for both Text and Vision signals.
 */
export const analyzeSessionHandler = async (req: Request, res: Response) => {
    try {
        const { statement, image, sessionId, userId } = req.body;

        if (!sessionId || !userId) {
            return res.status(400).json({ error: "Context missing (sessionId or userId)." });
        }

        let content = statement;
        
        // VISION INGESTION: If image is provided, describe it first.
        if (image) {
            console.log(`[analyzeSession] Reaching Vision endpoint for session ${sessionId}`);
            const visionResult = await deepseekService.analyzeImage(image);
            content = visionResult.description;
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "No signal captured (empty text or image)." });
        }

        // COGNITIVE INTERPRETATION: Run through REDFLAGS Core
        const signal = await deepseekService.analyzeSignal(content);

        // PERSISTENCE: Save trace to user's history
        const sessionRef = db.collection('users').doc(userId).collection('sessions').doc(sessionId);
        const signalDoc = await sessionRef.collection('signals').add({
            content,
            riskLevel: signal.riskLevel,
            reasoning: signal.reasoning,
            confidence: signal.confidence,
            createdAt: Date.now()
        });

        console.log(`[analyzeSession] Success: Recorded signal ${signalDoc.id} for user ${userId}`);

        return res.json({ 
            success: true, 
            signal: { 
                ...signal, 
                content, 
                createdAt: Date.now() 
            } 
        });
    } catch (err: any) {
        console.error("ANALYSIS EXCEPTION:", err);
        return res.status(500).json({ 
            error: "Backend Engine Failure", 
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};
