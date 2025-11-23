
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyBHdYTVWfwOc1gTn4y4SVYfnE54RBSWEN0';

// Expanded Fallback notes to prevent repetition if API fails
const FALLBACK_NOTES: Note[] = [
  { id: 'f1', content: "Recuerda que el mundo gira alrededor del sol y de su propio eje, no alrededor de las opiniones de ellos.", author: "Física Simple", theme: 'courage', style: 'midnight', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f2', content: "No elijas a cualquiera, elige a quien esté dispuesto a doblar rodillas ante Dios por ti.", author: "Estándares", theme: 'love', style: 'vintage', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f3', content: "Esa tormenta ya pasó. Deja de llover sobre mojado en tu mente.", author: "Paz Mental", theme: 'peace', style: 'botanical', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f4', content: "Eres el sol, deja de rogarle a una vela que te ilumine.", author: "Amor Propio", theme: 'hope', style: 'aura', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f5', content: "Si te costó tu paz mental, entonces te salió demasiado caro.", author: "Consejo", theme: 'courage', style: 'minimal', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f6', content: "No dejes que los comentarios de otros te hagan daño, ellos no conocen tu historia con Dios.", author: "Protección", theme: 'courage', style: 'classic', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f7', content: "Pon tu mente donde la tormenta ya acabó, aunque siga lloviendo afuera.", author: "Fe", theme: 'hope', style: 'cinema', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f8', content: "No eres lo que te pasó, eres quien decides ser ahora.", author: "Renacer", theme: 'hope', style: 'rose', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f9', content: "A veces Dios te quita el sueño para que despiertes.", author: "Señales", theme: 'peace', style: 'midnight', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f10', content: "Tu valor no disminuye por la incapacidad de alguien de verlo.", author: "Verdad", theme: 'love', style: 'classic', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f11', content: "El brillo que molesta a los demás es la luz que necesitas para tu camino.", author: "Luz Propia", theme: 'courage', style: 'aura', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f12', content: "No es soledad, es una cita contigo misma para reordenar el alma.", author: "Tiempo a solas", theme: 'peace', style: 'botanical', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f13', content: "Lo que es para ti, te encontrará incluso si te escondes.", author: "Destino", theme: 'hope', style: 'vintage', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f14', content: "Perdonar es liberar a un prisionero y descubrir que el prisionero eras tú.", author: "Libertad", theme: 'peace', style: 'minimal', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f15', content: "Sé la mujer que necesitabas cuando eras niña.", author: "Crecimiento", theme: 'love', style: 'rose', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f16', content: "Dios no te da la carga que pides, te da la espalda para cargarla.", author: "Fortaleza", theme: 'courage', style: 'cinema', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f17', content: "Deja de mirar el reloj, Dios tiene su propio tiempo.", author: "Paciencia", theme: 'hope', style: 'midnight', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f18', content: "Tu corazón es un jardín, deja de dejar entrar a gente que no riega las flores.", author: "Cuidado", theme: 'love', style: 'botanical', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f19', content: "No bajes la meta, aumenta el esfuerzo.", author: "Disciplina", theme: 'courage', style: 'minimal', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f20', content: "Respira. Es solo un mal día, no una mala vida.", author: "Perspectiva", theme: 'peace', style: 'aura', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f21', content: "Nadie es como tú, y ese es tu poder.", author: "Autenticidad", theme: 'love', style: 'classic', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f22', content: "Agradece incluso por las puertas que se cerraron.", author: "Gratitud", theme: 'hope', style: 'vintage', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f23', content: "Florece donde te planten, pero si la tierra es mala, muévete.", author: "Cambio", theme: 'courage', style: 'botanical', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f24', content: "Tu paz es el nuevo éxito.", author: "Prioridades", theme: 'peace', style: 'minimal', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f25', content: "Si no suma, que no reste. Y si resta, que se vaya.", author: "Matemáticas de Vida", theme: 'courage', style: 'rose', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f26', content: "Dios convierte las crisis en clases.", author: "Aprendizaje", theme: 'hope', style: 'classic', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f27', content: "La intuición es el GPS del alma, no la silencies.", author: "Escúchate", theme: 'peace', style: 'midnight', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f28', content: "Que tus sueños sean más grandes que tus miedos.", author: "Valentía", theme: 'courage', style: 'aura', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f29', content: "No necesitas brillar para nadie más que para ti.", author: "Esencia", theme: 'love', style: 'rose', timestamp: Date.now(), isGeneratedByAI: false },
  { id: 'f30', content: "El amor propio es el romance que dura toda la vida.", author: "Eterno", theme: 'love', style: 'vintage', timestamp: Date.now(), isGeneratedByAI: false }
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDailyNote = async (gender: Gender = 'female', mood: Mood = 'neutral'): Promise<Note> => {
  // Helper to return random fallback
  const getFallback = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_NOTES.length);
    return { ...FALLBACK_NOTES[randomIndex], id: crypto.randomUUID(), timestamp: Date.now(), isGeneratedByAI: false }; // Ensure fallback flag
  };

  if (!API_KEY) {
    console.warn("API Key not found, returning fallback note.");
    return getFallback();
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

    // Add Random Seed to Prompt to prevent caching/repetition
    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `
      Actúa como una voz sabia, 'aesthetic' y profunda (tipo consejera del alma o "el universo hablando").
      
      CONTEXTO:
      - Género: ${genderContext}
      - ESTADO DE ÁNIMO: ${moodContext}
      - FACTOR ALEATORIO: ${randomSeed} (Usa esto para variar tu respuesta y no repetir frases anteriores).

      TU OBJETIVO: Generar una frase corta, impactante y sanadora para ese estado de ánimo específico.

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
    if (!jsonResponse.content) return getFallback();

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
    return getFallback();
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
