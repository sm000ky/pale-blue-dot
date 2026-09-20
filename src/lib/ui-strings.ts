/**
 * Every string the interface says, in every language the piece speaks.
 *
 * The chrome used to be English-only literals scattered across four components —
 * defensible when the piece had one voice and one translation, and untenable at
 * seven. They are gathered here so that adding a language is a column rather than
 * a search across the codebase, and so that a missing string is a type error.
 *
 * What is NOT here, deliberately: licence names, creator names, copyright lines,
 * source titles and archival identifiers. CC BY 4.0, NASA/JPL-Caltech,
 * "© 2006 Democritus Properties, LLC" and PIA17049 are the same in every language
 * because they are names, not words.
 *
 * `carterTranslation` is null for English: the Carter line is already English, and
 * printing a "translation" of it into itself would be absurd. Every other locale
 * supplies one, shown BELOW the untouched original and labelled as a translation.
 */

import type { LocaleCode } from "@/lib/locales";

export type UiStrings = {
  credits: string;
  mute: string;
  unmute: string;
  replay: string;
  pause: string;
  resume: string;
  subtitles: string;
  close: string;
  playNarration: string;
  /** A suggestion under the play gate, never a requirement. */
  headphones: string;
  /** While the five Earth maps are still on the wire, in place of `playNarration`. */
  loadingMaps: string;
  /** The same thing again, as the label on the percentage readout. */
  surfaceMaps: string;
  /** The document's own description, read out before anything else. */
  pageDescription: string;
  /** The attribution strip on the opening screen. Names and licences stay verbatim. */
  attribution: string;
  /** Prefixes the rights holder in the screen-reader description of a plate. */
  creditPrefix: string;
  /**
   * Labels for controls whose visible text is a single word and whose purpose is not.
   * `{language}` in `ariaLanguage` is replaced with the chosen language's own name.
   */
  ariaLanguage: string;
  ariaPlayNarration: string;
  ariaPause: string;
  ariaReplayReading: string;
  ariaResume: string;
  /**
   * Failures, said out loud. `errorFailed` carries `{message}`, replaced with the
   * browser's own text — which stays in whatever language the browser reports it in,
   * because it is not ours to translate.
   */
  errorBlocked: string;
  errorUnsupported: string;
  errorAborted: string;
  errorFailed: string;
  errorUnknown: string;
  errorNarrationLoad: string;
  webglUnavailable: string;
  musicUnavailable: string;
  creditsPanelTitle: string;
  endingEyebrow: string;
  endingLine: string;
  archiveLabel: string;
  archiveNote: string;
  archiveLinkLabel: string;
  /** Stamped where NASA's own listing carries no credit line for a frame. */
  creditNotPrinted: string;
  fullCredits: string;
  recordNotice: string;
  creditNarration: string;
  creditMusic: string;
  creditVisual: string;
  creditRecord: string;
  creditResearch: string;
  creditSoftware: string;
  carterTranslationLabel: string;
  gateContinue: string;
  /** Row labels in the attribution sheet. */
  roles: { narration: string; music: string; encore: string; textures: string; referencePhoto: string; archivePlates: string };
  /** Null for English only. */
  carterTranslation: string | null;
};

