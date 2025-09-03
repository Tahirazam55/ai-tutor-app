import { GoogleGenAI, Part, Content } from '@google/genai';
import { Language, Message, Role } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const messageToContent = (msg: Message): Content => {
    const role = msg.role === Role.AI ? 'model' : 'user';
    
    const parts: Part[] = [];

    if (msg.imageUrl) {
        const [meta, base64Data] = msg.imageUrl.split(',');
        if (meta && base64Data) {
            const mimeTypeMatch = meta.match(/data:(.*);base64/);
            if (mimeTypeMatch && mimeTypeMatch[1]) {
                 const mimeType = mimeTypeMatch[1];
                 parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                    },
                 });
            }
        }
    }

    if (msg.text) {
        parts.push({ text: msg.text });
    }

    return { role, parts };
};

export const getAiStreamResponse = (history: Message[], language: Language) => {
    // The first message is the initial greeting from the AI, which shouldn't be part of the model's history.
    const contents = history.slice(1).map(messageToContent);

    return ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction: language === Language.Urdu ? SYSTEM_INSTRUCTION.ur : SYSTEM_INSTRUCTION.en,
        }
    });
};
