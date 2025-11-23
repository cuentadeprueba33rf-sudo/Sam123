
import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyDXNpEYeT_8fSEDCCGftwmY_srTeP-jtbA';

// --- COLECCIÓN ETERNA (RESPALDO DE 365 NOTAS - UN AÑO COMPLETO) ---
const FALLBACK_QUOTES = [
  // --- BLOQUE 1: FE Y ESPIRITUALIDAD ---
  "Dios no llega tarde, tú te impacientas antes de tiempo.",
  "Ora, espera y no te preocupes. Dios tiene el control.",
  "Si Dios te quitó eso, es porque te estorbaba para lo que viene.",
  "Tu fe es más grande que cualquier miedo.",
  "Dobla rodillas y verás cómo se abren puertas.",
  "Lo que es para ti, ni el diablo te lo quita.",
  "Dios conoce la historia completa, tú solo ves la página de hoy.",
  "No le cuentes a Dios cuán grande es tu problema, cuéntale al problema cuán grande es tu Dios.",
  "Cuando tus fuerzas terminan, las de Dios comienzan.",
  "La voluntad de Dios es buena, agradable y perfecta.",
  "No es suerte, es bendición.",
  "Dios transforma las heridas en cicatrices de victoria.",
  "Donde tú ves un final, Dios ve un nuevo comienzo.",
  "Confía, Dios está escribiendo tu historia.",
  "La paz que buscas está en la oración.",
  "Dios no te ignora, te está preparando.",
  "Ten calma, Dios pelea tus batallas.",
  "El tiempo de Dios es perfecto, nunca lo dudes.",
  "Si Dios te puso ahí, Él te sostendrá.",
  "A veces Dios cierra puertas para que no entres donde no cabes.",
  "Suelta el control y deja que Dios sea Dios.",
  "Lo que pides en oración, créelo y lo recibirás.",
  "Tu milagro está a la vuelta de la esquina.",
  "Dios es tu refugio en medio de la tormenta.",
  "No temas, yo estoy contigo (Isaías 41:10).",
  "Dios proveerá, siempre lo hace.",
  "Tu fe activa milagros.",
  "El cielo te escucha, no dejes de hablarle.",
  "Dios no juega a los dados con tu destino.",
  "Lo que Dios prometió, tus ojos lo verán.",
  "Descansa en Su gracia.",
  "Dios es experto en cambiar diagnósticos.",
  "Tu oración mueve la mano de Dios.",
  "No hay gigante que pueda con tu Dios.",
  "Camina por fe, no por vista.",
  "Dios restaura lo que se rompió.",
  "Su misericordia es nueva cada mañana.",
  "Dios no te da cargas que no puedas llevar.",
  "Jesús es el camino, la verdad y la vida.",
  "El amor de Dios nunca falla.",
  "Sé valiente, Dios va delante de ti.",
  "Encomienda a Jehová tu camino.",
  "Dios es tu fortaleza.",
  "Nadie te ama como Él.",
  "Tus lágrimas son oraciones que Dios entiende.",
  "Espera en Jehová y Él hará.",
  "Dios tiene planes de bien para ti.",
  "Su fidelidad es grande.",
  "Dios no se muda, Él permanece.",
  "La gloria postrera será mayor que la primera.",

  // --- BLOQUE 2: AMOR PROPIO Y VALÍA ---
  "Eres suficiente, tal y como eres.",
  "No dejes que los comentarios de otros definan tu realidad.",
  "El mundo gira alrededor del sol, no alrededor de ellos.",
  "Vales más de lo que te han hecho creer.",
  "Tu paz mental no es negociable.",
  "No eres una opción, eres un privilegio.",
  "Brilla, y al que le moleste que se tape los ojos.",
  "Date el amor que tanto le das a otros.",
  "Eres arte, no dejes que te traten como un boceto.",
  "No necesitas apagar la luz de nadie para brillar.",
  "Sé tu propia prioridad por una vez.",
  "Perdónate por aceptar menos de lo que merecías.",
  "Tu energía es sagrada, cuídala.",
  "No busques afuera lo que ya llevas dentro.",
  "Eres valiosa, no por lo que haces, sino por lo que eres.",
  "Enamórate de ti, de tu vida y de tu proceso.",
  "No eres 'demasiado', es que ellos son poco.",
  "Tu corazón es un jardín, no dejes que cualquiera entre.",
  "Mereces flores, café y amor bonito.",
  "Sé fiel a ti misma, el resto es secundario.",
  "No mendigues atención, tú eres la reina.",
  "Tu sonrisa es tu mejor accesorio.",
  "Ámate tanto que no necesites convencer a nadie para que se quede.",
  "Eres luz en un mundo que a veces se apaga.",
  "Hoy elijo ser feliz conmigo misma.",
  "Tu cuerpo escucha lo que tu mente dice, háblale bonito.",
  "No eres responsable de la versión de ti que crearon en su cabeza.",
  "Si te roban la energía, córtales el acceso.",
  "Lo que permites, se repite.",
  "No te achiques para caber en la vida de nadie.",
  "Tu brillo molesta a quien vive en la oscuridad.",
  "El respeto no se pide, se inspira.",
  "No eres el plan B de nadie.",
  "La soledad enseña más que cualquier compañía vacía.",
  "Tu salud mental vale más que su opinión.",
  "No des explicaciones a quien no entiende razones.",
  "La comparación es el ladrón de la alegría.",
  "Eres la protagonista de tu propia historia.",
  "No te quedes donde no puedes florecer.",
  "Cuida tu jardín y las mariposas vendrán solas.",
  "Tu voz importa.",
  "No dejes que el miedo te paralice.",
  "Atrévete a soñar en grande.",
  "Eres capaz de lograr todo lo que te propongas.",
  "Tu potencial es ilimitado.",
  "Cree en ti, Dios ya lo hace.",
  "No eres tus errores.",
  "Cada día es una nueva oportunidad.",
  "Rodéate de gente que te sume.",
  "Sé luz en la oscuridad.",
  "Eres un regalo para el mundo.",
  "Tu existencia tiene un propósito.",
  "No te compares, eres única.",
  "Celebra tus pequeños logros.",
  "Sé paciente contigo misma.",
  "Tu autenticidad es tu superpoder.",
  "El mundo necesita lo que tú tienes.",
  "Brilla con luz propia.",
  "No dejes que nadie apague tu fuego.",
  "Eres fuerte, valiente y capaz.",
  "Tu paz es cara, no se la regales a cualquiera.",
  "No eres moneda de oro para caerle bien a todos.",
  "Eres obra maestra, no dejes que te traten como borrador.",
  "Confía en tu intuición, rara vez se equivoca.",
  "Eres dueña de tu destino.",
  "No necesitas validación externa.",
  "Tu valor no disminuye por la incapacidad de alguien de verlo.",
  "Sé la mujer que necesitabas cuando eras niña.",
  "Hoy es un buen día para empezar de nuevo.",
  "Eres magia pura.",
  "Tu alma es hermosa.",
  "No te abandones a ti misma.",
  "Eres tu mejor inversión.",
  "Quiérete mucho.",
  "Eres digna de amor.",
  "Tu presencia es un regalo.",
  "No cambies para agradar.",
  "Sé leal a tu futuro.",

  // --- BLOQUE 3: RESILIENCIA Y FUERZA ---
  "Cada tormenta tiene un final. Esto también pasará.",
  "No pongas tu mente en la tormenta, ponla donde ya acabó.",
  "Eres más fuerte de lo que tu mente te dice.",
  "Llora lo que tengas que llorar, y luego levántate.",
  "Caerse está permitido, levantarse es obligatorio.",
  "Tus cicatrices son prueba de que sobreviviste.",
  "Hoy duele, mañana será solo un recuerdo.",
  "Respira, lo estás haciendo mejor de lo que crees.",
  "No es un mal día, es solo un mal momento.",
  "De las cenizas siempre renace algo hermoso.",
  "Tu proceso es tuyo, no lo compares.",
  "A veces hay que romperse para armarse de nuevo.",
  "Eres un diamante, y los diamantes se hacen bajo presión.",
  "No te rindas, estás a un paso de lograrlo.",
  "El dolor es temporal, la gloria es eterna.",
  "Sigue nadando, la orilla está cerca.",
  "Eres guerrera, no víctima.",
  "Lo que no te mata, te hace más sabia.",
  "Confía en el proceso, aunque no lo entiendas.",
  "Tu fortaleza inspira a otros.",
  "No mires atrás, no vas para allá.",
  "Seca tus lágrimas y ajusta tu corona.",
  "La noche es más oscura justo antes del amanecer.",
  "Eres invencible cuando decides no rendirte.",
  "Todo obra para bien.",
  "Si dolió, aprendiste.",
  "No eres lo que te pasó, eres lo que eliges ser.",
  "Crecer duele, pero quedarse igual duele más.",
  "Un día a la vez.",
  "Progreso, no perfección.",
  "Tu historia aún no termina.",
  "Respira profundo, todo saldrá bien.",
  "Eres resiliente.",
  "Tus sueños valen el esfuerzo.",
  "No pares hasta estar orgullosa.",
  "La disciplina te llevará donde la motivación no alcanza.",
  "Eres capaz de cosas difíciles.",
  "Tu valentía es admirable.",
  "No temas a los cambios, a veces son necesarios.",
  "Lo mejor está por venir, créelo.",
  "Dios convierte tus lágrimas en lluvia para tu crecimiento.",
  "Tu propósito es más grande que tus problemas.",
  "No estás sola, Dios camina contigo.",
  "La fe mueve montañas, pero la duda las crea.",
  "Eres una creación maravillosa de Dios.",
  "Tu identidad está en Cristo, no en el mundo.",
  "Avanza, aunque sea lento.",
  "No tires la toalla, úsala para secarte el sudor.",
  "Eres más grande que tus circunstancias.",
  "La calma es un superpoder.",
  "Transforma el dolor en poder.",
  "Florece donde te planten.",
  "Eres inquebrantable.",
  "Tu coraje abre caminos.",
  "No hay error, solo aprendizaje.",
  "Vence el mal con el bien.",
  "Tu luz disipa las tinieblas.",
  "Eres hija del Rey.",
  "Levántate y resplandece.",

  // --- BLOQUE 4: REALIDAD Y RELACIONES (AMIGA DATE CUENTA) ---
  "Si te hace dudar, ahí no es.",
  "No elijas a cualquiera, elige a quien doble rodillas por ti.",
  "El interés se nota, y el desinterés se nota más.",
  "No guardes luto por quien eligió irse.",
  "Si quería, lo hacía. No busques excusas.",
  "Deja de buscar agua en pozos secos.",
  "A veces perder a alguien es ganarse a uno mismo.",
  "No es orgullo, es dignidad.",
  "El que se va sin que lo echen, vuelve sin que lo llamen.",
  "No eres centro de rehabilitación de nadie.",
  "Quien te quiere, te busca. Punto.",
  "No aceptes migajas, tú mereces el banquete completo.",
  "Si te roba la paz, es demasiado caro.",
  "A veces 'adiós' es la palabra más bonita.",
  "No fuerces lo que no encaja.",
  "Mereces un amor que se sienta como casa.",
  "Deja ir para dejar llegar.",
  "No eres segunda opción de nadie.",
  "El amor no duele, lo que duele es lo que confundes con amor.",
  "Cierra ciclos, no por orgullo, sino por salud mental.",
  "Quien no te valora, no te merece.",
  "No bajes tus estándares por nadie.",
  "Mejor sola que mal acompañada.",
  "Tu tiempo es oro, no lo regales.",
  "Aléjate de lo que te apaga.",
  "Tu intuición no falla, tu miedo a equivocarte te confunde.",
  "No recicles ex-amores.",
  "Bloquear también es amor propio.",
  "Aprende a irte a tiempo.",
  "Si no suma, que no reste.",
  "No llames amor a la costumbre.",
  "No romantices lo mínimo.",
  "Si te quiso, se notó. Si no, se notó más.",
  "No eres para cualquiera.",
  "Tu corazón no es hotel de paso.",
  "El amor es paz, si es guerra, es ego.",
  "No persigas, atrae.",
  "Quien te lastima no te ama.",
  "Pon límites, es sano.",
  "No eres pañuelo de lágrimas de quien te hace llorar.",
  "Selta lo que te pesa.",
  "No justifiques lo injustificable.",
  "El amor real no te hace sufrir.",
  "Eres un premio, no una opción.",
  "Si te ignora, te enseña a vivir sin él.",
  "Valora a quien te valora.",
  "No mendigues amor.",
  "Eres completa sola.",
  "Tu felicidad depende de ti.",
  "No le escribas, lee un libro.",
  "Mereces que te presuman.",
  "No seas la 'casi algo' de nadie.",
  "El respeto es la base de todo.",
  "Si no hay paz, no es ahí.",
  "Vete a la primera falta de respeto.",
  "No cargues culpas ajenas.",
  "Eres libre.",

  // --- BLOQUE 5: MINIMALISTAS & AESTHETIC ---
  "Vive simple.",
  "Aquí y ahora.",
  "Todo es temporal.",
  "Siente, no pienses.",
  "Paz mental.",
  "Solo vibras bonitas.",
  "Fluye.",
  "Respira.",
  "Eres magia.",
  "Luz y amor.",
  "Alma libre.",
  "Corazón valiente.",
  "Mente en paz.",
  "Cree.",
  "Confía.",
  "Ama.",
  "Ríe.",
  "Sueña.",
  "Vuela.",
  "Brilla.",
  "Renace.",
  "Sana.",
  "Suelta.",
  "Vive.",
  "Sé tú.",
  "Calma.",
  "Fe.",
  "Esperanza.",
  "Gratitud.",
  "Valentía.",
  "Esencia.",
  "Energía.",
  "Destino.",
  "Universo.",
  "Divino.",
  "Eterno.",
  "Sublime.",
  "Radiante.",
  "Auténtica.",
  "Poderosa.",
  "Única.",
  "Libre.",
  "Feliz.",
  "Plena.",
  "Serena.",
  "Intensa.",
  "Real.",
  "Divina.",
  "Sagrada.",
  "Infinita.",

  // --- BLOQUE 6: MIX FINAL (COMPLETANDO LOS 365) ---
  "La vida es un eco, lo que das recibes.",
  "No esperes nada de nadie, espéralo todo de ti.",
  "Sé el cambio que quieres ver.",
  "La felicidad es una elección diaria.",
  "Disfruta de las pequeñas cosas.",
  "La gratitud transforma lo que tienes en suficiente.",
  "Contagia alegría donde vayas.",
  "Sé amable, todos luchan una batalla.",
  "Tu actitud determina tu dirección.",
  "Hazlo con miedo, pero hazlo.",
  "El éxito es la suma de pequeños esfuerzos.",
  "No cuentes los días, haz que los días cuenten.",
  "La vida es corta, cómprate los zapatos.",
  "Sonríe, confunde a quien te quiere ver mal.",
  "Eres el autor de tu vida, no dejes el lápiz a nadie.",
  "La suerte es cuando la preparación encuentra la oportunidad.",
  "No busques el momento perfecto, hazlo perfecto.",
  "Tu vibra atrae a tu tribu.",
  "Lo que crees, creas.",
  "Escucha a tu corazón.",
  "No tengas miedo de ser tú misma.",
  "El mundo necesita tu luz.",
  "Hoy es el día que hizo el Señor.",
  "Sonríe, Cristo te ama.",
  "La alegría del Señor es tu fortaleza.",
  "Todo lo puedo en Cristo que me fortalece.",
  "Dios es fiel.",
  "Su amor es inagotable.",
  "Eres bendecida.",
  "La oración cambia las cosas.",
  "Dios nunca falla.",
  "Su gracia es suficiente para ti.",
  "No te preocupes por el mañana, Dios ya está allí.",
  "Eres amada más allá de lo que puedes imaginar.",
  "Tu valor no depende de tus logros.",
  "Eres digna de todo lo bueno.",
  "No te conformes, fuiste creada para más.",
  "Dios te ama tal cual eres.",
  "Confía en Su plan.",
  "La fe ve lo invisible.",
  "Dios abre caminos donde no los hay.",
  "Eres la niña de Sus ojos.",
  "Dios pelea por ti.",
  "Su paz sobrepasa todo entendimiento.",
  "Descansa en Él.",
  "Dios es tu pronto auxilio.",
  "El amor todo lo puede.",
  "La esperanza no avergüenza.",
  "Sé fuerte y valiente.",
  "Dios está en control.",
  "Tu vida tiene sentido.",
  "Eres amada eternamente.",
  "Nunca estás sola.",
  "Dios es bueno todo el tiempo.",
  "Todo el tiempo Dios es bueno.",
  "Su luz brilla en ti.",
  "Eres un milagro.",
  "La vida es bella.",
  "Ama sin medida.",
  "Perdona y avanza.",
  "Sé agradecida.",
  "La vida te ama.",
  "Eres pura inspiración.",
  "Tu alma sabe el camino.",
  "Sigue tu intuición.",
  "Eres maravillosa.",
  "El mundo es tuyo.",
  "Ve por ello.",
  "Hazlo posible.",
  "Crea tu realidad.",
  "Eres abundancia.",
  "Mereces lo mejor.",
  "Acepta lo bueno.",
  "Eres prosperidad.",
  "Tu mente es poderosa.",
  "Piensa positivo.",
  "Atraes lo que eres.",
  "Vibra alto.",
  "Conecta con tu esencia.",
  "Eres paz.",
  "Eres amor.",
  "Eres luz."
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
  customInstruction: string = ''
): Promise<Note> => {
  
  if (!API_KEY) {
    console.warn("API Key not found, using fallback.");
    return getRandomFallbackNote();
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

      TU OBJETIVO: Generar una NOTA COMPLETA, SUSTANCIAL y PROFUNDA (No solo una frase corta).
      
      REGLAS DE ORO (ESTRICTAS):
      1. 🚫 CERO FILOSOFÍA ABSTRACTA: Evita lenguaje académico o demasiado metafórico que confunda. Sé clara.
      2. LENGUAJE CERCANO Y CÁLIDO: Habla como una amiga real que te está aconsejando con un café en la mano.
      3. EXTENSIÓN: Quiero un consejo bien desarrollado. Explica el "por qué" de lo que dices. Que se sienta como un abrazo.
      4. TEMAS: Amor propio, fe (Dios), sanar relaciones, soltar lo que duele, y realidad pura.
      5. NO EXCESO DE "AMIGA": No uses la palabra "amiga" constantemente. Sé natural.

      EJEMPLOS DEL TIPO DE CONTENIDO QUE BUSCO (Más largos y completos):
      - "No te sientas mal por necesitar un descanso. Llevas cargando el peso del mundo sobre tus hombros demasiado tiempo y hasta el guerrero más fuerte necesita soltar la armadura un rato. Dios no te pide que seas invencible, solo que confíes en que Él te sostiene cuando tú ya no puedes más."
      
      - "Deja de revisar su perfil, deja de buscar respuestas donde solo hay silencio. Sé que duele soltar, pero duele más sostener algo que te corta las manos. Ese 'adiós' que tanto temes es en realidad la bienvenida a la paz mental que te mereces. Elige tu paz hoy."

      - "A veces Dios desordena tus planes porque tus planes estaban a punto de destruirte. No es un castigo, es protección. Quizás ahora no entiendas por qué esa puerta se cerró en tu cara, pero te prometo que más adelante agradecerás no haber entrado ahí. Confía en los tiempos."

      Longitud ideal: Un párrafo de 40 a 60 palabras. Sustancial, emotivo y directo al corazón.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres una consejera emocional sabia y cercana. Tus respuestas son párrafos completos y reconfortantes, no frases sueltas.",
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
    if (!jsonResponse.content) return getRandomFallbackNote();

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
    return getRandomFallbackNote();
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