export const uiStrings: Record<LocaleCode, UiStrings> = {
  "en": {
    credits: "Credits",
    mute: "Mute",
    unmute: "Unmute",
    replay: "Replay",
    pause: "Pause",
    resume: "Resume",
    subtitles: "Subtitles",
    close: "Close",
    playNarration: "Play narration",
    headphones: "Headphones recommended for the best experience.",
    loadingMaps: "Loading surface maps",
    surfaceMaps: "Surface maps",
    pageDescription:
      "An interactive reading of Carl Sagan’s “Pale Blue Dot”. Keyboard: space or K plays and pauses, M mutes, C opens the credits.",
    attribution:
      "Words © 1994 Carl Sagan · Music “Aurora” by Scott Buckley (CC BY 4.0) · Earth textures by Solar System Scope (CC BY 4.0)",
    creditPrefix: "Credit",
    ariaLanguage: "Subtitle language: {language}. Change it.",
    ariaPlayNarration:
      "Play the narration: Carl Sagan reading Pale Blue Dot, 3 minutes 31 seconds",
    ariaPause: "Pause the reading",
    ariaReplayReading: "Play the reading again from the beginning",
    ariaResume: "Resume the reading",
    errorBlocked: "The browser blocked audio playback. Press play once more to allow it.",
    errorUnsupported: "This browser cannot decode the narration file (MP3).",
    errorAborted: "Playback was interrupted before it started. Press play again.",
    errorFailed: "Playback failed — {message}",
    errorUnknown: "Playback failed for an unknown reason.",
    errorNarrationLoad: "The narration file could not be loaded. Check the connection and reload.",
    webglUnavailable: "WebGL unavailable · audio only",
    musicUnavailable: "Music track unavailable",
    creditsPanelTitle: "Credits & attribution",
    endingEyebrow: "End of transmission",
    endingLine: "A MESSAGE FROM\nA PALE BLUE DOT.",
    archiveLabel: "SELECTED IMAGE ARCHIVE",
    archiveNote: "NASA publishes this as a partial listing, in no groups. The groupings are ours.",
    archiveLinkLabel: "VIEW AT NASA",
    creditNotPrinted: "CREDIT NOT PRINTED",
    fullCredits: "FULL CREDITS & SOURCES",
    recordNotice: "Golden Record image titles and historical references are drawn from NASA's archive. NASA states that these images are copyright protected. Any reproduced material is shown with the available source credit, without claiming license or permission unless explicitly documented.",
    creditNarration: "CREDITS / NARRATION",
    creditMusic: "CREDITS / MUSIC",
    creditVisual: "CREDITS / VISUAL MATERIAL",
    creditRecord: "CREDITS / THE GOLDEN RECORD",
    creditResearch: "CREDITS / RESEARCH",
    creditSoftware: "BUILT WITH",
    carterTranslationLabel: "Translation",
    gateContinue: "Continue without a translation",
    roles: {
      narration: "Narration",
      music: "Music",
      encore: "Closing audio",
      textures: "Earth textures",
      referencePhoto: "Reference image",
      archivePlates: "Archive images",
    },
    carterTranslation: null,
  },
  "id": {
    credits: "Kredit",
    mute: "Bisukan",
    unmute: "Nyalakan",
    replay: "Ulangi",
    pause: "Jeda",
    resume: "Lanjutkan",
    subtitles: "Takarir",
    close: "Tutup",
    playNarration: "Putar narasi",
    headphones: "Headphone direkomendasikan untuk pengalaman terbaik.",
    loadingMaps: "Memuat peta permukaan",
    surfaceMaps: "Peta permukaan",
    pageDescription:
      "Pembacaan interaktif “Pale Blue Dot” karya Carl Sagan. Papan ketik: spasi atau K memutar dan menjeda, M membisukan, C membuka kredit.",
    attribution:
      "Kata-kata © 1994 Carl Sagan · Musik “Aurora” oleh Scott Buckley (CC BY 4.0) · Tekstur Bumi oleh Solar System Scope (CC BY 4.0)",
    creditPrefix: "Kredit",
    ariaLanguage: "Bahasa takarir: {language}. Ubah.",
    ariaPlayNarration:
      "Putar narasi: Carl Sagan membacakan Pale Blue Dot, 3 menit 31 detik",
    ariaPause: "Jeda pembacaan",
    ariaReplayReading: "Putar ulang pembacaan dari awal",
    ariaResume: "Lanjutkan pembacaan",
    errorBlocked: "Peramban memblokir pemutaran audio. Tekan putar sekali lagi untuk mengizinkannya.",
    errorUnsupported: "Peramban ini tidak dapat memutar berkas narasi (MP3).",
    errorAborted: "Pemutaran terhenti sebelum dimulai. Tekan putar lagi.",
    errorFailed: "Pemutaran gagal — {message}",
    errorUnknown: "Pemutaran gagal karena sebab yang tidak diketahui.",
    errorNarrationLoad: "Berkas narasi tidak dapat dimuat. Periksa koneksi lalu muat ulang.",
    webglUnavailable: "WebGL tidak tersedia · hanya audio",
    musicUnavailable: "Trek musik tidak tersedia",
    creditsPanelTitle: "Kredit & atribusi",
    endingEyebrow: "Akhir transmisi",
    endingLine: "PESAN DARI SEBUAH\nTITIK BIRU PUCAT.",
    archiveLabel: "SEBAGIAN ARSIP GAMBAR",
    archiveNote: "NASA menerbitkan ini sebagai daftar sebagian, tanpa pengelompokan. Pengelompokannya dari kami.",
    archiveLinkLabel: "LIHAT DI NASA",
    creditNotPrinted: "KREDIT TIDAK TERCETAK",
    fullCredits: "KREDIT & SUMBER LENGKAP",
    recordNotice: "Judul gambar dan referensi sejarah Golden Record bersumber dari arsip NASA. NASA menyatakan gambar-gambar tersebut dilindungi hak cipta. Setiap materi yang direproduksi ditampilkan dengan kredit sumber yang tersedia, tanpa klaim lisensi atau izin kecuali dinyatakan secara eksplisit.",
    creditNarration: "KREDIT / NARASI",
    creditMusic: "KREDIT / MUSIK",
    creditVisual: "KREDIT / MATERI VISUAL",
    creditRecord: "KREDIT / GOLDEN RECORD",
    creditResearch: "KREDIT / RISET",
    creditSoftware: "DIBANGUN DENGAN",
    carterTranslationLabel: "Terjemahan",
    gateContinue: "Lanjut tanpa terjemahan",
    roles: {
      narration: "Narasi",
      music: "Musik",
      encore: "Audio penutup",
      textures: "Tekstur Bumi",
      referencePhoto: "Citra acuan",
      archivePlates: "Citra arsip",
    },
    carterTranslation: "Kita berusaha melewati zaman kita, agar suatu hari kita dapat hidup di zaman kalian.",
  },
  "es": {
    credits: "Créditos",
    mute: "Silenciar",
    unmute: "Activar audio",
    replay: "Repetir",
    pause: "Pausar",
    resume: "Reanudar",
    subtitles: "Subtítulos",
    close: "Cerrar",
    playNarration: "Reproducir narración",
    headphones: "Se recomienda usar auriculares para la mejor experiencia.",
    loadingMaps: "Cargando mapas de superficie",
    surfaceMaps: "Mapas de superficie",
    pageDescription:
      "Una lectura interactiva de “Pale Blue Dot”, de Carl Sagan. Teclado: espacio o K reproduce y pausa, M silencia, C abre los créditos.",
    attribution:
      "Texto © 1994 Carl Sagan · Música “Aurora” de Scott Buckley (CC BY 4.0) · Texturas de la Tierra de Solar System Scope (CC BY 4.0)",
    creditPrefix: "Crédito",
    ariaLanguage: "Idioma de los subtítulos: {language}. Cambiarlo.",
    ariaPlayNarration:
      "Reproducir la narración: Carl Sagan lee Pale Blue Dot, 3 minutos y 31 segundos",
    ariaPause: "Pausar la lectura",
    ariaReplayReading: "Reproducir la lectura de nuevo desde el principio",
    ariaResume: "Reanudar la lectura",
    errorBlocked: "El navegador bloqueó la reproducción de audio. Pulsa reproducir otra vez para permitirla.",
    errorUnsupported: "Este navegador no puede decodificar el archivo de la narración (MP3).",
    errorAborted: "La reproducción se interrumpió antes de empezar. Pulsa reproducir de nuevo.",
    errorFailed: "La reproducción falló — {message}",
    errorUnknown: "La reproducción falló por un motivo desconocido.",
    errorNarrationLoad: "No se pudo cargar el archivo de la narración. Comprueba la conexión y vuelve a cargar.",
    webglUnavailable: "WebGL no disponible · solo audio",
    musicUnavailable: "Pista de música no disponible",
    creditsPanelTitle: "Créditos y atribución",
    endingEyebrow: "Fin de la transmisión",
    endingLine: "UN MENSAJE DESDE\nUN PUNTO AZUL PÁLIDO.",
    archiveLabel: "SELECCIÓN DEL ARCHIVO DE IMÁGENES",
    archiveNote: "La NASA lo publica como un listado parcial, sin agrupar. Las agrupaciones son nuestras.",
    archiveLinkLabel: "VER EN LA NASA",
    creditNotPrinted: "SIN CRÉDITO IMPRESO",
    fullCredits: "TODOS LOS CRÉDITOS Y FUENTES",
    recordNotice: "Los títulos de las imágenes del Golden Record y las referencias históricas proceden del archivo de la NASA. La NASA declara que estas imágenes están protegidas por derechos de autor. Todo material reproducido se muestra con el crédito de origen disponible, sin reclamar licencia ni permiso salvo que esté documentado de forma explícita.",
    creditNarration: "CRÉDITOS / NARRACIÓN",
    creditMusic: "CRÉDITOS / MÚSICA",
    creditVisual: "CRÉDITOS / MATERIAL VISUAL",
    creditRecord: "CRÉDITOS / GOLDEN RECORD",
    creditResearch: "CRÉDITOS / INVESTIGACIÓN",
    creditSoftware: "HECHO CON",
    carterTranslationLabel: "Traducción",
    gateContinue: "Continuar sin traducción",
    roles: {
      narration: "Narración",
      music: "Música",
      encore: "Audio de cierre",
      textures: "Texturas de la Tierra",
      referencePhoto: "Imagen de referencia",
      archivePlates: "Imágenes de archivo",
    },
    carterTranslation: "Estamos intentando sobrevivir a nuestro tiempo para poder vivir en el suyo.",
  },
  "fr": {
    credits: "Crédits",
    mute: "Couper le son",
    unmute: "Activer le son",
    replay: "Rejouer",
    pause: "Pause",
    resume: "Reprendre",
    subtitles: "Sous-titres",
    close: "Fermer",
    playNarration: "Écouter la narration",
    headphones: "Un casque est recommandé pour une meilleure expérience.",
    loadingMaps: "Chargement des cartes de surface",
    surfaceMaps: "Cartes de surface",
    pageDescription:
      "Une lecture interactive de « Pale Blue Dot » de Carl Sagan. Clavier : espace ou K lit et met en pause, M coupe le son, C ouvre les crédits.",
    attribution:
      "Texte © 1994 Carl Sagan · Musique « Aurora » de Scott Buckley (CC BY 4.0) · Textures de la Terre par Solar System Scope (CC BY 4.0)",
    creditPrefix: "Crédit",
    ariaLanguage: "Langue des sous-titres : {language}. La changer.",
    ariaPlayNarration:
      "Écouter la narration : Carl Sagan lit Pale Blue Dot, 3 minutes 31 secondes",
    ariaPause: "Mettre la lecture en pause",
    ariaReplayReading: "Réécouter la lecture depuis le début",
    ariaResume: "Reprendre la lecture",
    errorBlocked: "Le navigateur a bloqué la lecture audio. Appuyez à nouveau sur lecture pour l’autoriser.",
    errorUnsupported: "Ce navigateur ne peut pas décoder le fichier de narration (MP3).",
    errorAborted: "La lecture a été interrompue avant de commencer. Appuyez à nouveau sur lecture.",
    errorFailed: "Échec de la lecture — {message}",
    errorUnknown: "La lecture a échoué pour une raison inconnue.",
    errorNarrationLoad: "Le fichier de narration n’a pas pu être chargé. Vérifiez la connexion et rechargez.",
    webglUnavailable: "WebGL indisponible · audio seul",
    musicUnavailable: "Piste musicale indisponible",
    creditsPanelTitle: "Crédits et attributions",
    endingEyebrow: "Fin de transmission",
    endingLine: "UN MESSAGE VENU D’UN\nPALE BLUE DOT.",
    archiveLabel: "SÉLECTION D’IMAGES D’ARCHIVE",
    archiveNote: "La NASA publie cette liste partielle, sans regroupements. Les regroupements sont les nôtres.",
    archiveLinkLabel: "VOIR SUR LE SITE DE LA NASA",
    creditNotPrinted: "CRÉDIT NON IMPRIMÉ",
    fullCredits: "CRÉDITS ET SOURCES COMPLETS",
    recordNotice: "Les titres des images du Golden Record et les références historiques proviennent des archives de la NASA. La NASA indique que ces images sont protégées par le droit d’auteur. Tout élément reproduit est présenté avec le crédit d’origine disponible, sans revendiquer de licence ni d’autorisation, sauf mention explicitement documentée.",
    creditNarration: "CRÉDITS / NARRATION",
    creditMusic: "CRÉDITS / MUSIQUE",
    creditVisual: "CRÉDITS / DOCUMENTS VISUELS",
    creditRecord: "CRÉDITS / LE GOLDEN RECORD",
    creditResearch: "CRÉDITS / RECHERCHE",
    creditSoftware: "RÉALISÉ AVEC",
    carterTranslationLabel: "Traduction",
    gateContinue: "Continuer sans traduction",
    roles: {
      narration: "Narration",
      music: "Musique",
      encore: "Audio de fin",
      textures: "Textures de la Terre",
      referencePhoto: "Image de référence",
      archivePlates: "Images d’archives",
    },
    carterTranslation: "Nous tentons de survivre à notre époque afin de vivre jusque dans la vôtre.",
  },
  "de": {
    credits: "Mitwirkende",
    mute: "Ton aus",
    unmute: "Ton an",
    replay: "Wiederholen",
    pause: "Pause",
    resume: "Fortsetzen",
    subtitles: "Untertitel",
    close: "Schließen",
    playNarration: "Lesung abspielen",
    headphones: "Für das beste Erlebnis werden Kopfhörer empfohlen.",
    loadingMaps: "Oberflächenkarten werden geladen",
    surfaceMaps: "Oberflächenkarten",
    pageDescription:
      "Eine interaktive Lesung von Carl Sagans „Pale Blue Dot“. Tastatur: Leertaste oder K startet und pausiert, M schaltet stumm, C öffnet die Nachweise.",
    attribution:
      "Text © 1994 Carl Sagan · Musik „Aurora“ von Scott Buckley (CC BY 4.0) · Erdtexturen von Solar System Scope (CC BY 4.0)",
    creditPrefix: "Nachweis",
    ariaLanguage: "Sprache der Untertitel: {language}. Ändern.",
    ariaPlayNarration:
      "Lesung abspielen: Carl Sagan liest Pale Blue Dot, 3 Minuten 31 Sekunden",
    ariaPause: "Lesung pausieren",
    ariaReplayReading: "Die Lesung von vorn abspielen",
    ariaResume: "Lesung fortsetzen",
    errorBlocked: "Der Browser hat die Audiowiedergabe blockiert. Drücken Sie noch einmal auf Abspielen, um sie zuzulassen.",
    errorUnsupported: "Dieser Browser kann die Datei der Lesung (MP3) nicht dekodieren.",
    errorAborted: "Die Wiedergabe wurde vor dem Start unterbrochen. Drücken Sie erneut auf Abspielen.",
    errorFailed: "Wiedergabe fehlgeschlagen — {message}",
    errorUnknown: "Die Wiedergabe ist aus unbekanntem Grund fehlgeschlagen.",
    errorNarrationLoad: "Die Datei der Lesung konnte nicht geladen werden. Prüfen Sie die Verbindung und laden Sie neu.",
    webglUnavailable: "WebGL nicht verfügbar · nur Ton",
    musicUnavailable: "Musikspur nicht verfügbar",
    creditsPanelTitle: "Mitwirkende & Nachweise",
    endingEyebrow: "Ende der Übertragung",
    endingLine: "EINE NACHRICHT VON\nEINEM PALE BLUE DOT.",
    archiveLabel: "BILDARCHIV — AUSWAHL",
    archiveNote: "Die NASA veröffentlicht dies als unvollständige Liste, ohne Gruppen. Die Gruppierung stammt von uns.",
    archiveLinkLabel: "BEI DER NASA ANSEHEN",
    creditNotPrinted: "KEIN NACHWEIS ABGEDRUCKT",
    fullCredits: "ALLE MITWIRKENDEN & QUELLEN",
    recordNotice: "Die Bildtitel und historischen Angaben zur Golden Record stammen aus dem Archiv der NASA. Die NASA weist darauf hin, dass diese Bilder urheberrechtlich geschützt sind. Reproduziertes Material wird mit dem verfügbaren Quellennachweis gezeigt, ohne Lizenz oder Genehmigung zu beanspruchen, sofern nicht ausdrücklich dokumentiert.",
    creditNarration: "NACHWEISE / LESUNG",
    creditMusic: "NACHWEISE / MUSIK",
    creditVisual: "NACHWEISE / BILDMATERIAL",
    creditRecord: "NACHWEISE / DIE GOLDEN RECORD",
    creditResearch: "NACHWEISE / RECHERCHE",
    creditSoftware: "ERSTELLT MIT",
    carterTranslationLabel: "Übersetzung",
    gateContinue: "Ohne Übersetzung fortfahren",
    roles: {
      narration: "Lesung",
      music: "Musik",
      encore: "Schlussaudio",
      textures: "Erdtexturen",
      referencePhoto: "Referenzbild",
      archivePlates: "Archivbilder",
    },
    carterTranslation: "Wir versuchen, unsere Zeit zu überleben, damit wir bis in eure hinein leben können.",
  },
  "pt-BR": {
    credits: "Créditos",
    mute: "Silenciar",
    unmute: "Ativar som",
    replay: "Repetir",
    pause: "Pausar",
    resume: "Retomar",
    subtitles: "Legendas",
    close: "Fechar",
    playNarration: "Ouvir a narração",
    headphones: "Recomendamos fones de ouvido para a melhor experiência.",
    loadingMaps: "Carregando mapas de superfície",
    surfaceMaps: "Mapas de superfície",
    pageDescription:
      "Uma leitura interativa de “Pale Blue Dot”, de Carl Sagan. Teclado: espaço ou K reproduz e pausa, M silencia, C abre os créditos.",
    attribution:
      "Texto © 1994 Carl Sagan · Música “Aurora” de Scott Buckley (CC BY 4.0) · Texturas da Terra por Solar System Scope (CC BY 4.0)",
    creditPrefix: "Crédito",
    ariaLanguage: "Idioma das legendas: {language}. Alterar.",
    ariaPlayNarration:
      "Ouvir a narração: Carl Sagan lê Pale Blue Dot, 3 minutos e 31 segundos",
    ariaPause: "Pausar a leitura",
    ariaReplayReading: "Ouvir a leitura novamente desde o início",
    ariaResume: "Retomar a leitura",
    errorBlocked: "O navegador bloqueou a reprodução de áudio. Toque em reproduzir mais uma vez para permitir.",
    errorUnsupported: "Este navegador não consegue decodificar o arquivo da narração (MP3).",
    errorAborted: "A reprodução foi interrompida antes de começar. Toque em reproduzir novamente.",
    errorFailed: "Falha na reprodução — {message}",
    errorUnknown: "A reprodução falhou por um motivo desconhecido.",
    errorNarrationLoad: "Não foi possível carregar o arquivo da narração. Verifique a conexão e recarregue.",
    webglUnavailable: "WebGL indisponível · somente áudio",
    musicUnavailable: "Faixa musical indisponível",
    creditsPanelTitle: "Créditos e atribuições",
    endingEyebrow: "Fim da transmissão",
    endingLine: "UMA MENSAGEM DO\nPALE BLUE DOT.",
    archiveLabel: "SELEÇÃO DO ARQUIVO DE IMAGENS",
    archiveNote: "A NASA publica isto como uma listagem parcial, sem agrupamentos. Os agrupamentos são nossos.",
    archiveLinkLabel: "VER NA NASA",
    creditNotPrinted: "SEM CRÉDITO IMPRESSO",
    fullCredits: "CRÉDITOS COMPLETOS E FONTES",
    recordNotice: "Os títulos das imagens do Golden Record e as referências históricas vêm do arquivo da NASA. A NASA declara que essas imagens são protegidas por direitos autorais. Todo material reproduzido é exibido com o crédito de origem disponível, sem reivindicar licença ou permissão salvo quando explicitamente documentado.",
    creditNarration: "CRÉDITOS / NARRAÇÃO",
    creditMusic: "CRÉDITOS / MÚSICA",
    creditVisual: "CRÉDITOS / MATERIAL VISUAL",
    creditRecord: "CRÉDITOS / O GOLDEN RECORD",
    creditResearch: "CRÉDITOS / PESQUISA",
    creditSoftware: "FEITO COM",
    carterTranslationLabel: "Tradução",
    gateContinue: "Continuar sem tradução",
    roles: {
      narration: "Narração",
      music: "Música",
      encore: "Áudio final",
      textures: "Texturas da Terra",
      referencePhoto: "Imagem de referência",
      archivePlates: "Imagens de arquivo",
    },
    carterTranslation: "Estamos tentando sobreviver ao nosso tempo para que possamos viver até o de vocês.",
  },
  "ja": {
    credits: "クレジット",
    mute: "消音",
    unmute: "消音解除",
    replay: "もう一度",
    pause: "一時停止",
    resume: "再開",
    subtitles: "字幕",
    close: "閉じる",
    playNarration: "ナレーションを再生",
    headphones: "ヘッドフォンでの再生をおすすめします。",
    loadingMaps: "表面マップを読み込み中",
    surfaceMaps: "表面マップ",
    pageDescription:
      "Carl Saganの「Pale Blue Dot」のインタラクティブな朗読。キーボード：スペースまたはKで再生と一時停止、Mで消音、Cでクレジットを開く。",
    attribution:
      "テキスト © 1994 Carl Sagan · 音楽「Aurora」Scott Buckley（CC BY 4.0）· 地球のテクスチャ Solar System Scope（CC BY 4.0）",
    creditPrefix: "クレジット",
    ariaLanguage: "字幕の言語：{language}。変更する。",
    ariaPlayNarration:
      "ナレーションを再生：Carl SaganによるPale Blue Dotの朗読、3分31秒",
    ariaPause: "朗読を一時停止",
    ariaReplayReading: "朗読を最初から再生",
    ariaResume: "朗読を再開",
    errorBlocked: "ブラウザが音声の再生をブロックした。もう一度再生を押すと許可される。",
    errorUnsupported: "このブラウザはナレーションのファイル（MP3）をデコードできない。",
    errorAborted: "再生が始まる前に中断された。もう一度再生を押してほしい。",
    errorFailed: "再生に失敗した — {message}",
    errorUnknown: "原因不明で再生に失敗した。",
    errorNarrationLoad: "ナレーションのファイルを読み込めなかった。接続を確認して再読み込みしてほしい。",
    webglUnavailable: "WebGLを利用できない · 音声のみ",
    musicUnavailable: "音楽トラックを利用できない",
    creditsPanelTitle: "クレジットと出典",
    endingEyebrow: "通信終了",
    endingLine: "Pale Blue Dotから\n届いたメッセージ。",
    archiveLabel: "画像アーカイブ抜粋",
    archiveNote: "NASAはこれを、グループ分けのない部分的な一覧として公開している。分類は私たちによるものだ。",
    archiveLinkLabel: "NASAで見る",
    creditNotPrinted: "クレジット記載なし",
    fullCredits: "全クレジットと出典",
    recordNotice: "Golden Recordの画像タイトルと歴史的な記述は、NASAのアーカイブによる。NASAはこれらの画像が著作権で保護されていると明記している。転載した素材には入手できる出典クレジットを添えており、明示的に文書化されている場合を除き、ライセンスや許諾を主張するものではない。",
    creditNarration: "クレジット / ナレーション",
    creditMusic: "クレジット / 音楽",
    creditVisual: "クレジット / 視覚素材",
    creditRecord: "クレジット / Golden Record",
    creditResearch: "クレジット / 調査",
    creditSoftware: "使用技術",
    carterTranslationLabel: "翻訳",
    gateContinue: "翻訳なしで進む",
    roles: {
      narration: "ナレーション",
      music: "音楽",
      encore: "エンディング音源",
      textures: "地球のテクスチャ",
      referencePhoto: "参照画像",
      archivePlates: "アーカイブ画像",
    },
    carterTranslation: "私たちは、あなたがたの時代へと生きつづけるために、自分たちの時代を生きのびようとしている。",
  },
  "zh-CN": {
    credits: "制作名单",
    mute: "静音",
    unmute: "取消静音",
    replay: "重播",
    pause: "暂停",
    resume: "继续",
    subtitles: "字幕",
    close: "关闭",
    playNarration: "播放朗读",
    headphones: "建议佩戴耳机以获得最佳体验。",
    loadingMaps: "正在加载地表贴图",
    surfaceMaps: "地表贴图",
    pageDescription: "对 Carl Sagan《Pale Blue Dot》的交互式朗读。键盘：空格键或 K 键播放与暂停，M 键静音，C 键打开制作名单。",
    attribution: "文字 © 1994 Carl Sagan · 音乐《Aurora》Scott Buckley（CC BY 4.0）· 地球贴图 Solar System Scope（CC BY 4.0）",
    creditPrefix: "图片来源",
    ariaLanguage: "字幕语言：{language}。更改。",
    ariaPlayNarration: "播放朗读：Carl Sagan 朗读 Pale Blue Dot，3分31秒",
    ariaPause: "暂停朗读",
    ariaReplayReading: "从头重新播放朗读",
    ariaResume: "继续朗读",
    errorBlocked: "浏览器阻止了音频播放。再按一次播放即可允许。",
    errorUnsupported: "此浏览器无法解码朗读的音频文件（MP3）。",
    errorAborted: "播放尚未开始就被中断。再按一次播放。",
    errorFailed: "播放失败——{message}",
    errorUnknown: "播放失败，原因不明。",
    errorNarrationLoad: "朗读文件无法加载。检查网络连接后重新载入。",
    webglUnavailable: "WebGL 不可用 · 仅有音频",
    musicUnavailable: "音乐轨道不可用",
    creditsPanelTitle: "制作名单与出处",
    endingEyebrow: "传输结束",
    endingLine: "一则讯息\n来自 Pale Blue Dot。",
    archiveLabel: "图像档案选辑",
    archiveNote: "NASA 公布的是一份不完整的清单，并未分组。这里的分组出自我们。",
    archiveLinkLabel: "在 NASA 查看",
    creditNotPrinted: "来源未标注",
    fullCredits: "完整制作名单与出处",
    recordNotice: "Golden Record 的图像标题与历史资料出自 NASA 的档案。NASA 声明这些图像受著作权保护。凡经转载的材料，均附上可获得的来源署名；除非另有明确记录，本站不主张任何授权或许可。",
    creditNarration: "制作名单 / 朗读",
    creditMusic: "制作名单 / 音乐",
    creditVisual: "制作名单 / 视觉素材",
    creditRecord: "制作名单 / Golden Record",
    creditResearch: "制作名单 / 资料研究",
    creditSoftware: "技术构成",
    carterTranslationLabel: "翻译",
    gateContinue: "不使用翻译，直接进入",
    roles: {
      narration: "朗读",
      music: "音乐",
      encore: "片尾音频",
      textures: "地球贴图",
      referencePhoto: "参考图像",
      archivePlates: "档案图像",
    },
    carterTranslation: "我们正努力熬过我们的时代，以求能活到你们的时代。",
  },
  "ko": {
    credits: "크레딧",
    mute: "음소거",
    unmute: "음소거 해제",
    replay: "다시 재생",
    pause: "일시정지",
    resume: "이어 재생",
    subtitles: "자막",
    close: "닫기",
    playNarration: "낭독 재생",
    headphones: "헤드폰으로 들으면 가장 좋습니다.",
    loadingMaps: "표면 맵 불러오는 중",
    surfaceMaps: "표면 맵",
    pageDescription: "Carl Sagan의 “Pale Blue Dot” 인터랙티브 낭독. 키보드: 스페이스바 또는 K로 재생과 일시정지, M으로 음소거, C로 크레딧 열기.",
    attribution: "글 © 1994 Carl Sagan · 음악 “Aurora” Scott Buckley (CC BY 4.0) · 지구 텍스처 Solar System Scope (CC BY 4.0)",
    creditPrefix: "크레딧",
    ariaLanguage: "자막 언어: {language}. 바꾸기.",
    ariaPlayNarration: "낭독 재생: Carl Sagan이 읽는 Pale Blue Dot, 3분 31초",
    ariaPause: "낭독 일시정지",
    ariaReplayReading: "낭독을 처음부터 다시 재생",
    ariaResume: "낭독 이어 재생",
    errorBlocked: "브라우저가 오디오 재생을 차단했다. 한 번 더 누르면 재생이 허용된다.",
    errorUnsupported: "이 브라우저는 낭독 파일(MP3)을 디코딩하지 못한다.",
    errorAborted: "재생이 시작되기 전에 중단되었다. 재생을 다시 누르면 된다.",
    errorFailed: "재생에 실패했다 — {message}",
    errorUnknown: "알 수 없는 이유로 재생에 실패했다.",
    errorNarrationLoad: "낭독 파일을 불러오지 못했다. 연결을 확인하고 다시 불러오면 된다.",
    webglUnavailable: "WebGL 사용 불가 · 오디오만",
    musicUnavailable: "음악 트랙 사용 불가",
    creditsPanelTitle: "크레딧과 출처",
    endingEyebrow: "송신 종료",
    endingLine: "Pale Blue Dot에서\n보내온 메시지.",
    archiveLabel: "이미지 아카이브 발췌",
    archiveNote: "NASA는 이를 분류 없는 부분 목록으로 공개한다. 분류는 우리가 한 것이다.",
    archiveLinkLabel: "NASA에서 보기",
    creditNotPrinted: "크레딧 표기 없음",
    fullCredits: "전체 크레딧과 출처",
    recordNotice: "Golden Record의 이미지 제목과 역사적 서술은 NASA의 아카이브에서 가져왔다. NASA는 이 이미지들이 저작권으로 보호된다고 밝히고 있다. 재수록한 자료에는 확인 가능한 출처 크레딧을 함께 표시하며, 명시적으로 문서화된 경우가 아니면 라이선스나 허가를 주장하지 않는다.",
    creditNarration: "크레딧 / 낭독",
    creditMusic: "크레딧 / 음악",
    creditVisual: "크레딧 / 시각 자료",
    creditRecord: "크레딧 / Golden Record",
    creditResearch: "크레딧 / 자료 조사",
    creditSoftware: "사용 기술",
    carterTranslationLabel: "번역",
    gateContinue: "번역 없이 계속",
    roles: {
      narration: "낭독",
      music: "음악",
      encore: "엔딩 오디오",
      textures: "지구 텍스처",
      referencePhoto: "참조 이미지",
      archivePlates: "아카이브 이미지",
    },
    carterTranslation: "우리는 당신들의 시대까지 살아가기 위해, 우리 시대를 견뎌 내려 하고 있다.",
  },
};

/** The strings for a locale. English is the fallback, never a throw. */
export function strings(locale: LocaleCode): UiStrings {
  return uiStrings[locale] ?? uiStrings.en;
}
