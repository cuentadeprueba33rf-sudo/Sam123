

import { GoogleGenAI, Type } from "@google/genai";
import { Note, Gender, NoteStyle, Mood, ExtractionResult } from "../types";

const API_KEY = 'AIzaSyDXNpEYeT_8fSEDCCGftwmY_srTeP-jtbA';

// --- COLECCIÓN ETERNA (RESPALDO DE 365 NOTAS - UN AÑO COMPLETO) ---
const FALLBACK_QUOTES = [
  // --- BLOQUE 1: FE Y ESPIRITUALIDAD ---
  "Dios no llega tarde, tú te impacientas antes de tiempo. Respira y confía en que su plan es perfecto, aunque ahora mismo no lo entiendas del todo.",
  "Ora, espera y no te preocupes. La preocupación es como pagar una deuda que no tienes. Entrégale tus cargas a Dios y descansa en su poder.",
  "Si Dios te quitó eso de tu vida, es porque te estorbaba para lo grandioso que viene en camino. No era una pérdida, era una preparación.",
  "Tu fe debe ser más grande que cualquier miedo que intente paralizarte. Recuerda que no caminas sola, el Creador del universo va contigo.",
  "Dobla rodillas en privado y verás cómo Dios abre puertas en público. La oración es la llave que abre los almacenes del cielo.",
  "Lo que es para ti, ni el diablo te lo quita. Puedes estar tranquila, lo que te pertenece por derecho divino encontrará la manera de llegar a ti.",
  "Dios conoce la historia completa, tú solo estás viendo la página de hoy. No juzgues el libro por un capítulo difícil; lo mejor está por venir.",
  "No le cuentes a Dios cuán grande es tu problema, cuéntale a ese problema cuán inmenso y poderoso es tu Dios. Cambia la perspectiva.",
  "Justo cuando tus fuerzas humanas terminan, es cuando las fuerzas divinas de Dios comienzan a manifestarse en tu vida. Ríndete a su poder.",
  "La voluntad de Dios para tu vida siempre será buena, agradable y perfecta. Aunque a veces duela, al final entenderás que era lo mejor para ti.",
  "No lo llames suerte, llámalo bendición. Has estado orando por esto, has trabajado por esto. Es el fruto de tu fe y tu esfuerzo.",
  "Dios es un experto en transformar las heridas del pasado en cicatrices de victoria que cuentan una historia de superación y poder.",
  "Donde tú ves un final doloroso, Dios está viendo un nuevo y glorioso comienzo. Cierra ese capítulo con gratitud por la lección.",
  "Confía en el proceso. Dios está escribiendo tu historia con tinta de amor y propósito, y cada detalle tiene una razón de ser.",
  "La paz que tanto buscas no está en el mundo, en las personas o en las cosas. Está en la quietud de la oración, en tu conversación con Él.",
  "Dios no te está ignorando, te está preparando. Está fortaleciendo tu carácter para que puedas sostener el peso de la bendición que viene.",
  "Ten calma y deja de pelear batallas que no te corresponden. Hay gigantes que solo Dios puede derribar, y Él ya está peleando por ti.",
  "El tiempo de Dios es absolutamente perfecto. Nunca llega tarde, nunca se adelanta. Llega justo cuando tiene que llegar. Aprende a esperar.",
  "Si Dios te puso en esa situación, es porque sabe que tienes la fortaleza para superarla. Él no te abandona, te equipa.",
  "A veces Dios cierra puertas en tu cara para que dejes de intentar entrar en lugares donde tu alma ya no cabe. Es protección, no rechazo.",
  "Suelta la necesidad de controlar cada detalle de tu vida. La verdadera paz llega cuando le entregas el control a Dios y confías en su soberanía.",
  "Lo que pidas en oración, créelo como si ya lo tuvieras y lo recibirás. La fe no es ver para creer, es creer para poder ver.",
  "Tu milagro no está lejos, está a la vuelta de la esquina de tu obediencia y tu fe. Sigue caminando, no te detengas ahora.",
  "En medio de la tormenta más fuerte, recuerda que Dios es tu refugio. Él es la calma en el caos, la luz en la oscuridad.",
  "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo (Isaías 41:10). Aférrate a esta promesa.",
  "Dios proveerá lo que necesitas, justo cuando lo necesites. Su provisión no se limita a lo material, también provee paz, fuerza y sabiduría.",
  "Tu fe es como un interruptor: activa los milagros que Dios ya tiene preparados para ti. No dejes que la duda lo apague.",
  "El cielo te está escuchando, incluso cuando oras en silencio o con lágrimas. No dejes de hablarle, Él anhela escuchar tu voz.",
  "Dios no juega a los dados con tu destino. Cada paso, cada encuentro y cada desafío están orquestados en un plan divino perfecto.",
  "Lo que Dios prometió, tus ojos lo verán. Mantente firme en la fe, porque la promesa sigue en pie y su cumplimiento es seguro.",
  "Aprende a descansar en Su gracia. No tienes que ganarte su amor ni su perdón, ya te fueron dados gratuitamente. Solo recíbelos.",
  "Dios es un experto en cambiar diagnósticos médicos, financieros y emocionales. Para Él no hay imposibles, solo oportunidades para un milagro.",
  "Tu oración, por más simple que parezca, tiene el poder de mover la mano de Dios. Nunca subestimes el poder de tu clamor.",
  "No hay gigante, problema o adicción que pueda hacerle frente a tu Dios. Eres hija del Rey, y en su nombre tienes autoridad.",
  "Aprende a caminar por fe y no por lo que ven tus ojos. La vista te engaña, pero la fe te conecta con la realidad del cielo.",
  "Dios es un especialista en restaurar lo que el mundo o el tiempo rompieron. Él puede hacer todas las cosas nuevas, incluyéndote a ti.",
  "Su misericordia es nueva cada mañana. El error de ayer no define tu hoy. Tienes una nueva oportunidad para empezar de cero.",
  "Dios nunca te dará una carga que no puedas llevar con su ayuda. Él mide tus fuerzas y te da exactamente lo que puedes soportar.",
  "Jesús es el camino, la verdad y la vida. Fuera de Él, solo hay callejones sin salida, mentiras y vacíos. Vuelve a casa.",
  "El amor de Dios no es como el amor humano; nunca falla, nunca se rinde, nunca te abandona. Es el único amor seguro que tendrás.",
  "Sé valiente y esfuérzate, porque Dios, tu Señor, va delante de ti. Él no te dejará ni te desamparará. Camina con confianza.",
  "Encomienda a Jehová tu camino, y confía en él; y él hará. Deja de cargar con todo tú sola, entrégale tus planes.",
  "Dios es tu fortaleza en tiempos de debilidad, tu roca firme en arenas movedizas. Apóyate en Él, no en tus propias fuerzas.",
  "Nadie en este mundo te amará como Él te ama. Su amor es tan grande que dio a su único Hijo por ti. Eres su tesoro.",
  "Tus lágrimas son oraciones silenciosas que Dios entiende perfectamente. Él las recoge, las escucha y las responderá con consuelo.",
  "Espera pacientemente en Jehová y Él actuará. La espera es parte del proceso de formación de tu carácter y tu fe.",
  "Dios tiene planes de bien y no de mal para ti, para darte un futuro y una esperanza. Cree en sus promesas, son para ti.",
  "Su fidelidad es grande y eterna. Aunque tú falles, Él permanece fiel. Su amor por ti no cambia según tus circunstancias.",
  "Dios no se muda, no cambia de opinión, no te olvida. Él permanece firme y constante, es tu ancla en medio de la vida.",
  "La gloria postrera de tu vida será mayor que la primera. Lo que Dios tiene para tu futuro es mucho más grande que lo que has dejado atrás.",

  // --- BLOQUE 2: AMOR PROPIO Y VALÍA ---
  "Eres absolutamente suficiente, tal y como eres en este preciso instante. No necesitas cambiar nada para merecer amor y respeto.",
  "No permitas que los comentarios de personas con mentes pequeñas definan la inmensidad de tu realidad. Tú eres la única que tiene ese poder.",
  "Recuerda que el mundo gira alrededor del sol y sobre su propio eje, no alrededor de ellos. No les des un poder que no tienen sobre ti.",
  "Vales mucho más de lo que te han hecho creer las heridas del pasado. Tu valor es intrínseco, inmutable y no depende de la aprobación de nadie.",
  "Tu paz mental no es negociable. Si algo o alguien te la roba, es demasiado caro. Aprende a alejarte sin sentir culpa.",
  "No eres una opción para ratos libres, eres un privilegio para toda la vida. Quien no lo vea así, no merece un lugar en la tuya.",
  "Brilla con toda tu fuerza, y si a alguien le molesta tu luz, que se ponga gafas de sol o se aparte. No te apagues por nadie.",
  "Date a ti misma la misma cantidad de amor, paciencia y compasión que tan generosamente le das a los demás. Te lo mereces.",
  "Eres una obra de arte completa y única. No dejes que nadie te trate como un boceto a medio terminar o un proyecto a corregir.",
  "No necesitas apagar la luz de nadie para poder brillar. El universo tiene espacio para todas las estrellas. Celebra el brillo ajeno.",
  "Por una vez en tu vida, sé tu propia prioridad. Atiende tus necesidades, escucha a tu corazón y respeta tus límites. Es un acto de amor.",
  "Perdónate por haber aceptado menos de lo que merecías. No sabías lo que sabes ahora. Esa lección te hizo más sabia y fuerte.",
  "Tu energía es sagrada y limitada. No la malgastes en personas, lugares o situaciones que no nutren tu alma. Sé selectiva.",
  "Deja de buscar afuera la validación, el amor y la felicidad que ya llevas dentro de ti. Eres un universo completo.",
  "Eres valiosa, no por lo que haces, tienes o logras, sino simplemente por el hecho de existir. Tu ser es tu valor.",
  "Enamórate profundamente de ti, de tu vida con sus altibajos y de tu proceso de crecimiento. Esa es la historia de amor más importante.",
  "No eres 'demasiado intensa' o 'demasiado sensible'. Es que ellos son demasiado básicos o demasiado vacíos para entender tu profundidad.",
  "Tu corazón es un jardín privado y sagrado. No dejes que cualquiera entre a pisar tus flores o a plantar maleza. Elige bien a tus visitantes.",
  "Mereces flores sin que sea un día especial, café por la mañana y un amor bonito que te de paz en lugar de ansiedad.",
  "Sé absolutamente fiel a ti misma, a tus valores y a tus sueños. Todo lo demás, y todos los demás, son secundarios en tu vida.",
  "No mendigues atención ni ruegues por amor. Eres la reina de tu propio reino y la atención se te da, no se te pide.",
  "Tu sonrisa es tu mejor accesorio y el arma más poderosa contra la negatividad. Úsala a menudo, te queda preciosa.",
  "Ámate tanto, pero tanto, que no necesites convencer a absolutamente nadie para que se quede a tu lado. Quien quiera irse, que se vaya.",
  "Eres un faro de luz en un mundo que a veces se sumerge en la oscuridad. No subestimes el poder de tu simple presencia.",
  "Hoy elijo ser feliz conmigo misma, con mis imperfeacciones y mis logros. Mi compañía es un regalo que aprenderé a valorar.",
  "Tu cuerpo escucha todo lo que tu mente dice. Háblale con amor, trátalo con respeto, nútrelo con cariño. Es tu único hogar.",
  "No eres responsable de la versión distorsionada de ti que otras personas crearon en su cabeza. Lo que piensen es su problema, no el tuyo.",
  "Si te roban la energía, te critican o te hacen sentir pequeña, córtales el acceso a tu vida. Las tijeras del amor propio son necesarias.",
  "Aquello que permites en tu vida, es lo que se repetirá. Si no te gusta, deja de permitirlo. Pon límites firmes y claros.",
  "No te achiques para caber en la vida de nadie. Si no hay espacio para tu grandeza, ese no es tu lugar. Expándete.",
  "Tu brillo personal siempre va a molestar a quien vive en la oscuridad. No es tu culpa, es su incapacidad de generar luz propia.",
  "El respeto no se pide ni se ruega, se inspira con tu ejemplo y se exige con tus límites. Quien no te respeta, no te quiere.",
  "Nunca, pero nunca, seas el plan B de nadie. Eres la obra completa, la primera y única opción. Quien no lo vea, que siga su camino.",
  "La soledad elegida y disfrutada enseña mucho más que cualquier compañía vacía o tóxica. Aprende a ser tu mejor amiga.",
  "Tu salud mental y emocional valen más que la opinión de cualquier persona. Protege tu paz como tu tesoro más preciado.",
  "No malgastes tu tiempo dando explicaciones a personas que ya han decidido no entenderte. Tu energía es para ti, no para convencer a otros.",
  "La comparación es el ladrón de la alegría. Tu camino es único y no se puede comparar con el de nadie más. Concéntrate en tu propio carril.",
  "Eres la protagonista, la directora y la guionista de tu propia historia. No le des a nadie un papel que no se ha ganado.",
  "No te quedes en un lugar donde no puedes florecer. Si la tierra no es fértil, es hora de trasplantarte a un jardín mejor.",
  "Cuida tu jardín interior: riega tus sueños, arranca tus miedos y abona tu autoestima. Las mariposas correctas llegarán solas.",
  "Tu voz importa, tus opiniones son válidas y tus sentimientos son reales. No dejes que nadie te haga sentir que debes callar.",
  "No dejes que el miedo a fracasar te paralice. El verdadero fracaso es no haberlo intentado. Lánzate con miedo, pero lánzate.",
  "Atrévete a soñar en grande, tan grande que asuste. Fuiste creada para un propósito inmenso, no para una vida pequeña.",
  "Eres capaz de lograr absolutamente todo lo que te propongas. El único límite real es el que tú misma pones en tu mente.",
  "Tu potencial es ilimitado. No dejes que las experiencias pasadas o las opiniones ajenas te pongan un techo. Puedes volar más alto.",
  "Cree en ti con la misma fuerza con la que Dios ya cree en ti. Él te creó a su imagen y semejanza, llena de dones y talentos.",
  "No eres tus errores del pasado. Eres las lecciones que aprendiste de ellos. Úsalos como escalones, no como anclas.",
  "Cada nuevo día es una página en blanco, una nueva oportunidad para escribir una historia diferente. No arruines el hoy con las penas de ayer.",
  "Rodéate de personas que te sumen, que celebren tus victorias, que te apoyen en tus derrotas y que te inspiren a ser mejor.",
  "Sé luz en la oscuridad de alguien más. A veces una palabra amable o una sonrisa pueden cambiarle el día a una persona.",
  "Eres un regalo para este mundo. Tu existencia tiene un impacto, y el universo no sería el mismo sin ti. Valora tu presencia.",
  "Tu existencia tiene un propósito divino. No estás aquí por casualidad. Descubre tu misión y vívela con pasión y entrega.",
  "No te compares con nadie en las redes sociales. Estás comparando tu vida real con el carrete de mejores momentos de alguien.",
  "Celebra tus pequeños logros de cada día. Un paso a la vez, por pequeño que sea, sigue siendo un paso hacia adelante. El progreso es progreso.",
  "Sé paciente y compasiva contigo misma. Estás en un proceso de crecimiento y sanación, y eso lleva tiempo. No te apresures.",
  "Tu autenticidad es tu superpoder. En un mundo lleno de copias, ser genuina es lo más revolucionario y atractivo que puedes hacer.",
  "El mundo necesita desesperadamente los dones, talentos y la perspectiva única que solo tú tienes. No te los guardes, compártelos.",
  "Brilla con tu propia luz. No intentes imitar a nadie. El sol y la luna brillan cuando es su momento, y ambos son hermosos.",
  "No dejes que nadie apague tu fuego interior. Protégelo, aliméntalo y úsalo para iluminar tu camino y el de los demás.",
  "Eres fuerte, valiente y capaz de superar cualquier adversidad. Ya has sobrevivido al 100% de tus peores días. Puedes con esto.",
  "Tu paz es cara, muy cara. No se la regales a cualquiera ni la vendas por un poco de atención o compañía mediocre.",
  "No eres una moneda de oro para tener que caerle bien a todo el mundo. A quien no le guste tu brillo, que se aleje.",
  "Eres una obra maestra en constante creación. No dejes que te traten como un borrador o un proyecto a medio hacer.",
  "Confía en tu intuición, es el lenguaje de tu alma. Rara vez se equivoca. Si algo no se siente bien, es porque no lo es.",
  "Eres la única dueña de tu destino y la capitana de tu alma. Toma el timón y dirige tu vida hacia donde tú quieras ir.",
  "No necesitas la validación de nadie para saber quién eres y cuánto vales. La única opinión que realmente importa es la tuya.",
  "Tu valor no disminuye por la incapacidad de otra persona de verlo. Un diamante sigue siendo un diamante aunque un ciego no lo vea.",
  "Conviértete en la mujer que necesitabas como modelo a seguir cuando eras una niña. Sé tu propia heroína.",
  "Hoy es un día perfecto para empezar de nuevo. Suelta el pasado, perdona a quien tengas que perdonar y enfócate en el presente.",
  "Eres magia pura, un conjunto de estrellas y sueños. No dejes que la rutina o la negatividad te hagan olvidar tu esencia.",
  "Tu alma es hermosa, resiliente y sabia. Escúchala más a menudo, ella conoce el camino de regreso a casa, a tu paz.",
  "No te abandones a ti misma por complacer a otros. Tu primera y más importante relación es contigo misma. Cuídala.",
  "Eres tu mejor y más importante inversión. Invierte tiempo en tu crecimiento, en tu sanación y en tu felicidad.",
  "Quiérete mucho, pero sobre todo, quiérete bien. Con un amor sano, paciente, sin condiciones y sin juicios.",
  "Eres digna de todo el amor, la alegría y la abundancia que el universo tiene para ofrecer. Abre los brazos y recíbelo.",
  "Tu simple presencia es un regalo para quienes te rodean. Nunca dudes del impacto positivo que tienes en la vida de los demás.",
  "No cambies tu esencia para agradar a los demás. Quien te quiera de verdad, amará cada parte de ti, incluso las que tú no amas.",
  "Sé leal a tu futuro, no a tu pasado. Toma decisiones basadas en la persona que quieres ser, no en la que fuiste.",

  // --- BLOQUE 3: RESILIENCIA Y FUERZA ---
  "Cada tormenta, por más fuerte que sea, tiene un final. Te prometo que esto también pasará. Resiste un poco más.",
  "No pongas tu mente en la tormenta, ponla en el momento en que ya haya acabado. Visualiza la calma, el sol y la paz que vendrán después.",
  "Eres mucho más fuerte de lo que tu mente ansiosa te dice en este momento. Has superado cosas peores, y superarás esto también.",
  "Llora todo lo que tengas que llorar. Saca el dolor. Pero cuando termines, sécate las lágrimas y levántate con más fuerza que antes.",
  "Caerse mil veces está permitido, pero levantarse mil y una veces es obligatorio. La vida no es para los que nunca caen, sino para los que nunca se rinden.",
  "Tus cicatrices no son un signo de debilidad, son la prueba de que sobreviviste a lo que intentó destruirte. Llévalas con orgullo.",
  "Hoy duele, y es válido que duela. Pero mañana será solo un recuerdo, una lección aprendida. El tiempo te ayudará a sanar.",
  "Respira profundo. Lo estás haciendo mucho mejor de lo que crees. Estás sobreviviendo, estás luchando, y eso es más que suficiente.",
  "No es un mal día, es solo un mal momento dentro de un día que todavía puede mejorar. No dejes que un instante arruine 24 horas.",
  "De las cenizas de tu dolor siempre puede renacer algo hermoso y más fuerte. Eres como el ave fénix, destinada a resurgir.",
  "Tu proceso de sanación es tuyo y de nadie más. No lo compares con el de otros. Cada quien sana a su propio ritmo y a su manera.",
  "A veces es necesario romperse por completo para poder armarse de nuevo, pero esta vez, de la manera correcta y más fuerte.",
  "Eres un diamante, y los diamantes no se hacen en la comodidad, se forman bajo una inmensa presión. Este proceso te está puliendo.",
  "No te rindas ahora, por favor. Estás a un solo paso de lograrlo. La victoria llega justo después de la batalla más dura.",
  "El dolor que sientes es temporal, pero la gloria, la sabiduría y la fortaleza que obtendrás de esta prueba serán eternas.",
  "Sigue nadando, aunque sientas que te ahogas. La orilla de la paz y la tranquilidad está mucho más cerca de lo que imaginas.",
  "Eres una guerrera, no una víctima de tus circunstancias. Toma tu espada, que es tu fe, y lucha por tu paz y tu felicidad.",
  "Lo que no te mata, te hace más fuerte, más sabio y más compasivo. Esta experiencia te está equipando para tu futuro.",
  "Confía en el proceso de la vida, aunque no lo entiendas ahora. El universo tiene un plan perfecto y cada pieza encajará a su tiempo.",
  "Tu fortaleza interior inspira a otras personas que están luchando en silencio. Eres un ejemplo de resiliencia sin siquiera saberlo.",
  "Deja de mirar hacia atrás, no vas en esa dirección. Tu futuro está adelante, lleno de nuevas oportunidades y bendiciones.",
  "Seca tus lágrimas, respira profundo y ajusta tu corona. Eres una reina y las reinas no se dejan vencer por cualquier batalla.",
  "La noche siempre es más oscura justo antes del amanecer. Tu amanecer está a punto de llegar, no pierdas la esperanza ahora.",
  "Te vuelves invencible en el momento en que decides no rendirte, sin importar cuántas veces caigas o cuánto duela. La decisión es tuya.",
  "Todo lo que te está sucediendo, tanto lo bueno como lo malo, está obrando para tu bien. Al final, verás el propósito en todo.",
  "Si dolió, es porque te enseñó algo importante. Agradece la lección, aunque el maestro haya sido el dolor. Ahora eres más sabia.",
  "No eres lo que te pasó, eres la persona en la que eliges convertirte después de lo que te pasó. Tienes el poder de redefinirte.",
  "Crecer duele, cambiar duele. Pero quedarse estancada en un lugar donde ya no perteneces, duele mucho más. Elige el dolor del crecimiento.",
  "Vive un día a la vez. No te agobies con el futuro ni te lamentes por el pasado. Enfócate en sobrevivir y encontrar paz en el hoy.",
  "Busca el progreso, no la perfección. Cada pequeño paso cuenta, cada pequeño esfuerzo suma. Estás avanzando, y eso es lo que importa.",
  "Tu historia aún no ha terminado. Estás en medio de un capítulo difícil, pero no es el final del libro. Sigue escribiendo.",
  "Respira profundo, una y otra vez. Todo saldrá bien. Quizás no hoy, quizás no como esperas, but al final, todo estará bien.",
  "Eres resiliente. Tienes una capacidad increíble para adaptarte, superar y salir fortalecida de las situaciones más difíciles.",
  "Tus sueños valen todo el esfuerzo, todas las lágrimas y todos los sacrificios. No dejes que nadie te diga que son demasiado grandes.",
  "No te detengas hasta que estés increíblemente orgullosa de la persona en la que te has convertido. El viaje vale la pena.",
  "La disciplina te llevará a lugares donde la motivación por sí sola no puede alcanzar. Sé constante, incluso cuando no tengas ganas.",
  "Eres capaz de hacer cosas muy difíciles. Has sido creada con una fortaleza interior que ni tú misma conoces por completo.",
  "Tu valentía es admirable. El simple hecho de levantarte cada día y enfrentar tus miedos es un acto de coraje inmenso.",
  "No le temas a los cambios, a menudo son necesarios para llevarte al siguiente nivel de tu vida. Lo nuevo siempre es mejor.",
  "Lo mejor de tu vida está por venir. Créelo con todo tu corazón, porque la fe es el imán que atrae los milagros.",
  "Dios convierte tus lágrimas de dolor en lluvia de bendiciones para regar las semillas de tu futuro crecimiento. Nada es en vano.",
  "Tu propósito en esta vida es mucho más grande que tus problemas actuales. No dejes que lo temporal opaque lo eterno.",
  "No estás sola en esta batalla. Dios camina contigo, pelea por ti y te sostiene cuando sientes que ya no puedes más.",
  "La fe tiene el poder de mover montañas, pero la duda tiene el poder de crearlas. Elige qué voz vas a escuchar hoy.",
  "Eres una creación maravillosa y perfecta de Dios. Él no comete errores. Te diseñó con un propósito y te ama incondicionalmente.",
  "Tu verdadera identidad está en Cristo, no en lo que el mundo dice de ti, en tus logros o en tus fracasos. Eres su hija amada.",
  "Sigue avanzando, aunque sea a pasos lentos. No importa la velocidad, lo importante es no detenerse y mantener la dirección correcta.",
  "No tires la toalla, úsala para secarte el sudor de la frente y seguir luchando. La victoria es para los que persisten.",
  "Eres más grande que tus circunstancias actuales. Ellas no te definen, solo son un escenario temporal en tu gran historia.",
  "La calma en medio del caos es un superpoder que se cultiva con oración y confianza. Practícalo, te hará invencible.",
  "Transforma tu dolor en poder, tus heridas en sabiduría y tus pruebas en un testimonio que pueda ayudar a otros a sanar.",
  "Florece con valentía en el lugar donde la vida te ha plantado, incluso si no es el jardín que esperabas. Tu luz es necesaria ahí.",
  "Eres inquebrantable. Pueden doblarte, pero nunca romperte, porque tu espíritu está anclado en la roca que es Dios.",
  "Tu coraje tiene el poder de abrir caminos donde antes solo había muros. Atrévete a dar el primer paso y verás cómo se abren las puertas.",
  "No existen los errores, solo existen las lecciones. Cada tropiezo te enseña algo valioso que necesitarás para el futuro.",
  "Vence el mal que te hicieron con el bien que hay en ti. No dejes que la amargura de otros contamine la dulzura de tu corazón.",
  "Tu luz interior tiene el poder de disipar las tinieblas más densas. No permitas que nadie ni nada la apague. Brilla con fuerza.",
  "Eres hija del Rey del universo. Camina con la seguridad y la dignidad de quien sabe a quién pertenece. Eres realeza.",
  "Levántate y resplandece, porque ha llegado tu luz, y la gloria de Jehová ha nacido sobre ti. Es tu tiempo de brillar.",

  // --- BLOQUE 4: REALIDAD Y RELACIONES (AMIGA DATE CUENTA) ---
  "Si te hace dudar de tu valor, de tu paz o de tu cordura, ahí no es. El amor verdadero suma, no resta.",
  "No elijas a cualquiera por miedo a la soledad. Elige a esa persona que esté dispuesta a doblar rodillas ante Dios por ti.",
  "El interés se nota en las acciones, no en las palabras bonitas. Y el desinterés, créeme, se nota mucho más. Abre los ojos.",
  "No le guardes luto a alguien que eligió irse de tu vida. Agradécele por el espacio que dejó libre para que llegue algo mejor.",
  "Si hubiera querido, lo habría hecho. Deja de buscar excusas para justificar su falta de interés. Acepta la realidad y sigue adelante.",
  "Deja de buscar agua en pozos que tú misma sabes que están secos. No puedes sacar amor de donde no lo hay.",
  "A veces, perder a la persona equivocada es la mayor ganancia de tu vida. Es ganarte a ti misma de vuelta.",
  "No lo llames orgullo, llámalo dignidad. Hay una gran diferencia entre rogar y valorar tu propia paz mental.",
  "El que se va sin que lo echen, a menudo vuelve sin que lo llamen. Para entonces, asegúrate de haber cambiado la cerradura de tu corazón.",
  "No eres un centro de rehabilitación para personas rotas. Tu misión es amarte a ti misma, no arreglar a los demás.",
  "Quien te quiere de verdad, te busca, te cuida, te respeta y te lo demuestra. Sin excusas, sin peros y sin dudas. Punto.",
  "No aceptes migajas de amor o atención. Tú mereces el banquete completo, con postre incluido. No te conformes con menos.",
  "Si te roba la paz, es una transacción demasiado cara. Ninguna persona vale más que tu tranquilidad y tu salud mental.",
  "A veces, la palabra 'adiós' es el acto de amor propio más bonito y valiente que puedes hacer por ti misma.",
  "No intentes forzar piezas que claramente no encajan en el rompecabezas de tu vida. Lo que es para ti, fluye sin esfuerzo.",
  "Mereces un amor que se sienta como llegar a casa en un día de lluvia: cálido, seguro y reconfortante. No una zona de guerra.",
  "Tienes que dejar ir a la persona que fuiste para poder darle la bienvenida a la persona en la que te estás convirtiendo. Suelta.",
  "Nunca seas la segunda opción de nadie. O eres su prioridad o eres su nada. No hay puntos intermedios en el amor verdadero.",
  "El amor no duele. Lo que duele es la manipulación, el egoísmo y el apego que a menudo confundimos con amor.",
  "Cierra ciclos, no por orgullo, sino por amor propio y salud mental. Hay capítulos que simplemente deben terminar para que la historia avance.",
  "Quien no valora tu presencia, tarde o temprano tendrá que aprender a vivir con tu ausencia. Y esa será su lección, no la tuya.",
  "No bajes tus estándares para encajar en la vida de alguien. Quien te quiera de verdad, se esforzará por alcanzar los tuyos.",
  "Es mucho mejor estar sola y en paz, que mal acompañada y en guerra contigo misma. La soledad no mata, la mala compañía sí.",
  "Tu tiempo es el recurso más valioso que tienes. No se lo regales a personas que no saben qué hacer con él o no lo aprecian.",
  "Aléjate de todo aquello que te apague, que te robe la energía y que te haga dudar de tu propia magia. Protege tu luz.",
  "Tu intuición nunca falla. Es tu miedo a equivocarte y a estar sola lo que a veces te confunde. Escucha esa primera voz.",
  "No recicles ex-amores con la esperanza de que esta vez sea diferente. Generalmente, la basura sigue siendo basura.",
  "Bloquear, silenciar o eliminar de tus redes sociales no es inmadurez, es una herramienta poderosa de amor propio y protección de tu paz.",
  "Aprende a irte a tiempo de los lugares, trabajos y relaciones donde ya no creces, no te valoran o no eres feliz.",
  "Si no suma a tu vida, que no reste. Y si no puede hacer ninguna de las dos, que al menos no estorbe. Neutralidad es mejor que negatividad.",
  "No llames amor a la costumbre o al miedo a la soledad. El amor es emoción, crecimiento y paz. La costumbre es estancamiento.",
  "Deja de romantizar el mínimo esfuerzo. Que te responda un mensaje no es interés, es educación. Mereces mucho más que eso.",
  "Si te quiso de verdad, se notó en sus acciones. Si no te quiso, créeme, se notó mucho más. No hay lugar a dudas.",
  "No eres para cualquiera. Eres una edición limitada, y solo quienes sepan de arte y de tesoros podrán apreciar tu valor.",
  "Tu corazón no es un hotel de paso donde la gente puede entrar y salir cuando quiera. Es un hogar y requiere exclusividad.",
  "El amor verdadero es paz, calma y seguridad. Si se siente como una guerra constante, es ego, no amor. No te confundas.",
  "Deja de perseguir a las personas. Concéntrate en atraerlas mejorando tu propia vida, tu energía y tu felicidad.",
  "Quien te lastima una y otra vez, no te ama. El amor cuida, protege y sana. No hiere intencionalmente.",
  "Pon límites claros y firmes. No es un acto de egoísmo, es un acto de respeto hacia ti misma. Enseñas a la gente cómo tratarte.",
  "No eres el pañuelo de lágrimas de la misma persona que te hace llorar. Deja de jugar ese papel en su drama.",
  "Suelta lo que te pesa para poder volar más alto. Hay cargas que no te corresponden llevar. Libérate de ellas.",
  "Deja de justificar lo injustificable. El maltrato, la indiferencia y la falta de respeto no tienen excusa.",
  "El amor real no te hace sufrir, te hace crecer. No te genera ansiedad, te da paz. No te vacía, te llena.",
  "Eres un premio que alguien afortunado ganará. No te comportes como una opción que cualquiera puede tomar o dejar.",
  "Si te ignora, no te está castigando, te está enseñando a vivir sin él. Agradece la lección y aplícala.",
  "Valora a quien te valora, quiere a quien te quiere y está para quien está para ti. La reciprocidad es la base de toda relación sana.",
  "Nunca mendigues amor, amistad o atención. Lo que se tiene que pedir, no vale la pena tenerlo. Mereces lo que se da con alegría.",
  "Ya estás completa por ti misma. Una pareja debe ser un complemento, no tu otra mitad. No necesitas a nadie para estar entera.",
  "Tu felicidad depende única y exclusivamente de ti. Dejarla en manos de otra persona es el error más grande que puedes cometer.",
  "En lugar de escribirle a él, lee un libro. En lugar de revisar su perfil, trabaja en el tuyo. Invierte esa energía en ti.",
  "Mereces que te presuman con orgullo, que te presenten a su mundo y que griten tu nombre desde el techo más alto.",
  "No seas la 'casi algo' de nadie. Eres una historia de amor completa, no un borrador que se guarda en un cajón.",
  "El respeto es la base fundamental de cualquier relación. Si no hay respeto, no hay nada, por más 'amor' que creas que hay.",
  "Si no sientes paz en esa relación, entonces no es ahí. Tu corazón sabe dónde pertenece, y siempre buscará la calma.",
  "Vete a la primera falta de respeto. No esperes a la segunda. Quien te falta el respeto una vez, lo volverá a hacer.",
  "No cargues con culpas que no son tuyas. Aprende a discernir qué es tu responsabilidad y qué es manipulación de otros.",
  "Eres libre de elegir quién se queda en tu vida y quién se va. Usa esa libertad con sabiduría para proteger tu corazón.",

  // --- BLOQUE 5: REEMPLAZO DE NOTAS CORTAS POR NOTAS SUSTANCIALES ---
  "No te disculpes por ser intensa o sentir demasiado. Esa pasión es lo que te hace estar viva. Quien no sepa manejar tu fuego, que no juegue contigo.",
  "Esa versión tuya del pasado que perdonó, que siguió adelante y que sanó en silencio, merece todo tu respeto y amor. Hónrala.",
  "Recuerda que las oraciones no tienen fecha de caducidad. Lo que pediste con fe, Dios ya lo está preparando. Su tiempo es perfecto, no el nuestro.",
  "Estás exactamente donde necesitas estar. Cada desvío y cada error te han traído hasta este momento. Confía en tu viaje, es sagrado.",
  "La persona correcta para ti no existe, se construye. Se elige cada día, se cultiva con paciencia y se ama con imperfecciones.",
  "A veces, la mayor bendición es una oración no contestada. Dios sabe lo que es mejor para ti, incluso cuando tú no lo ves.",
  "No eres una carga. Eres un tesoro. Quien te haga sentir como un peso, simplemente no tiene la fuerza para llevar algo tan valioso.",
  "El universo te está preparando para las cosas que le has pedido. Por eso te está quitando lo que ya no vibra a esa misma frecuencia.",
  "Sé la energía que quieres atraer. Si quieres amor, sé amorosa. Si quieres paz, sé pacífica. Tu mundo exterior es un reflejo de tu interior.",
  "Deja de buscar finales felices y empieza a buscar una felicidad sin final. La alegría no es un destino, es una forma de viajar.",
  "Tu alma gemela podría ser esa amiga que te escucha sin juzgar. El amor tiene muchas formas y no todas son románticas.",
  "No te preocupes por la gente que no te quiere. Preocúpate por la gente que finge quererte. La honestidad en el desprecio es mejor que la hipocresía.",
  "Sanar no es olvidar. Es recordar sin que te duela, sin que te robe la paz. Es mirar atrás y sentir gratitud por la lección.",
  "Eres la suma de todas tus batallas ganadas y perdidas. Cada cicatriz es una medalla de honor que demuestra tu valentía.",
  "El primer paso para recibir lo que mereces es dejar de aceptar lo que no. El universo necesita espacio para poner tus bendiciones.",
  "No hay nada más poderoso que una mujer que se ha reconstruido a sí misma con las mismas piedras que le lanzaron.",
  "Que tu amor propio sea tan fuerte que te vuelvas inmune a la opinión de los demás. Su aprobación no es necesaria para tu existencia.",
  "A veces, estar en paz es mejor que tener la razón. Elige tus batallas sabiamente, no todas merecen tu energía.",
  "No te sientas culpable por poner límites. Es la única forma de enseñarle al mundo cómo debe tratarte. Es un acto de autorespeto.",
  "Eres mucho más que un cuerpo. Eres una mente, un alma, un universo de emociones y sueños. Valórate en tu totalidad.",
  "La vida te romperá el corazón tantas veces como sea necesario hasta que aprendas a amarte a ti misma primero.",
  "No esperes a que pase la tormenta. Aprende a bailar bajo la lluvia. La felicidad es disfrutar del proceso, no solo del resultado.",
  "La gratitud es la llave que abre la puerta a la abundancia. Agradece por lo que tienes y verás cómo se multiplica.",
  "Eres la única persona que estará contigo toda tu vida. Asegúrate de tener una relación sana y amorosa contigo misma.",
  "No busques a alguien que te complete. Busca a alguien que te acepte completamente, con tus luces y tus sombras.",
  "El perdón no es para la otra persona, es para ti. Es soltar el ancla que te mantiene atada al dolor del pasado. Libérate.",
  "Tu intuición es tu superpoder. Si algo no se siente bien, es porque probablemente no lo sea. Confía en esa voz interior.",
  "No tengas miedo de empezar de nuevo. Esta vez no estás empezando desde cero, estás empezando desde la experiencia.",
  "Eres responsable de tu propia felicidad. No le entregues ese poder a nadie. Cultívala desde adentro hacia afuera.",
  "El amor propio es un viaje, no un destino. Habrá días buenos y malos. Sé paciente y compasiva en el proceso.",
  "No te compares con los demás. Cada flor florece a su propio tiempo. Tu momento de brillar llegará cuando estés lista.",
  "La vida es demasiado corta para vivir el sueño de otra persona. Sé valiente y construye tu propio camino.",
  "Eres el resultado de las decisiones que tomas. Si no te gusta tu vida, empieza a tomar decisiones diferentes.",
  "La soledad puede ser un regalo. Es una oportunidad para conocerte, escucharte y enamorarte de tu propia compañía.",
  "No te aferres a lo que ya no es. Soltar es un acto de amor y valentía. Deja espacio para lo nuevo.",
  "Tus errores no te definen. Son parte de tu aprendizaje. Lo que te define es cómo te levantas después de caer.",
  "Sé amable contigo misma. Estás haciendo lo mejor que puedes con lo que sabes. Eres un trabajo en progreso.",
  "La felicidad no se encuentra, se crea. Es el resultado de tus pensamientos, tus hábitos y tus acciones diarias.",
  "No necesitas que nadie crea en ti mientras tú creas en ti misma. Tu fe en tu propio potencial es lo único que importa.",
  "Eres una combinación única de talentos y dones. No hay nadie en el mundo como tú. Eres irremplazable.",
  "El universo conspira a favor de un corazón valiente y agradecido. Mantén tu vibración alta y verás la magia suceder.",
  "No te preocupes por lo que no puedes controlar. Enfoca tu energía en lo que sí depende de ti: tu actitud y tu esfuerzo.",
  "La vida no se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia. Disfruta el ahora.",
  "Eres la artista de tu vida. No le des el pincel a nadie más. Pinta tus días con los colores que te hagan feliz.",
  "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito. Si amas lo que haces, tendrás éxito.",
  "No te tomes nada personal. Lo que los demás dicen y hacen es una proyección de su propia realidad, no de la tuya.",
  "Eres un imán para los milagros. Espera lo inesperado y mantén tu corazón abierto a las bendiciones que vienen.",
  "El amor es la respuesta, sin importar cuál sea la pregunta. Ama sin miedo, sin límites y sin condiciones.",
  "Tu propósito en la vida es ser feliz y compartir esa felicidad con los demás. No hay misión más importante que esa.",
  "La vida te pondrá obstáculos, pero los límites los pones tú. No hay nada que no puedas lograr si te lo propones.",
  "Eres luz, amor y energía pura. No dejes que el mundo te convenza de que eres algo menos que eso. Eres divina.",

  // --- BLOQUE 6: MIX FINAL (COMPLETANDO LOS 365) ---
  "La vida es un eco; lo que envías, regresa. Lo que siembras, cosechas. Lo que das, recibes. Lo que ves en los demás, existe en ti.",
  "No esperes nada de nadie, espéralo todo de ti. Eres la única persona capaz de cumplir tus propias expectativas y sueños.",
  "Conviértete en el cambio que quieres ver en el mundo. Empieza por transformar tu interior y verás cómo tu exterior cambia.",
  "La felicidad no es un destino al que se llega, sino una elección consciente que se hace cada día, a cada momento.",
  "Disfruta de las pequeñas cosas de la vida, porque un día mirarás atrás y te darás cuenta de que eran las cosas más grandes.",
  "La gratitud tiene el poder de transformar lo que tienes en más que suficiente. Un corazón agradecido es un imán para los milagros.",
  "Contagia alegría, paz y buena energía donde quiera que vayas. Sé la razón por la que alguien más vuelva a creer en la bondad.",
  "Sé amable siempre, porque cada persona que conoces está librando una batalla interna de la que no sabes nada.",
  "Tu actitud es el pincel con el que pintas tu día. Puedes elegir colores grises o colores vibrantes. La elección es tuya.",
  "Hazlo con miedo, pero hazlo de todas formas. La valentía no es la ausencia de miedo, sino la capacidad de actuar a pesar de él.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día. No subestimes el poder de la constancia y la disciplina.",
  "No cuentes los días, haz que los días cuenten. Vive cada momento con intensidad, propósito y gratitud.",
  "La vida es demasiado corta como para no comprarte los zapatos, comerte el postre o decir 'te quiero'. Disfruta sin culpas.",
  "Sonríe, no solo porque eres feliz, sino para confundir a aquellos que quieren verte mal. Tu alegría es tu mejor venganza.",
  "Eres la autora de tu propia vida. No permitas que nadie más sostenga el lápiz y escriba un guion que no te pertenece.",
  "La suerte es simplemente el punto donde la preparación y la oportunidad se encuentran. Sigue preparándote, tu oportunidad llegará.",
  "No busques el momento perfecto para empezar algo. Toma el momento que tienes y hazlo perfecto con tu acción y tu actitud.",
  "Tu vibra atrae a tu tribu. Si quieres rodearte de personas positivas y exitosas, conviértete tú en una de ellas.",
  "Aquello en lo que crees con convicción, es lo que creas en tu realidad. Tus pensamientos son increíblemente poderosos.",
  "Escucha a tu corazón, él ya sabe lo que tu mente todavía está tratando de entender. Confía en su sabiduría ancestral.",
  "No tengas miedo de ser tú misma, incluso si eso significa ser diferente a los demás. Tu autenticidad es tu mayor regalo al mundo.",
  "El mundo necesita desesperadamente tu luz, tus dones y tu perspectiva única. No te escondas, el mundo te está esperando.",
  "Este es el día que hizo el Señor; nos gozaremos y alegraremos en él. Vive el presente como el regalo que es.",
  "Sonríe, porque Cristo te ama incondicionalmente. Su amor no depende de tus logros, simplemente te ama por ser tú.",
  "La alegría del Señor es tu fortaleza. Cuando te sientas débil, refúgiate en su presencia y serás renovada.",
  "Todo lo puedo en Cristo que me fortalece. No hay desafío demasiado grande ni montaña demasiado alta cuando Él está de tu lado.",
  "Dios es fiel a sus promesas. Aunque el tiempo pase y las circunstancias cambien, su palabra permanece para siempre.",
  "Su amor por ti es inagotable, incondicional e infinito. Nunca podrás hacer nada para que te ame más o menos.",
  "Eres bendecida para bendecir. Las bendiciones que recibes no son solo para ti, sino para que las compartas con los demás.",
  "La oración tiene el poder de cambiar las cosas. Puede cambiar circunstancias, corazones y destinos. Nunca dejes de orar.",
  "Dios nunca falla. Puede que no actúe como tú esperas o cuando tú quieres, pero su plan siempre es perfecto y para tu bien.",
  "Su gracia es suficiente para ti en tus momentos de debilidad. No necesitas ser perfecta, solo necesitas depender de Él.",
  "No te preocupes por el mañana, porque Dios ya está allí. Él tiene el control de tu futuro, así que puedes descansar en el presente.",
  "Eres amada mucho más allá de lo que puedes imaginar. El amor de Dios por ti es más profundo que el océano y más alto que el cielo.",
  "Tu valor no depende de tus logros, de tu apariencia o de la opinión de los demás. Tu valor está en ser una hija de Dios.",
  "Eres digna de todo lo bueno que la vida tiene para ofrecer. No te conformes con menos de lo que mereces. Apunta alto.",
  "No te conformes con una vida mediocre, fuiste creada para la grandeza. Tienes un propósito divino que cumplir.",
  "Dios te ama tal y como eres, pero te ama demasiado como para dejarte así. Él siempre está trabajando en ti para hacerte mejor.",
  "Confía en el plan de Dios para tu vida. Él ve el panorama completo y sabe exactamente lo que está haciendo, aunque tú no lo entiendas.",
  "La fe es el arte de ver lo invisible, creer lo increíble y recibir lo imposible. Es tu conexión con el poder de Dios.",
  "Dios es un experto en abrir caminos donde parece que no los hay. Cuando llegues al final de tus posibilidades, Él creará una nueva.",
  "Eres la niña de sus ojos, su tesoro más preciado. Él te cuida, te protege y te cela con un amor paternal perfecto.",
  "Dios pelea por ti mientras tú te mantienes en paz. No tienes que luchar todas las batallas, algunas son para que Él muestre su poder.",
  "Su paz sobrepasa todo entendimiento humano. Es una paz que no depende de las circunstancias, sino de su presencia en tu vida.",
  "Aprende a descansar en Él. Suelta tus cargas, tus ansiedades y tus miedos. Él es tu lugar seguro, tu remanso de paz.",
  "Dios es tu pronto auxilio en los momentos de tribulación. Cuando te sientas sola y sin fuerzas, clama a Él y vendrá a tu rescate.",
  "El amor todo lo puede, todo lo cree, todo lo espera, todo lo soporta. El amor nunca deja de ser. Vive y ama con intensidad.",
  "La esperanza no avergüenza. Mantener la esperanza en medio de la dificultad es un acto de fe y valentía que será recompensado.",
  "Sé fuerte y valiente, no temas ni desmayes. El Señor tu Dios estará contigo dondequiera que vayas. No estás sola.",
  "Dios está en completo control de tu vida. Nada sucede sin su permiso. Confía en su soberanía y descansa en su plan.",
  "Tu vida tiene un sentido y un propósito eterno. No eres un accidente. Eres un diseño divino con una misión que cumplir.",
  "Eres amada con un amor eterno. Antes de que nacieras, Él ya te amaba. Y te amará por toda la eternidad.",
  "Nunca estás realmente sola. La presencia de Dios te acompaña a cada paso, en cada momento, en cada respiración.",
  "Dios es bueno todo el tiempo. Y todo el tiempo, Dios es bueno. Busca su bondad en cada detalle de tu día y la encontrarás.",
  "Incluso en los días más oscuros, la bondad de Dios se manifiesta. Aprende a verla y a agradecerla.",
  "Su luz divina brilla en tu interior. Eres un reflejo de su gloria. No permitas que nada ni nadie opaque esa luz.",
  "Eres un milagro andante. El simple hecho de que estés viva, respirando y leyendo esto es una prueba del poder y el amor de Dios.",
  "La vida es un regalo hermoso y frágil. Vívela con gratitud, alegría y propósito. No desperdicies ni un solo día.",
  "Ama sin medida, sin miedo y sin esperar nada a cambio. El amor es la fuerza más poderosa del universo y la esencia de tu ser.",
  "Perdona rápidamente y avanza. El rencor es un veneno que te tomas tú esperando que le haga daño al otro. Libérate.",
  "Sé agradecida por todo, tanto por las bendiciones como por las lecciones. La gratitud es la actitud que atrae más cosas por las que estar agradecida.",
  "La vida te ama y quiere que seas feliz. Alinea tus pensamientos y acciones con esa verdad y verás cómo todo fluye.",
  "Eres pura inspiración para las personas que te rodean, incluso cuando no te das cuenta. Tu forma de ser y de vivir impacta vidas.",
  "Tu alma conoce el camino. Cuando te sientas perdida, guarda silencio y escucha su susurro. Ella te guiará de regreso a casa.",
  "Sigue tu intuición, es el GPS de tu alma. Te llevará por el camino correcto y te protegerá de los peligros.",
  "Eres una persona maravillosa, llena de luz, dones y talentos. Cree en ti misma y en todo lo que eres capaz de lograr.",
  "El mundo es tuyo para que lo explores, lo disfrutes y dejes tu huella en él. No te limites, sé audaz y aventurera.",
  "Ve por ello. Sea lo que sea que anhele tu corazón, ve por ello con todas tus fuerzas, con toda tu fe y con toda tu pasión.",
  "Hazlo posible. No te quedes en el 'ojalá'. Toma acción y convierte tus sueños en realidad. Tienes el poder para hacerlo.",
  "Crea la realidad que deseas vivir. Eres la manifestación de tus pensamientos dominantes. Piensa en grande, piensa en positivo.",
  "Eres abundancia en todas las áreas de tu vida. Cree en tu capacidad de atraer riqueza, salud, amor y felicidad.",
  "Mereces lo mejor de lo mejor. No te conformes con menos. Eleva tus estándares y el universo responderá a ellos.",
  "Abre tus brazos y acepta todo lo bueno que la vida tiene para ti. No te sabotees, no te sientas indigna. Lo mereces.",
  "Eres prosperidad. El dinero y las oportunidades fluyen hacia ti de manera fácil y constante. Agradece y comparte.",
  "Tu mente es la herramienta más poderosa que tienes. Úsala para construir la vida de tus sueños, no para destruirla con dudas.",
  "Piensa en positivo. Tus pensamientos crean tu realidad. Enfócate en lo que quieres, no en lo que temes. Verás la diferencia.",
  "Atraes lo que eres, no lo que quieres. Trabaja en ser la persona que deseas atraer a tu vida, ya sea en el amor o en los negocios.",
  "Vibra alto. Mantén tus pensamientos, emociones y acciones en una frecuencia de amor, gratitud y alegría. Atraerás lo mismo.",
  "Conecta con tu esencia divina cada día. Medita, ora, pasa tiempo en la naturaleza. Recarga tu espíritu.",
  "Eres paz. En tu interior reside una calma inquebrantable que ninguna circunstancia externa puede perturbar.",
  "Eres amor. Fuiste creada por amor y para amar. El amor es tu estado natural. Vuelve a él siempre.",
  "Eres luz. Tu misión es brillar con toda tu intensidad y ayudar a otros a encontrar su propia luz. Sé un faro en el mundo."
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