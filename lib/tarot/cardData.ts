export type Element = "Гал" | "Ус" | "Агаар" | "Газар";

export type CardMeta = {
  name: string;
  planet: string;
  element: Element;
  number: number;
  imageUrl: string;
};

type Raw = [string, string, Element, number];

const BASE = "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function cardUrl(index: number): string {
  if (index <= 21) return `${BASE}m${pad(index)}.jpg`;
  if (index <= 35) return `${BASE}w${pad(index - 21)}.jpg`;
  if (index <= 49) return `${BASE}c${pad(index - 35)}.jpg`;
  if (index <= 63) return `${BASE}s${pad(index - 49)}.jpg`;
  return `${BASE}p${pad(index - 63)}.jpg`;
}

const raw: Raw[] = [
  // --- Major Arcana ---
  ["The Fool", "Уран", "Агаар", 0],
  ["The Magician", "Меркур", "Агаар", 1],
  ["The High Priestess", "Сар", "Ус", 2],
  ["The Empress", "Венус", "Газар", 3],
  ["The Emperor", "Марс", "Гал", 4],
  ["The Hierophant", "Венус", "Газар", 5],
  ["The Lovers", "Меркур", "Агаар", 6],
  ["The Chariot", "Сар", "Ус", 7],
  ["Strength", "Нар", "Гал", 8],
  ["The Hermit", "Меркур", "Газар", 9],
  ["Wheel of Fortune", "Юпитер", "Гал", 10],
  ["Justice", "Венус", "Агаар", 11],
  ["The Hanged Man", "Нептун", "Ус", 12],
  ["Death", "Плутон", "Ус", 13],
  ["Temperance", "Юпитер", "Гал", 14],
  ["The Devil", "Сатурн", "Газар", 15],
  ["The Tower", "Марс", "Гал", 16],
  ["The Star", "Уран", "Агаар", 17],
  ["The Moon", "Нептун", "Ус", 18],
  ["The Sun", "Нар", "Гал", 19],
  ["Judgement", "Плутон", "Гал", 20],
  ["The World", "Сатурн", "Газар", 21],
  // --- Wands · Гал ---
  ["Ace of Wands", "Нар", "Гал", 1],
  ["Two of Wands", "Марс", "Гал", 2],
  ["Three of Wands", "Нар", "Гал", 3],
  ["Four of Wands", "Венус", "Гал", 4],
  ["Five of Wands", "Сатурн", "Гал", 5],
  ["Six of Wands", "Юпитер", "Гал", 6],
  ["Seven of Wands", "Марс", "Гал", 7],
  ["Eight of Wands", "Меркур", "Гал", 8],
  ["Nine of Wands", "Сар", "Гал", 9],
  ["Ten of Wands", "Сатурн", "Гал", 10],
  ["Page of Wands", "Меркур", "Гал", 11],
  ["Knight of Wands", "Марс", "Гал", 12],
  ["Queen of Wands", "Нар", "Гал", 13],
  ["King of Wands", "Уран", "Гал", 14],
  // --- Cups · Ус ---
  ["Ace of Cups", "Нептун", "Ус", 1],
  ["Two of Cups", "Венус", "Ус", 2],
  ["Three of Cups", "Меркур", "Ус", 3],
  ["Four of Cups", "Сар", "Ус", 4],
  ["Five of Cups", "Марс", "Ус", 5],
  ["Six of Cups", "Нар", "Ус", 6],
  ["Seven of Cups", "Венус", "Ус", 7],
  ["Eight of Cups", "Сатурн", "Ус", 8],
  ["Nine of Cups", "Юпитер", "Ус", 9],
  ["Ten of Cups", "Марс", "Ус", 10],
  ["Page of Cups", "Венус", "Ус", 11],
  ["Knight of Cups", "Нептун", "Ус", 12],
  ["Queen of Cups", "Сар", "Ус", 13],
  ["King of Cups", "Нептун", "Ус", 14],
  // --- Swords · Агаар ---
  ["Ace of Swords", "Уран", "Агаар", 1],
  ["Two of Swords", "Сар", "Агаар", 2],
  ["Three of Swords", "Сатурн", "Агаар", 3],
  ["Four of Swords", "Юпитер", "Агаар", 4],
  ["Five of Swords", "Венус", "Агаар", 5],
  ["Six of Swords", "Меркур", "Агаар", 6],
  ["Seven of Swords", "Сар", "Агаар", 7],
  ["Eight of Swords", "Юпитер", "Агаар", 8],
  ["Nine of Swords", "Марс", "Агаар", 9],
  ["Ten of Swords", "Нар", "Агаар", 10],
  ["Page of Swords", "Венус", "Агаар", 11],
  ["Knight of Swords", "Уран", "Агаар", 12],
  ["Queen of Swords", "Сатурн", "Агаар", 13],
  ["King of Swords", "Юпитер", "Агаар", 14],
  // --- Pentacles · Газар ---
  ["Ace of Pentacles", "Венус", "Газар", 1],
  ["Two of Pentacles", "Юпитер", "Газар", 2],
  ["Three of Pentacles", "Марс", "Газар", 3],
  ["Four of Pentacles", "Нар", "Газар", 4],
  ["Five of Pentacles", "Меркур", "Газар", 5],
  ["Six of Pentacles", "Сар", "Газар", 6],
  ["Seven of Pentacles", "Сатурн", "Газар", 7],
  ["Eight of Pentacles", "Нар", "Газар", 8],
  ["Nine of Pentacles", "Венус", "Газар", 9],
  ["Ten of Pentacles", "Меркур", "Газар", 10],
  ["Page of Pentacles", "Меркур", "Газар", 11],
  ["Knight of Pentacles", "Нар", "Газар", 12],
  ["Queen of Pentacles", "Сар", "Газар", 13],
  ["King of Pentacles", "Уран", "Газар", 14],
];

export const CARD_METADATA: CardMeta[] = raw.map(
  ([name, planet, element, number], index) => ({
    name,
    planet,
    element,
    number,
    imageUrl: cardUrl(index),
  })
);
