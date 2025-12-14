
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult, AppMode, SocialPlatform, SocialStrategy } from "../types";

const API_KEY = 'AIzaSyCqFc9wfStocNV0weCvgxNBN9llpwkjVDI';

// Mensaje de error unificado (Persona de SAM)
const FRIENDLY_ERROR_MSG = "SAM está envolviendo regalos cósmicos. La conexión con el Polo Norte falló, intenta de nuevo.";

// --- COLECCIÓN ETERNA (BASE) ---
const FALLBACK_QUOTES = [
  "Esta Navidad, el mejor regalo eres tú sanando, creciendo y amándote.",
  "Que la magia de estos días te recuerde que los milagros ocurren cuando crees en ti.",
  "No necesitas a nadie bajo el muérdago para sentirte completa. Eres tu propia celebración.",
  "Cierra los ojos y pide un deseo; el universo ya está trabajando en su envío.",
  "Dios no llega tarde, tú te impacientas antes de tiempo. Respira y confía en que su plan es perfecto.",
  "Lo que es para ti, ni el diablo te lo quita. Puedes estar tranquila, lo que te pertenece llegará.",
  "Tu paz mental no es negociable. Si algo o alguien te la roba, es demasiado caro.",
  "Brilla con toda tu fuerza, y si a alguien le molesta tu luz, que se ponga gafas de sol.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "La vida es corta. Cómprate los zapatos, come el postre, abraza fuerte.",
  "Diciembre es para soltar lo que dolió y abrir los brazos a lo que vendrá.",
  "Tu luz es suficiente para iluminar cualquier noche oscura. Feliz renacer."
];

// --- COLECCIÓN EXPANDIDA (DESBLOQUEABLE) ---
const TIER_1_QUOTES = [ // Nivel 2: Susurros del Alma
  "A veces perderse es la única manera de encontrarse de verdad.",
  "Tu intuición es la voz de tu alma; nunca dejes de escucharla.",
  "Lo que buscas también te está buscando a ti. Mantén la fe.",
  "Eres arte en los ojos de quien sabe mirar con el corazón.",
  "No floreces para que te vean, floreces porque estás viva."
];

const TIER_2_QUOTES = [ // Nivel 4: Ecos del Destino
  "El universo no comete errores. Si estás aquí, es por una razón divina.",
  "Tu historia es única y el mundo necesita escuchar tu voz.",
  "La herida es el lugar por donde entra la luz. Sana con amor.",
  "No eres lo que te pasó, eres en quien decides convertirte.",
  "El coraje no es la ausencia de miedo, es caminar a pesar de él."
];

