/**
 * French — the exploration copy.
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
  "Un champ pâle de bleu et de gris traversé par une bande diagonale de lumière solaire diffusée. Dans cette bande, un peu à droite du centre, un unique point blanc : la Terre.";

const PORTRAIT_ALT =
  "Soixante vues de la caméra à champ étroit disposées en mosaïque incurvée sur fond noir, avec six encarts légendés Jupiter, Earth, Venus, Saturn, Uranus et Neptune. Dans chaque encart, la planète n’est qu’un point lumineux.";

const VOYAGER_ALT =
  "Une vue d’artiste d’une sonde Voyager sur un fond d’étoiles noir : une antenne parabolique blanche tournée de dos, le mât d’instruments et les générateurs à radioisotopes portés par des poutrelles d’un côté, et deux longues antennes qui sortent du cadre.";

const DISC_ALT =
  "Le disque lui-même : un disque d’or brillant comme un miroir, son étiquette gravée « The Sounds of Earth », « United States of America, Planet Earth ».";

const COVER_ALT =
  "La pochette gravée du Golden Record, photographiée sur fond noir. Quatre groupes de schémas sont incisés dans la surface dorée : le disque et son stylet en haut à gauche, une méthode de décodage des images en haut à droite, une carte de pulsars rayonnante en bas à gauche, deux atomes d’hydrogène en bas à droite.";

export const fr: Record<string, BeatCopy> = {
  "photo-intro": {
    heading: "THE PALE\nBLUE DOT",
    body: "Le 14 février 1990, Voyager 1 s’est retournée vers le monde qu’elle laissait derrière elle.",
  },
  "photo-distance": {
    body: "Depuis environ six milliards de kilomètres du Soleil, la Terre n’était plus qu’un point lumineux.",
    note: "Mesuré depuis le Soleil. Les légendes d’archive de la NASA donnent aussi une distance oblique depuis la Terre de plus de quatre milliards de miles — la même photographie, comptée depuis un autre point.",
  },
  "photo-pixel": {
    body: "Dans la caméra à angle étroit de Voyager, la Terre ne mesurait qu’environ 0,12 pixel.",
    note: "Caméra à angle étroit, 1500 mm. Des pages plus récentes de la NASA arrondissent le chiffre à environ un pixel.",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note: "Les données de 1990, retraitées par la NASA/JPL en 2020.",
  },
  "lastlook-frames": {
    body: "Pale Blue Dot n’était pas une photographie isolée.\n\nElle faisait partie de la dernière séquence, celle qui composait un portrait du Système solaire.",
  },
  "lastlook-worlds": {
    heading: "Vénus\nTerre\nJupiter\nSaturne\nUranus\nNeptune",
    body: "Six planètes, réduites à des points lumineux.",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body: "Après cette séquence, les caméras de Voyager 1 ont été éteintes.\n\nSon voyage a continué. Ses caméras, non.",
  },
  "voyager-intro": {
    heading: "LA MACHINE\nQUI A CONTINUÉ SA ROUTE",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body: "Voyager 1 a quitté la Terre en direction des planètes extérieures.",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body: "Moins de deux ans plus tard, elle est passée près de Jupiter.",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body: "Après Saturne, sa trajectoire l’a emportée vers l’extérieur.",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body: "Trente-cinq ans après son lancement, Voyager 1 est entrée dans l’espace interstellaire.",
  },
  "message-intro": {
    heading: "VOYAGER\nEMPORTE AUTRE CHOSE",
    body: "Voyager n’emportait pas seulement des instruments scientifiques.\n\nSur son flanc est fixé un disque qui parle de la Terre.",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body: "Un disque de cuivre plaqué or, de trente centimètres de diamètre.",
  },
  "sent-intro": {
    heading: "SI VOUS N’AVIEZ\nQU’UN DISQUE",
    body: "Si un seul objet devait transmettre une impression de la Terre, qu’y mettrions-nous ?",
  },
  "sent-images": {
    heading: "Corps humains.\nNourriture.\nBâtiments.\nScience.\nNature.\nFamilles.\nLa planète elle-même.",
    body: "115 images, encodées sous forme analogique.",
  },
  "sent-languages": {
    body: "Cinquante-cinq langues adressent un salut à quiconque pourrait les entendre.",
  },
  "sent-sounds": {
    heading: "Ressac.\nVent.\nTonnerre.\nOiseaux.\nBaleines.\nVie humaine.",
  },
  "sent-music": {
    body: "Environ quatre-vingt-dix minutes de musique, choisie à travers les cultures et les époques.",
  },
  "instructions-intro": {
    heading: "AUCUNE LANGUE\nCOMMUNE",
    body: "Le disque suppose que son destinataire ne comprend aucune langue humaine.\n\nSes instructions sont écrites en physique.",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body: "Le premier schéma explique comment le disque doit tourner et la durée d’une rotation.",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body: "Un autre schéma explique comment reconstituer une image à partir du signal enregistré.",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body: "Une carte de pulsars indique la direction du Système solaire.\n\nPas le nom de notre foyer. Ses coordonnées.",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body: "Une transition de l’atome d’hydrogène fournit l’unité de temps utilisée dans tous les schémas.",
  },
  "travel-address": {
    body: "Le Golden Record n’a été envoyé à aucune adresse précise.\n\nIl voyage simplement avec Voyager.",
  },
  "travel-40000": {
    body: "La NASA note qu’environ quarante mille ans s’écouleront avant que Voyager ne s’approche d’un autre système planétaire.",
  },
  "end-reflection": {
    body: "Nous avons photographié notre foyer de très loin.",
  },
  "end-carried": {
    body: "Puis nous en avons emporté une petite part plus loin encore.",
  },
  "ack-intro": {
    body: "Ce travail repose sur celui des scientifiques, ingénieurs, artistes, musiciens, photographes, archivistes et conteurs qui nous ont aidés à voir la Terre de loin.\n\nCe qu’ils ont créé et préservé permet aux générations qui viendront après nous d’hériter non seulement d’une trace de nos origines — mais aussi d’une trace de la manière dont nous nous voyions autrefois.",
  },
  "end-dedication": {
    body: "À ceux qui ont regardé plus loin, consigné avec soin et préservé ce qu’ils avaient trouvé —\n\npour que quelqu’un qui n’est pas encore né puisse encore le voir.",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Message embarqué à bord du Voyager Golden Record · 1977",
  },
};
