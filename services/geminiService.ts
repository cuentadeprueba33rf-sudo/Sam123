
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyDXNpEYeT_8fSEDCCGftwmY_srTeP-jtbA';

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
      Actúa como una voz sabia, 'aesthetic' y profunda (tipo consejera del alma o "el universo hablando").
      
      CONTEXTO:
      - Género: ${genderContext}
      - ESTADO DE ÁNIMO: ${moodContext}
      ${customInstructionContext}
      - FACTOR ALEATORIO: ${randomSeed} (Usa esto para variar tu respuesta y no repetir frases anteriores).

      TU OBJETIVO: Generar una frase corta, impactante y sanadora.

      REGLAS DE ORO (ESTRICTAS):
      1. PROHIBIDO usar vocativos repetitivos como "amiga", "amigo", "hermana". Habla directamente a la situación.
      2. CERO palabras rebuscadas. Lenguaje natural y moderno.
      3. VIBRA: Minimalista, profunda, directa al corazón.
      
      BALANCE DE TEMAS:
      - Mezcla psicología ("date cuenta") con espiritualidad ("Dios/Universo").
      
      EJEMPLOS DE ESTILO (NO LOS COPIES LITERALMENTE, CREA NUEVOS):
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
        systemInstruction: "Eres una fuente de inspiración visual. Generas frases cortas y únicas cada vez.",
        temperature: 1.3, // High temperature for maximum variety
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
