
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyDxbOZeDJbjZHueoc3inI7aPmFWvrZ3MOs';

// Colección de respaldo eliminada a petición del usuario.
// Se define una única nota de error técnico para manejar fallos de conexión.
const ERROR_NOTE: Note = {
  id: 'connection-error',
  content: "La conexión con la inspiración se ha interrumpido momentáneamente. Por favor, intenta de nuevo.",
  author: "Sistema",
  theme: 'peace',
  style: 'minimal',
  timestamp: Date.now(),
  isGeneratedByAI: false
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDailyNote = async (
  gender: Gender = 'female', 
  mood: Mood = 'neutral',
  customInstruction: string = ''
): Promise<Note> => {
  
  if (!API_KEY) {
    console.warn("API Key not found.");
    return { ...ERROR_NOTE, timestamp: Date.now() };
  }

  try {
    // Define gender context
    let genderContext = "";
    if (gender === 'female') {
      genderContext = "La usuaria es MUJER. Adjetivos femeninos obligatorios (ej: 'cansada', 'valiosa', 'decidida').";
    } else if (gender === 'male') {
      genderContext = "El usuario es HOMBRE. Adjetivos masculinos obligatorios (ej: 'cansado', 'valioso', 'decidido').";
    } else {
      genderContext = "Neutro.";
    }

    // Define mood context
    let moodContext = "";
    switch (mood) {
      case 'anxious': moodContext = "El usuario siente ANSIEDAD. Necesita leer algo que le de paz inmediata. Calma, respirar, todo estará bien."; break;
      case 'sad': moodContext = "El usuario siente TRISTEZA. Necesita un abrazo en palabras. Validar el dolor pero recordar que pasará."; break;
      case 'grateful': moodContext = "El usuario siente GRATITUD. Potencia esa energía positiva."; break;
      case 'tired': moodContext = "El usuario siente AGOTAMIENTO. Recuérdale que descansar no es rendirse."; break;
      case 'confused': moodContext = "El usuario siente CONFUSIÓN. Dale una verdad clara y directa. Sin rodeos."; break;
      default: moodContext = "Estado normal. Un consejo de vida útil y bonito.";
    }

    // Handle Custom Instruction Priority
    let customInstructionContext = "";
    if (customInstruction && customInstruction.trim() !== "") {
      customInstructionContext = `
        🚨 INSTRUCCIÓN DEL USUARIO (PRIORIDAD MÁXIMA):
        El usuario ha pedido explícitamente: "${customInstruction}".
        IMPORTANTE: Si esta instrucción contradice al estado de ánimo, IGNORA el estado de ánimo y obedece esta instrucción.
        Adapta el tono y el contenido al 100% a lo que pide el usuario aquí.
      `;
    }

    // Add Random Seed to Prompt to prevent caching/repetition
    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `
      Actúa como una mejor amiga sabia, una hermana mayor o esa voz interior que te dice la verdad con amor.

      CONTEXTO:
      - Género: ${genderContext}
      - ESTADO DE ÁNIMO: ${moodContext}
      ${customInstructionContext}
      - FACTOR ALEATORIO: ${randomSeed}

      TU OBJETIVO: Generar una frase corta, emocional y MUY FÁCIL DE ENTENDER.

      REGLAS DE ORO (ESTRICTAS):
      1. 🚫 CERO FILOSOFÍA COMPLEJA: No uses palabras raras, ni metáforas abstractas sobre el cosmos o el éter que nadie entiende.
      2. LENGUAJE SENCILLO: Habla como habla la gente normal en redes sociales. Directo al corazón y a la realidad.
      3. TEMAS: Amor propio, fe (Dios), sanar relaciones, soltar lo que duele, y realidad pura.
      4. NO EXCESO DE "AMIGA": No repitas "amiga" o "amigo" en cada frase (suena falso). Habla de tú a tú.
      
      EJEMPLOS DEL ESTILO QUE BUSCO (Directos y Claros):
      - "Si te hace dudar, ahí no es."
      - "No le pidas a Dios que te lo devuelva, pídele que te sane."
      - "Llora lo que tengas que llorar, y luego levántate."
      - "El interés se nota, y el desinterés se nota más."
      - "Tu paz mental no es negociable."
      - "No guardes luto por alguien que sigue vivo pero eligió no estar."
      - "Recuerda que cada tormenta tiene su final."

      Longitud: Máximo 20-25 palabras. Corto, contundente y estético.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres una consejera emocional directa y clara. Evitas el lenguaje complicado.",
        temperature: 1.4, // High temperature for simpler, more varied, less robotic responses
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            author: { type: Type.STRING, description: "Firma corta estética ej: 'Nota Mental', 'Universo', 'Dios contigo', 'Tu corazón'" },
            theme: { type: Type.STRING, enum: ['hope', 'courage', 'love', 'peace'] }
          },
          required: ['content', 'author', 'theme']
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || '{}');
    
    // Check if content is empty (failed generation)
    if (!jsonResponse.content) return { ...ERROR_NOTE, timestamp: Date.now() };

    // ALWAYS return 'classic' style by default as requested.
    const defaultStyle: NoteStyle = 'classic';

    return {
      id: crypto.randomUUID(),
      content: jsonResponse.content,
      author: jsonResponse.author || "Nota Diaria",
      theme: jsonResponse.theme || 'hope',
      style: defaultStyle,
      timestamp: Date.now(),
      isGeneratedByAI: true // Success flag
    };

  } catch (error) {
    console.error("Error generating note:", error);
    return { ...ERROR_NOTE, timestamp: Date.now() };
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
      ACTÚA COMO UN CURADOR DE CONTENIDO LITERARIO ESTÉTICO (MODO ESTRICTO).

      TU MISIÓN:
      Analizar si la imagen contiene un MENSAJE, FRASE CORTA o CITA válida para una "Nota del Alma".

      CRITERIOS DE VALIDACIÓN (EXTREMADAMENTE ESTRICTO):
      
      ✅ VÁLIDO (Acepta):
      - Frases cortas inspiradoras (Máximo ~40-50 palabras).
      - Capturas de Tweets/Posts/Notas de celular con pensamientos breves y profundos.
      - Poemas cortos o versos (Haikus, estrofas pequeñas).
      - Mensajes de chat breves con valor sentimental.
      
      ❌ INVÁLIDO (Rechaza inmediatamente):
      - ⛔ TEXTOS LARGOS: Artículos, páginas enteras de libros, parrafadas densas, cartas largas. (Si da pereza leerlo, RECHÁZALO).
      - Capturas de interfaz de sistema (Menús, Wi-Fi, Batería, Mapas).
      - Tareas escolares, matemáticas, cuestionarios.
      - Noticias, periodismo o información técnica.
      - Conversaciones triviales ("Hola", "¿Qué haces?").
      - Memes vulgares, chistes simples o capturas de videojuegos.

      SI ES VÁLIDO:
      1. Extrae el texto completo, limpiando errores.
      2. Deduce un autor o pon "Anónimo".
      3. Clasifica tema y estilo.

      SI ES INVÁLIDO:
      - Marca isValid: false.
      - Explica la razón en 'errorReason' (ej: "El texto es demasiado largo. Esta app es para frases cortas e impactantes.", "No detecto una frase inspiradora, parece una captura de pantalla del sistema.").
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
        temperature: 0.2, // Very low temperature for strict logic
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
    
    // In restoration, we treat it as "AI Generated" (or at least processed)
    if (result.note) {
        return { ...result, note: { ...result.note, isGeneratedByAI: true }};
    }
    return result as ExtractionResult;

  } catch (error) {
    console.error("Error analyzing image:", error);
    return { isValid: false, errorReason: "Error al procesar la imagen. Intenta con otra foto o formato." };
  }
};
