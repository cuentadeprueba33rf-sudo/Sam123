
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult, AppMode, SocialPlatform, SocialStrategy } from "../types";

const API_KEY = 'AIzaSyCqFc9wfStocNV0weCvgxNBN9llpwkjVDI';

// Mensaje de error amigable solicitado
const FRIENDLY_ERROR_MSG = "Conexión inestable con el universo. SAM está recargando energía, por favor intenta mañana.";

// --- COLECCIÓN ETERNA (RESPALDO DE 365 NOTAS - UN AÑO COMPLETO) ---
const FALLBACK_QUOTES = [
  "Dios no llega tarde, tú te impacientas antes de tiempo. Respira y confía en que su plan es perfecto.",
  "Ora, espera y no te preocupes. La preocupación es como pagar una deuda que no tienes.",
  "Si Dios te quitó eso de tu vida, es porque te estorbaba para lo grandioso que viene en camino.",
  "Tu fe debe ser más grande que cualquier miedo que intente paralizarte. Recuerda que no caminas sola.",
  "Lo que es para ti, ni el diablo te lo quita. Puedes estar tranquila, lo que te pertenece llegará.",
  "No le cuentes a Dios cuán grande es tu problema, cuéntale a ese problema cuán inmenso es tu Dios.",
  "Eres absolutamente suficiente, tal y como eres en este preciso instante. No necesitas cambiar nada.",
  "No permitas que los comentarios de personas con mentes pequeñas definan la inmensidad de tu realidad.",
  "Recuerda que el mundo gira alrededor del sol y sobre su propio eje, no alrededor de ellos.",
  "Vales mucho más de lo que te han hecho creer las heridas del pasado. Tu valor es intrínseco.",
  "Tu paz mental no es negociable. Si algo o alguien te la roba, es demasiado caro.",
  "No eres una opción para ratos libres, eres un privilegio para toda la vida.",
  "Brilla con toda tu fuerza, y si a alguien le molesta tu luz, que se ponga gafas de sol.",
  "Si te hace dudar de tu valor, de tu paz o de tu cordura, ahí no es.",
  "No elijas a cualquiera por miedo a la soledad. Elige a quien te de paz.",
  "El interés se nota en las acciones, no en las palabras bonitas. Y el desinterés se nota más.",
  "No le guardes luto a alguien que eligió irse de tu vida. Agradécele por el espacio que dejó libre.",
  "Si hubiera querido, lo habría hecho. Deja de buscar excusas para justificar su falta de interés.",
  "Deja de buscar agua en pozos que tú misma sabes que están secos.",
  "A veces, perder a la persona equivocada es la mayor ganancia de tu vida.",
  "No lo llames orgullo, llámalo dignidad. Hay una gran diferencia entre rogar y valorar tu paz.",
  "El que se va sin que lo echen, a menudo vuelve sin que lo llamen. Cambia la cerradura.",
  "No eres un centro de rehabilitación para personas rotas. Tu misión es amarte a ti misma.",
  "Quien te quiere de verdad, te busca, te cuida y te respeta. Sin excusas.",
  "La vida es un eco; lo que envías, regresa. Lo que siembras, cosechas.",
  "No esperes nada de nadie, espéralo todo de ti. Eres la única capaz de cumplir tus sueños.",
  "Conviértete en el cambio que quieres ver en el mundo. Empieza por tu interior.",
  "La felicidad no es un destino, es una elección consciente de cada día.",
  "Disfruta de las pequeñas cosas, un día te darás cuenta de que eran las grandes cosas.",
  "La gratitud transforma lo que tienes en suficiente.",
  "Hazlo con miedo, pero hazlo. La valentía es actuar a pesar del miedo.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No cuentes los días, haz que los días cuenten.",
  "La vida es corta. Cómprate los zapatos, come el postre.",
  "Sonríe, es tu mejor venganza contra quien quiere verte mal.",
  "Eres la autora de tu propia vida, no dejes que nadie más escriba el guion."
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Exported so it can be used manually by the Menu button
export const getRandomFallbackNote = (): Note => {
  const content = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  const themes = ['hope', 'courage', 'love', 'peace'] as const;
  
  return {
    id: crypto.randomUUID(),
    content: content,
    author: "Colección Eterna",
    theme: themes[Math.floor(Math.random() * themes.length)],
    style: 'classic', // Default, user can change
    timestamp: Date.now(),
    isGeneratedByAI: false
  };
};

export const generateDailyNote = async (
  gender: Gender = 'female', 
  mood: Mood = 'neutral',
  mode: AppMode = 'neutral'
): Promise<Note> => {
  
  if (!API_KEY) {
    // Si no hay API KEY, fallback silencioso (simulando que la "conexión" trajo una nota guardada)
    return getRandomFallbackNote();
  }

  try {
    // Define gender context
    let genderContext = "";
    if (gender === 'female') {
      genderContext = "La usuaria es MUJER. Adjetivos femeninos obligatorios.";
    } else if (gender === 'male') {
      genderContext = "El usuario es HOMBRE. Adjetivos masculinos obligatorios.";
    } else {
      genderContext = "Neutro.";
    }

    // Define Mode Instructions (Personality)
    let modeInstruction = "";
    switch (mode) {
      case 'egocentric':
        modeInstruction = `
          🎭 MODO EGOCÉNTRICO (Main Character Energy):
          - Tono: Superioridad elegante, vanidad sana, inalcanzable.
          - Mensaje: Recuérdale que es un premio, no una opción.
          - Estilo: Frases de reina/rey.
        `;
        break;
      case 'redflags':
        modeInstruction = `
          🚩 MODO RED FLAGS (Amiga date cuenta):
          - Tono: Crudo, directo, "golpe de realidad".
          - Mensaje: Expón las excusas, la falta de interés o la manipulación.
          - Estilo: Una verdad incómoda que necesita oír.
        `;
        break;
      case 'power':
        modeInstruction = `
          ⚡ MODO PODER (Boss Energy):
          - Tono: Exigente, motivador, enfocado en el éxito/dinero.
          - Mensaje: "Deja de llorar y ponte a trabajar/estudiar".
          - Estilo: Órdenes directas al subconsciente.
        `;
        break;
      default: // Neutral
        modeInstruction = `
          ✨ MODO NEUTRO (Paz y Espiritualidad):
          - Tono: Cálido, espiritual, sanador.
          - Mensaje: Esperanza, fe y calma.
          - Estilo: Un abrazo en forma de texto.
        `;
        break;
    }

    // Define mood context (Secondary to Mode)
    let moodContext = "";
    if (mood !== 'neutral') {
       moodContext = `Estado emocional: ${mood}. Adapta el mensaje para ayudar con esto.`;
    }

    // Add Random Seed to Prompt
    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `
      Actúa según el MODO seleccionado.

      CONTEXTO:
      - Género: ${genderContext}
      - MODO (VIBRA): ${modeInstruction}
      - ${moodContext}
      - Random: ${randomSeed}

      TU OBJETIVO: Generar una NOTA CONCISA y SIGNIFICATIVA.
      
      REGLAS DE LONGITUD (IMPORTANTE):
      1. Longitud perfecta: Entre 25 y 40 palabras.
      2. Ni muy corta (que parezca vacía) ni muy larga (que de pereza leer).
      3. Estructura: Una afirmación fuerte seguida de una justificación emocional o consejo.
      4. Que se sienta como un mensaje que guardarías en favoritos.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres una IA que escribe frases profundas y estéticas. Tu longitud es equilibrada (2-3 oraciones).",
        temperature: 1.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            author: { type: Type.STRING, description: "Firma acorde al modo ej: 'Tu Ego', 'Realidad', 'El Jefe', 'Universo'" },
            theme: { type: Type.STRING, enum: ['hope', 'courage', 'love', 'peace'] }
          },
          required: ['content', 'author', 'theme']
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || '{}');
    
    if (!jsonResponse.content) return getRandomFallbackNote();

    // Determine style based on mode automatically
    let style: NoteStyle = 'classic';
    if (mode === 'egocentric') style = 'cinema';
    if (mode === 'redflags') style = 'minimal';
    if (mode === 'power') style = 'midnight';

    return {
      id: crypto.randomUUID(),
      content: jsonResponse.content,
      author: jsonResponse.author || "Nota Diaria",
      theme: jsonResponse.theme || 'hope',
      style: style, // Overwrite style based on mode for better UX
      timestamp: Date.now(),
      isGeneratedByAI: true 
    };

  } catch (error) {
    // Intercept ANY error and translate to user as "Connection Unstable / SAM Resting"
    // We return a fallback note instead of breaking the app, effectively "handling" the error gently.
    console.warn("Gemini Service Error (Translated to User as Unstable Connection):", error);
    return getRandomFallbackNote();
  }
};

export const analyzeImageForRestoration = async (base64Image: string): Promise<ExtractionResult> => {
  try {
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png"; 
    const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    const prompt = `
      ACTÚA COMO UN CURADOR DE CONTENIDO LITERARIO.
      Analiza si la imagen contiene una frase o cita válida.
      SI ES VÁLIDO: Extrae texto, autor y tema.
      SI ES INVÁLIDO: Marca isValid: false.
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
        temperature: 0.2,
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
    if (result.note) {
        return { ...result, note: { ...result.note, isGeneratedByAI: true }};
    }
    return result as ExtractionResult;

  } catch (error) {
    console.warn("Image Analysis Error:", error);
    // Explicitly return the friendly error message requested by the user
    return { isValid: false, errorReason: FRIENDLY_ERROR_MSG };
  }
};

// NEW FUNCTION: Social Media Strategy Generator
export const generateSocialStrategy = async (noteContent: string, platform: SocialPlatform): Promise<SocialStrategy> => {
  if (!API_KEY) throw new Error("No API Key");

  try {
    const prompt = `
      ACTÚA COMO UN EXPERTO EN CRECIMIENTO ORGÁNICO Y COPYWRITING PARA REDES SOCIALES.
      
      CONTENIDO DE LA NOTA: "${noteContent}"
      PLATAFORMA DESTINO: ${platform.toUpperCase()}

      OBJETIVO: Crear un post que genere interacción (likes, guardados, shares).

      GENERAR JSON:
      1. caption: El texto del post. Debe ser estético, emotivo y persuasivo. Usa saltos de línea y emojis minimalistas.
      2. hashtags: 5-8 hashtags mezclando nicho (específicos) y alcance (generales).
      3. viralHook: Una frase CORTA (menos de 50 caracteres) para poner en el video/imagen o primera línea que detenga el scroll.
      4. strategyTip: Un consejo breve de SAM sobre qué música, hora o formato usar para esta nota específica.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            viralHook: { type: Type.STRING },
            strategyTip: { type: Type.STRING }
          },
          required: ['caption', 'hashtags', 'viralHook', 'strategyTip']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as SocialStrategy;

  } catch (error) {
    console.error("Social Strategy Error:", error);
    throw new Error(FRIENDLY_ERROR_MSG);
  }
};