const TIER_3_QUOTES = [ // Nivel 6: Secretos Estelares
  "Estás hecha de polvo de estrellas; brillar es tu naturaleza inevitable.",
  "El amor propio es la revolución más silenciosa y poderosa que existe.",
  "Todo lo que necesitas ya está dentro de ti, esperando despertar.",
  "Confía en la magia de los nuevos comienzos, incluso si empiezan pequeños.",
  "Eres infinita, eterna y absolutamente inolvidable para el universo."
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Exported so it can be used manually by the Menu button
export const getRandomFallbackNote = (rewardLevel: number = 0): Note => {
  // Combine pools based on reward level
  let availableQuotes = [...FALLBACK_QUOTES];
  
  if (rewardLevel >= 2) availableQuotes = [...availableQuotes, ...TIER_1_QUOTES];
  if (rewardLevel >= 4) availableQuotes = [...availableQuotes, ...TIER_2_QUOTES];
  if (rewardLevel >= 6) availableQuotes = [...availableQuotes, ...TIER_3_QUOTES];

  const content = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  const themes = ['hope', 'courage', 'love', 'peace'] as const;
  
  // Decide author name based on exclusivity
  let authorName = "Colección Navideña";
  if (TIER_3_QUOTES.includes(content)) authorName = "Secreto Estelar";
  else if (TIER_2_QUOTES.includes(content)) authorName = "Eco del Destino";
  else if (TIER_1_QUOTES.includes(content)) authorName = "Susurro del Alma";

  return {
    id: crypto.randomUUID(),
    content: content,
    author: authorName,
    theme: themes[Math.floor(Math.random() * themes.length)],
    style: 'christmas', // Default to Christmas for fallback now
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
      case 'christmas':
        modeInstruction = `
          🎄 MODO NAVIDAD MÁGICA:
          - Tono: Mágico, cálido, esperanzador, familiar, acogedor.
          - Mensaje: Sobre nuevos comienzos, gratitud, amor propio en fiestas, milagros de diciembre.
          - Estilo: Como una carta de Santa o del Universo.
        `;
        break;
      case 'egocentric':
        modeInstruction = `
          🎭 MODO EGOCÉNTRICO (Main Character Energy):
          - Tono: Superioridad elegante, vanidad sana, inalcanzable.
          - Mensaje: Recuérdale que es un premio, no una opción.
        `;
        break;
      case 'redflags':
        modeInstruction = `
          🚩 MODO RED FLAGS (Amiga date cuenta):
          - Tono: Crudo, directo, "golpe de realidad".
          - Mensaje: Expón las excusas o la falta de interés.
        `;
        break;
      case 'power':
        modeInstruction = `
          ⚡ MODO PODER (Boss Energy):
          - Tono: Exigente, motivador, enfocado en el éxito/dinero.
        `;
        break;
      default: // Neutral
        modeInstruction = `
          ✨ MODO NEUTRO (Paz y Espiritualidad):
          - Tono: Cálido, espiritual, sanador.
          - Mensaje: Esperanza, fe y calma.
        `;
        break;
    }

    // Define mood context
    let moodContext = "";
    if (mood === 'festive') {
        moodContext = "Estado: Festivo/Navideño. Celebra la vida.";
    } else if (mood !== 'neutral') {
       moodContext = `Estado emocional: ${mood}. Adapta el mensaje para ayudar con esto.`;
    }

    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `
      Actúa según el MODO seleccionado.

      CONTEXTO:
      - Género: ${genderContext}
      - MODO (VIBRA): ${modeInstruction}
      - ${moodContext}
      - Random: ${randomSeed}

      TU OBJETIVO: Generar una NOTA CONCISA y SIGNIFICATIVA.
      
      REGLAS:
      1. Longitud: Entre 25 y 40 palabras.
      2. Estética: Profunda y hermosa.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres SAM, una IA con alma navideña y estética. Escribe con magia.",
        temperature: 1.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            author: { type: Type.STRING },
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
    if (mode === 'christmas') style = 'christmas';
    else if (mode === 'egocentric') style = 'cinema';
    else if (mode === 'redflags') style = 'minimal';
    else if (mode === 'power') style = 'midnight';

    return {
      id: crypto.randomUUID(),
      content: jsonResponse.content,
      author: jsonResponse.author || "SAM Navideño",
      theme: jsonResponse.theme || 'hope',
      style: style,
      timestamp: Date.now(),
      isGeneratedByAI: true 
    };

  } catch (error) {
    console.warn("Gemini Service Error:", error);
    return getRandomFallbackNote();
  }
};

export const analyzeImageForRestoration = async (base64Image: string): Promise<ExtractionResult> => {
  try {
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png"; 
    const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    const prompt = `Analiza si la imagen contiene una frase válida. Extrae texto, autor y tema.`;

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
                style: { type: Type.STRING, enum: ['classic', 'midnight', 'aura', 'minimal', 'botanical', 'cinema', 'vintage', 'rose', 'christmas'] }
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
    return { isValid: false, errorReason: FRIENDLY_ERROR_MSG };
  }
};

// NEW FUNCTION: Social Media Strategy Generator
export const generateSocialStrategy = async (noteContent: string, platform: SocialPlatform): Promise<SocialStrategy> => {
  if (!API_KEY) throw new Error(FRIENDLY_ERROR_MSG);

  try {
    const prompt = `
      ACTÚA COMO UN EXPERTO EN MARKETING DIGITAL NAVIDEÑO.
      CONTENIDO: "${noteContent}"
      PLATAFORMA: ${platform.toUpperCase()}
      
      Genera caption viral, hashtags navideños y gancho.
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
    throw new Error(FRIENDLY_ERROR_MSG);
  }
};
