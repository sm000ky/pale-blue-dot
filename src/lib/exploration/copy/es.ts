/**
 * Spanish — the exploration copy.
 *
 * Only the fields this language actually changes are here. Eyebrows, chapter
 * stamps, hotspot labels and plate captions are instrument markings and are the
 * same string in every locale by design, so they live in `en.ts` alone and
 * `beatCopy` merges this table over the English one field by field.
 *
 * Translated as editorial prose from the English source, then checked by a
 * separate reviewer against that source for facts, structure and tone. Numbers,
 * dates, units and identifiers carry through unchanged; only their notation is
 * localised where the language requires it.
 */

import type { BeatCopy } from "./types";

/* The five plate descriptions. Two of them are carried by four beats each — the
   spacecraft holds across the Voyager chapter and the cover across the four
   hotspot beats — so they are named once rather than repeated eight times. */
const PLATE_ALT =
  "Un campo pálido de azul y gris atravesado por una banda diagonal de luz solar dispersa. Dentro de la banda, un poco a la derecha del centro, una única mota blanca: la Tierra.";

const PORTRAIT_ALT =
  "Sesenta tomas de la cámara de ángulo estrecho dispuestas como un mosaico curvo sobre negro, con seis recuadros rotulados Jupiter, Earth, Venus, Saturn, Uranus y Neptune. En cada recuadro el planeta es un solo punto de luz.";

const VOYAGER_ALT =
  "Una recreación artística de una sonda Voyager sobre un fondo de estrellas negro: una antena parabólica blanca de espaldas, el brazo de instrumentos y los generadores de radioisótopos montados sobre soportes a un lado, y dos antenas largas que salen del encuadre.";

const DISC_ALT =
  "El disco en sí: un disco de oro brillante como un espejo, con la etiqueta grabada “The Sounds of Earth”, “United States of America, Planet Earth”.";

const COVER_ALT =
  "La cubierta grabada del Golden Record, fotografiada sobre negro. Hay cuatro grupos de diagramas incisos en la superficie dorada: el disco y su aguja arriba a la izquierda, un esquema para descifrar las imágenes arriba a la derecha, un mapa de púlsares radial abajo a la izquierda y dos átomos de hidrógeno abajo a la derecha.";

export const es: Record<string, BeatCopy> = {
  "photo-intro": {
    heading: "THE PALE\nBLUE DOT",
    body: "El 14 de febrero de 1990, Voyager 1 volvió la mirada hacia el mundo que había dejado atrás.",
  },
  "photo-distance": {
    body: "A unos seis mil millones de kilómetros del Sol, la Tierra no era más que un punto de luz.",
    note: "Medida desde el Sol. Los pies de foto del archivo de la NASA dan también una distancia oblicua desde la Tierra de más de cuatro mil millones de millas: la misma fotografía, medida desde otro punto.",
  },
  "photo-pixel": {
    body: "En la cámara de ángulo estrecho de Voyager, la Tierra medía solo unos 0,12 píxeles de ancho.",
    note: "Cámara de ángulo estrecho, 1500 mm. Las páginas más recientes de la NASA redondean la cifra a cerca de un píxel.",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note: "Los datos de 1990, reprocesados por NASA/JPL en 2020.",
  },
  "lastlook-frames": {
    body: "Pale Blue Dot no fue una fotografía aislada.\n\nFormaba parte de la última secuencia, la que compuso un retrato del Sistema Solar.",
  },
  "lastlook-worlds": {
    heading: "Venus\nTierra\nJúpiter\nSaturno\nUrano\nNeptuno",
    body: "Seis planetas, reducidos a puntos de luz.",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body: "Después de esa secuencia, se apagaron las cámaras de Voyager 1.\n\nSu viaje continuó. Sus cámaras no.",
  },
  "voyager-intro": {
    heading: "LA MÁQUINA\nQUE SIGUIÓ ADELANTE",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body: "Voyager 1 dejó la Tierra rumbo a los planetas exteriores.",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body: "Menos de dos años después, pasó junto a Júpiter.",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body: "Después de Saturno, su trayectoria la llevó hacia el exterior.",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body: "Treinta y cinco años después del lanzamiento, Voyager 1 entró en el espacio interestelar.",
  },
  "message-intro": {
    heading: "VOYAGER\nLLEVA ALGO MÁS",
    body: "Voyager no llevaba solo instrumentos científicos.\n\nEn su costado va montado un disco que habla de la Tierra.",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body: "Un disco de cobre chapado en oro, de treinta centímetros de diámetro.",
  },
  "sent-intro": {
    heading: "SI HUBIERA\nUN SOLO DISCO",
    body: "Si un solo objeto tuviera que llevar una huella de la Tierra, ¿qué pondríamos dentro?",
  },
  "sent-images": {
    heading: "Cuerpos.\nComida.\nEdificios.\nCiencia.\nNaturaleza.\nFamilias.\nEl planeta mismo.",
    body: "115 imágenes, codificadas en forma analógica.",
  },
  "sent-languages": {
    body: "Cincuenta y cinco idiomas ofrecen un saludo a quien pueda estar escuchando.",
  },
  "sent-sounds": {
    heading: "Oleaje.\nViento.\nTruenos.\nAves.\nBallenas.\nVida humana.",
  },
  "sent-music": {
    body: "Unos noventa minutos de música, elegida entre distintas culturas y épocas.",
  },
  "instructions-intro": {
    heading: "SIN IDIOMA\nEN COMÚN",
    body: "El disco supone que quien lo reciba no entiende ninguna lengua humana.\n\nSus instrucciones están escritas en física.",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body: "El primer diagrama explica cómo debe girar el disco y la duración de una vuelta.",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body: "Otro diagrama explica cómo la señal grabada puede reconstruirse como una imagen.",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body: "Un mapa de púlsares señala hacia el Sistema Solar.\n\nNo el nombre de nuestro hogar. Sus coordenadas.",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body: "Una transición del átomo de hidrógeno proporciona la unidad de tiempo que se usa en todos los diagramas.",
  },
  "travel-address": {
    body: "El Golden Record no se envió a ninguna dirección en particular.\n\nSimplemente viaja con Voyager.",
  },
  "travel-40000": {
    body: "La NASA señala que pasarán unos cuarenta mil años antes de que Voyager se acerque a otro sistema planetario.",
  },
  "end-reflection": {
    body: "Fotografiamos nuestro hogar desde muy lejos.",
  },
  "end-carried": {
    body: "Después llevamos una pequeña parte de él aún más lejos.",
  },
  "ack-intro": {
    body: "Esta obra se apoya en el trabajo de científicos, ingenieros, artistas, músicos, fotógrafos, archivistas y narradores que nos ayudaron a ver la Tierra desde lejos.\n\nLo que crearon y conservaron permite que las generaciones que nos sigan hereden no solo un registro de dónde venimos, sino también un registro de cómo nos veíamos a nosotros mismos en otro tiempo.",
  },
  "end-dedication": {
    body: "Para quienes miraron más lejos, registraron con cuidado y conservaron lo que encontraron —\n\npara que alguien que todavía no ha nacido pueda llegar a verlo.",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Mensaje colocado a bordo del Voyager Golden Record · 1977",
  },
};
