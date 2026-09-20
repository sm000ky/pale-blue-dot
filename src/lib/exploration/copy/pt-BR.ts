/**
 * Brazilian Portuguese — the exploration copy.
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
  "Um campo pálido de azul e cinza cortado por uma faixa diagonal de luz solar espalhada. Dentro da faixa, um pouco à direita do centro, um único ponto branco: a Terra.";

const PORTRAIT_ALT =
  "Sessenta quadros da câmera de ângulo estreito dispostos como um mosaico curvo sobre o preto, com seis destaques rotulados Jupiter, Earth, Venus, Saturn, Uranus e Neptune. Em cada destaque o planeta é apenas um ponto de luz.";

const VOYAGER_ALT =
  "Uma representação artística de uma sonda Voyager sobre um campo de estrelas negro: uma antena parabólica branca voltada para longe, a lança de instrumentos e os geradores de radioisótopos apoiados em treliças de um lado, e duas antenas longas saindo do quadro.";

const DISC_ALT =
  "O disco em si: um disco de ouro brilhante como espelho, com o rótulo gravado “The Sounds of Earth”, “United States of America, Planet Earth”.";

const COVER_ALT =
  "A capa gravada do Golden Record, fotografada sobre o preto. Quatro grupos de diagramas estão entalhados na superfície dourada: o disco e sua agulha no alto à esquerda, um esquema para decodificar as imagens no alto à direita, um mapa de pulsares irradiante embaixo à esquerda, dois átomos de hidrogênio embaixo à direita.";

export const ptBR: Record<string, BeatCopy> = {
  "photo-intro": {
    heading: "THE PALE\nBLUE DOT",
    body: "Em 14 de fevereiro de 1990, a Voyager 1 voltou o olhar para o mundo que havia deixado para trás.",
  },
  "photo-distance": {
    body: "A cerca de seis bilhões de quilômetros do Sol, a Terra se tornou apenas um ponto de luz.",
    note: "Medida a partir do Sol. As legendas do arquivo da NASA também trazem uma distância oblíqua de mais de quatro bilhões de milhas em relação à Terra — a mesma fotografia, contada a partir de outro ponto.",
  },
  "photo-pixel": {
    body: "Na câmera de ângulo estreito da Voyager, a Terra media apenas cerca de 0,12 pixel de largura.",
    note: "Câmera de ângulo estreito, 1500 mm. Páginas mais recentes da NASA arredondam o valor para cerca de um pixel.",
  },
  "photo-plate": {
    mediaAlt: PLATE_ALT,
    note: "Os dados de 1990, reprocessados pela NASA/JPL em 2020.",
  },
  "lastlook-frames": {
    body: "Pale Blue Dot não foi uma fotografia isolada.\n\nFazia parte da última sequência, a que formou um retrato do Sistema Solar.",
  },
  "lastlook-worlds": {
    heading: "Vênus\nTerra\nJúpiter\nSaturno\nUrano\nNetuno",
    body: "Seis planetas, reduzidos a pontos de luz.",
  },
  "lastlook-plate": {
    mediaAlt: PORTRAIT_ALT,
  },
  "lastlook-cameras": {
    body: "Depois dessa sequência, as câmeras da Voyager 1 foram desligadas.\n\nA viagem continuou. As câmeras, não.",
  },
  "voyager-intro": {
    heading: "A MÁQUINA\nQUE SEGUIU EM FRENTE",
  },
  "voyager-1977": {
    mediaAlt: VOYAGER_ALT,
    body: "A Voyager 1 deixou a Terra rumo aos planetas exteriores.",
  },
  "voyager-1979": {
    mediaAlt: VOYAGER_ALT,
    body: "Menos de dois anos depois, passou por Júpiter.",
  },
  "voyager-1980": {
    mediaAlt: VOYAGER_ALT,
    body: "Depois de Saturno, sua trajetória a levou para longe do Sol.",
  },
  "voyager-2012": {
    mediaAlt: VOYAGER_ALT,
    body: "Trinta e cinco anos depois do lançamento, a Voyager 1 entrou no espaço interestelar.",
  },
  "message-intro": {
    heading: "A VOYAGER\nLEVA OUTRA COISA",
    body: "A Voyager não levava apenas instrumentos científicos.\n\nFixado à sua lateral está um disco sobre a Terra.",
  },
  "message-disc": {
    mediaAlt: DISC_ALT,
  },
  "message-object": {
    body: "Um disco de cobre banhado a ouro, com trinta centímetros de diâmetro.",
  },
  "sent-intro": {
    heading: "SE VOCÊ TIVESSE\nUM ÚNICO DISCO",
    body: "Se um único objeto tivesse que levar uma impressão da Terra, o que colocaríamos dentro dele?",
  },
  "sent-images": {
    heading: "Corpos.\nComida.\nConstruções.\nCiência.\nNatureza.\nFamílias.\nO próprio planeta.",
    body: "115 imagens, codificadas em forma analógica.",
  },
  "sent-languages": {
    body: "Cinquenta e cinco idiomas trazem saudações a quem quer que esteja ouvindo.",
  },
  "sent-sounds": {
    heading: "Ondas.\nVento.\nTrovão.\nPássaros.\nBaleias.\nVida humana.",
  },
  "sent-music": {
    body: "Cerca de noventa minutos de música, selecionada entre diferentes culturas e épocas.",
  },
  "instructions-intro": {
    heading: "NENHUMA LÍNGUA\nEM COMUM",
    body: "O disco supõe que seu destinatário não entenda nenhuma língua humana.\n\nSuas instruções estão escritas em física.",
  },
  "cover-rotation": {
    mediaAlt: COVER_ALT,
    body: "O primeiro diagrama explica como o disco deve girar e quanto dura uma rotação.",
  },
  "cover-lines": {
    mediaAlt: COVER_ALT,
    body: "Outro diagrama explica como o sinal gravado pode ser reconstruído em uma imagem.",
  },
  "cover-pulsars": {
    mediaAlt: COVER_ALT,
    body: "Um mapa de pulsares aponta para o Sistema Solar.\n\nNão o nome da nossa casa. Suas coordenadas.",
  },
  "cover-hydrogen": {
    mediaAlt: COVER_ALT,
    body: "Uma transição do átomo de hidrogênio fornece a unidade de tempo usada nos diagramas.",
  },
  "travel-address": {
    body: "O Golden Record não foi enviado a nenhum endereço específico.\n\nEle simplesmente viaja com a Voyager.",
  },
  "travel-40000": {
    body: "A NASA observa que cerca de quarenta mil anos vão se passar até que a Voyager se aproxime de outro sistema planetário.",
  },
  "end-reflection": {
    body: "Fotografamos nossa casa de longe.",
  },
  "end-carried": {
    body: "Depois levamos uma pequena parte dela ainda mais longe.",
  },
  "ack-intro": {
    body: "Este trabalho se apoia no trabalho de cientistas, engenheiros, artistas, músicos, fotógrafos, arquivistas e contadores de histórias que nos ajudaram a ver a Terra de longe.\n\nO que eles criaram e preservaram permite que as gerações depois de nós herdem não apenas um registro de onde viemos — mas também um registro de como um dia nos enxergamos.",
  },
  "end-dedication": {
    body: "Para aqueles que olharam mais longe, registraram com cuidado e preservaram o que encontraram —\n\npara que alguém ainda por nascer possa vê-lo.",
  },
  "end-quote": {
    heading: "“We are attempting to survive our time\nso we may live into yours.”",
    note: "Jimmy Carter · Mensagem colocada a bordo do Voyager Golden Record · 1977",
  },
};
