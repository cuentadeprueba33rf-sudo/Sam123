import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyBHdYTVWfwOc1gTn4y4SVYfnE54RBSWEN0';

// Fallback notes mixed: Secular, Spiritual, and Tough Love
const FALLBACK_NOTES: Note[] = [
  {
    id: 'fallback-1',
    content: "Recuerda que el mundo gira alrededor del sol y de su propio eje, no alrededor de las opiniones de ellos.",
    author: "Recordatorio",
    theme: 'courage',
    style: 'classic',
    timestamp: Date.now()
  },
  {
    id: 'fallback-2',
    content: "No elijas a cualquiera, elige a quien esté dispuesto a doblar rodillas ante Dios por ti.",
    author: "Estándares",
    theme: 'love',
    style: 'classic',
    timestamp: Date.now()
  },
  {
    id: 'fallback-3',
    content: "Esa tormenta ya pasó. Deja de llover sobre mojado en tu mente.",
    author: "Paz Mental",
    theme: 'peace',
    style: 'classic',
    timestamp: Date.now()
  },
  {
    id: 'fallback-4',
    content: "Eres el sol, deja de rogarle a una vela que te ilumine.",
    author: "Amor Propio",
    theme: 'hope',
    style: 'classic',
    timestamp: Date.now()
  },
  {
    id: 'fallback-5',
    content: "Si te costó tu paz mental, entonces te salió demasiado caro.",
    author: "Consejo",
    theme: 'courage',
    style: 'classic',
    timestamp: Date.now()
  }
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDailyNote = async (gender: Gender = 'female', mood: Mood = 'neutral'): Promise<Note> => {
  if (!API_KEY) {
    console.warn("API Key not found, returning fallback note.");
    return FALLBACK_NOTES[Math.floor(Math.random() * FALLBACK_NOTES.length)];
  }

  try {
    // Define gender context
    let genderContext = "";
    if (gender === 'female') {
      genderContext = "La usuaria es MUJER. Adjetivos femeninos obligatorios (ej: 'cansada', 'valiosa').";
    } else if (gender === 'male') {
      genderContext = "El usuario es HOMBRE. Adjetivos masculinos obligatorios (ej: 'cansado', 'valioso').";
    } else {
      genderContext = "Neutro.";
    }

    // Define mood context
    let moodContext = "";
    switch (mood) {
      case 'anxious': moodContext = "El usuario siente ANSIEDAD. La nota debe ser calmante, sobre respirar, soltar el control y confiar."; break;
      case 'sad': moodContext = "El usuario siente TRISTEZA. La nota debe ser un abrazo, validar el dolor pero dar esperanza suave."; break;
      case 'grateful': moodContext = "El usuario siente GRATITUD. La nota debe potenciar esa energía y multiplicarla."; break;
      case 'tired': moodContext = "El usuario siente AGOTAMIENTO. La nota debe recordarle que descansar es productivo y no rendirse."; break;
      case 'confused': moodContext = "El usuario siente CONFUSIÓN. La nota debe ofrecer claridad, enfoque y dirección simple."; break;
      default: moodContext = "Estado normal. Nota inspiradora general.";
    }

    const prompt = `
      Actúa como una voz sabia, 'aesthetic' y profunda (tipo consejera del alma o "el universo hablando").
      
      CONTEXTO:
      - Género: ${genderContext}
      - ESTADO DE ÁNIMO: ${moodContext}

      TU OBJETIVO: Generar una frase corta, impactante y sanadora para ese estado de ánimo específico.

      REGLAS DE ORO (ESTRICTAS):
      1. PROHIBIDO usar vocativos como "amiga", "amigo", "hermana", "bro", "querida". Habla directamente a la situación o sentimiento.
         - MAL: "Amiga, no te rindas."
         - BIEN: "Rendirse no es una opción hoy."
      2. CERO palabras rebuscadas. Lenguaje natural y moderno.
      3. VIBRA: Minimalista, profunda, directa al corazón.
      
      BALANCE DE TEMAS:
      - Mezcla psicología ("date cuenta") con espiritualidad ("Dios/Universo").
      
      EJEMPLOS DE ESTILO:
      - "No elijas a cualquiera, elige a esa persona que ore por ti."
      - "El mundo gira alrededor del sol, no alrededor de sus comentarios."
      - "Si te hace dudar de tu valor, ahí no es."
      - "Deja de intentar sanar en el mismo lugar donde te enfermaste."

      Longitud: Máximo 25 palabras. Conciso.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres una fuente de inspiración visual. Generas frases cortas. NUNCA usas la palabra 'amiga' ni 'amigo'.",
        temperature: 1.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            author: { type: Type.STRING, description: "Firma corta estética ej: 'Nota Mental', 'Universo', 'Dios contigo'" },
            theme: { type: Type.STRING, enum: ['hope', 'courage', 'love', 'peace'] }
          },
          required: ['content', 'author', 'theme']
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || '{}');
    
    // ALWAYS return 'classic' style by default as requested.
    // User can change it manually in the UI.
    const defaultStyle: NoteStyle = 'classic';

    return {
      id: crypto.randomUUID(),
      content: jsonResponse.content || FALLBACK_NOTES[0].content,
      author: jsonResponse.author || "Nota Diaria",
      theme: jsonResponse.theme || 'hope',
      style: defaultStyle,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Error generating note:", error);
    return FALLBACK_NOTES[Math.floor(Math.random() * FALLBACK_NOTES.length)];
  }
};

export const analyzeImageForRestoration = async (base64Image: string): Promise<ExtractionResult> => {
  try {
    // 1. Extract dynamic mime type from the base64 header to be robust
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png"; 
    
    // 2. Clean the base64 string
    const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    const prompt = `
      ACTÚA COMO UN CURADOR DE CONTENIDO LITERARIO Y EMOCIONAL.

      TU MISIÓN:
      Analizar si la imagen contiene un MENSAJE, FRASE, POEMA o CITA que tenga VALOR EMOCIONAL, INSPIRADOR O ESTÉTICO.

      CRITERIOS DE VALIDACIÓN (MUY ESTRICTO - NO ACEPTES TEXTO BASURA):
      
      ✅ VÁLIDO (Acepta y extrae):
      - Frases inspiradoras, tristes, de amor, desamor o motivación.
      - Capturas de Tweets, Posts de Instagram o Notas de celular que contengan pensamientos profundos.
      - Poemas, versos o escritos a mano con significado.
      - Mensajes de chat que sean sentimentales (ej: una confesión, un consejo, una despedida).
      
      ❌ INVÁLIDO (Rechaza inmediatamente aunque tenga texto):
      - Capturas de interfaz de sistema (Menús de Wi-Fi, Batería, Ajustes, Pantalla de inicio).
      - Tareas escolares, fórmulas matemáticas, cuestionarios o código de programación.
      - Noticias, artículos periodísticos, publicidad o capturas de bancos.
      - Conversaciones triviales o funcionales (ej: "¿Dónde estás?", "Compra leche", "Jajaja ok").
      - Memes vulgares, chistes simples o capturas de videojuegos.
      - Documentos, facturas o texto puramente informativo.

      SI ES VÁLIDO:
      1. Extrae el texto completo del mensaje, corrigiendo errores obvios.
      2. Si hay un autor visible, úsalo. Si no, pon "Anónimo" o deduce uno (ej: "Twitter", "Nota Mental").
      3. Clasifica el tema (hope, courage, love, peace).
      4. Sugiere un estilo visual adecuado para el mensaje.

      SI ES INVÁLIDO:
      - Marca isValid: false.
      - Explica la razón en 'errorReason' (ej: "Es una captura de un menú de ajustes, no es una frase inspiradora.").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.4, // Low temperature for strict adherence to validation rules
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            errorReason: { type: Type.STRING },
            note: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                author: { type: Type.STRING },
                theme: { type: Type.STRING, enum: ['hope', 'courage', 'love', 'peace'] },
                style: { type: Type.STRING, enum: ['classic', 'midnight', 'aura', 'minimal', 'botanical', 'cinema', 'vintage', 'rose'] }
              }
            }
          },
          required: ['isValid']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as ExtractionResult;

  } catch (error) {
    console.error("Error analyzing image:", error);
    return { isValid: false, errorReason: "Error al procesar la imagen. Intenta con otra foto o formato." };
  }
};