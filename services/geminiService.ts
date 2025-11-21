import { GoogleGenAI, Type } from "@google/genai";
import { Note } from "../types";

const API_KEY = process.env.API_KEY || '';

// Fallback notes mixed: Secular, Spiritual, and Tough Love
const FALLBACK_NOTES: Note[] = [
  {
    id: 'fallback-1',
    content: "Recuerda que el mundo gira alrededor del sol y de su propio eje, no alrededor de las opiniones de ellos.",
    author: "Recordatorio",
    theme: 'courage',
    timestamp: Date.now()
  },
  {
    id: 'fallback-2',
    content: "No elijas a cualquiera, elige a quien esté dispuesto a doblar rodillas ante Dios por ti.",
    author: "Estándares",
    theme: 'love',
    timestamp: Date.now()
  },
  {
    id: 'fallback-3',
    content: "Esa tormenta ya pasó. Deja de llover sobre mojado en tu mente.",
    author: "Paz Mental",
    theme: 'peace',
    timestamp: Date.now()
  },
  {
    id: 'fallback-4',
    content: "Eres el sol, deja de rogarle a una vela que te ilumine.",
    author: "Amor Propio",
    theme: 'hope',
    timestamp: Date.now()
  },
  {
    id: 'fallback-5',
    content: "Si te costó tu paz mental, entonces te salió demasiado caro.",
    author: "Consejo",
    theme: 'courage',
    timestamp: Date.now()
  }
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDailyNote = async (userName: string = ''): Promise<Note> => {
  if (!API_KEY) {
    console.warn("API Key not found, returning fallback note.");
    return FALLBACK_NOTES[Math.floor(Math.random() * FALLBACK_NOTES.length)];
  }

  try {
    // Updated prompt to ensure variety (not just religious)
    const prompt = `
      Actúa como una mejor amiga sabia, 'aesthetic' y directa (tipo "sister" o consejera).
      
      TU OBJETIVO: Generar una frase corta, impactante y sanadora para una nota visual.

      REGLAS DE BALANCE (IMPORTANTE):
      - No hagas que todas las notas sean sobre Dios. VARÍA LOS TEMAS.
      - 40% Amor propio / Empoderamiento ("Eres el sol", "No ruegues").
      - 30% Espiritualidad / Fe ("Dios tiene un plan", "Oración").
      - 30% Salud Mental / Superación ("La tormenta pasa", "Suelta el control").

      ESTILO DE ESCRITURA:
      - CERO palabras rebuscadas o filosóficas. Habla claro y al corazón.
      - Tono: "Amiga date cuenta", cálido pero firme.
      
      EJEMPLOS DE LA VIBRA QUE BUSCO (MEZCLADOS):
      - "No elijas a cualquiera, elige a esa persona que ore por ti." (Espiritual)
      - "El mundo gira alrededor del sol, no alrededor de los comentarios de ellos." (Amor propio)
      - "No pongas tu mente en la tormenta, ponla en la calma que viene." (Mentalidad)
      - "Si te hace dudar de tu valor, ahí no es." (Relaciones)
      - "Deja de intentar sanar en el mismo lugar donde te enfermaste." (Realidad)

      Longitud: Máximo 25 palabras.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres una voz femenina, moderna y estética. Alternas entre consejos terrenales y espirituales.",
        temperature: 1.2, // High temperature for more variety
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            author: { type: Type.STRING, description: "Firma corta estética ej: 'Amor Propio', 'Nota Mental', 'Universo', 'Dios contigo'" },
            theme: { type: Type.STRING, enum: ['hope', 'courage', 'love', 'peace'] }
          },
          required: ['content', 'author', 'theme']
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || '{}');
    
    return {
      id: crypto.randomUUID(),
      content: jsonResponse.content || FALLBACK_NOTES[0].content,
      author: jsonResponse.author || "Nota Diaria",
      theme: jsonResponse.theme || 'hope',
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Error generating note:", error);
    return FALLBACK_NOTES[Math.floor(Math.random() * FALLBACK_NOTES.length)];
  }
};