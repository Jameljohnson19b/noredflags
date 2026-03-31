import { env } from '../config/env';

export interface SignalSignal {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX';
    reasoning: string;
    confidence: number;
}

export class DeepSeekService {
    private readonly apiKey: string;
    private readonly apiUrl: string = 'https://api.deepseek.com/v1';

    constructor() {
        this.apiKey = env.DEEPSEEK_API_KEY;
    }

    /**
     * TEXTUAL INTERPRETATION
     * Analyzes raw observation notes or transcribed voice text for psychological dating signals.
     */
    async analyzeSignal(content: string): Promise<SignalSignal> {
        if (!this.apiKey) throw new Error("DEEPSEEK_API_KEY NOT FOUND In Secret Manager.");

        try {
            const response = await fetch(`${this.apiUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { 
                          role: 'system', 
                          content: `You are REDFLAGS, a dating psychological risk assessment engine. 
                          Analyze the user's dating observation or signal for caution flags (Green/Yellow/Red/Max). 
                          Think about emotional intelligence, boundaries, and red flags.
                          Output MUST be a valid JSON object: 
                          { "riskLevel": "LOW"|"MEDIUM"|"HIGH"|"MAX", "reasoning": "A concise, hard-hitting analysis.", "confidence": 0.0-1.0 }` 
                        },
                        { role: 'user', content }
                    ],
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`DeepSeek AI Error: ${response.status} - ${JSON.stringify(errData)}`);
            }

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (e: any) {
            console.error("[DeepSeek] Interpretation Error:", e.message);
            throw e;
        }
    }

    /**
     * VISION INGESTION
     * Processes base64 encoded screenshots (bios/DMs).
     */
    async analyzeImage(base64: string): Promise<{ description: string }> {
        // Deepseek V3/Chat endpoint is text-only for now in most configurations.
        // We simulate interpretation for the MVP until a full Vision-capable model is confirmed.
        // If GPT-4o Vision is available, update endpoint accordingly.
        
        console.log(`[Vision] Processing image payload... Length: ${base64.length}`);
        
        return { 
          description: "[IMAGE OCR SIMULATION] Dating application screenshot detected. Content: 'We should meet up tomorrow? Only if you promise not to be a serial killer haha.' Interpretation: Playful banter but checking safety boundaries." 
        };
    }
}

export const deepseekService = new DeepSeekService();
