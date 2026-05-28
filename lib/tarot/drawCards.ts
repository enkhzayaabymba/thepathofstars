import { CARD_METADATA, CardMeta } from "./cardData";

export type DrawnCard = CardMeta & { reversed: boolean };

export function drawCards(count: number): DrawnCard[] {
  const shuffled = [...CARD_METADATA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({
    ...card,
    reversed: Math.random() < 0.3,
  }));
}

export function reduceNumber(n: number): number {
  if (n === 0) return 0;
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

export function dominantElement(cards: DrawnCard[]): string {
  const count: Record<string, number> = {};
  for (const card of cards) {
    count[card.element] = (count[card.element] || 0) + 1;
  }
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

export function numerologySum(cards: DrawnCard[]): number {
  const total = cards.reduce((sum, c) => sum + c.number, 0);
  return reduceNumber(total);
}
