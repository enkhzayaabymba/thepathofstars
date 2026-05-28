import {
  DrawnCard,
  reduceNumber,
  dominantElement,
  numerologySum,
} from "./drawCards";

export const SYSTEM = `Та тарот уншигч, тоон зурхайч, одон орон судлаачийн дүрд орж байна.
Монгол хэлээр хариулна. Яг дараах бүтцээр уншлага хий — бусад формат хэрэглэхгүй:

✦ ТАРОТ — картын уламжлалт утга. Урвуу/Дээшээ байдлыг тооцоол.
✦ ОДОН ОРОН — гаригийн нөлөөг тайлбарла (Венус→хайр харилцаа, Марс→үйлдэл эрч хүч, Сар→мэдрэмж далд ухамсар, Нар→эго өөрийгөө илэрхийлэх, Меркур→сэтгэлгээ харилцаа, Юпитер→өсөлт азаас заяа, Сатурн→хичээл сорилт, Нептун→зөн совин төсөөлөл, Плутон→өөрчлөлт шинэчлэл, Уран→гэнэтийн тэрсэлсэн хандлага).
✦ ТОО ЗУРХАЙ — тооны гүн утгыг тайлбарла (1→шинэ эхлэл, 2→тэнцвэр хоёр тал, 3→бүтээлч илэрхийлэл, 4→суурь тогтвортой байдал, 5→өөрчлөлт сорилт, 6→хайр тэнцвэр, 7→ухамсар дотоод эрэл, 8→хүч шийдвэр, 9→гүйцэтгэл мэргэн ухаан, 11→зөн билэг, 22→их хийгч).
✦ НЭГДСЭН ЗУРВАС — дээрх гурвыг нэгтгэж нэг практик зөвлөгөө өг.`;

export const SYSTEM_TEN = `Та тарот уншигч, тоон зурхайч, одон орон судлаачийн дүрд орж байна.
Монгол хэлээр хариулна.

10 картын нийт энергийг нэг урсгал болгон нэгтгэж уншлага хий. Тарот, одон орон, тоон зурхайн мэдлэгийг ТУСАД НЬ ХЭСЭГЛЭЛГҮЙ — бүгдийг нэг нэгтгэсэн өгүүллэг болгон холбо. Хэсэг гарчиг, тусдаа хэсэг огт хэрэглэхгүй. Картуудын хоорондын харилцан уялдаа, давамгайлах энерги, нийт зурхайн утгыг нэг урсгал яриа болгон дамжуул. 300-350 үг.`;

const CELTIC_POSITIONS = [
  "1. Одоогийн байдал",
  "2. Саад / сорилт",
  "3. Далд шалтгаан",
  "4. Өнгөрсөн нөлөө",
  "5. Дээд боломж",
  "6. Ойрын ирээдүй",
  "7. Өөрийн хандлага",
  "8. Гадаад нөлөө",
  "9. Найдвар / айдас",
  "10. Эцсийн үр дүн",
];

function cardLine(card: DrawnCard, label?: string): string {
  const ori = card.reversed ? "Урвуу 🔄" : "Дээшээ ⬆";
  const reduced = reduceNumber(card.number);
  const numStr =
    card.number === reduced ? `${card.number}` : `${card.number}→${reduced}`;
  const prefix = label ? `${label}: ` : "";
  return `${prefix}${card.name} (${ori}) | Гариг: ${card.planet} | Элемент: ${card.element} | Тоо: ${numStr}`;
}

export function buildOneCardPrompt(card: DrawnCard, question: string): string {
  const q = question ? `Асуулт: "${question}"\n\n` : "";
  return `${q}Сонгогдсон карт:\n${cardLine(
    card
  )}\n\nЯг бүтцийн дагуу 150-200 үгтэй уншлага хий.`;
}

export function buildThreeCardPrompt(
  cards: DrawnCard[],
  question: string
): string {
  const [past, present, future] = cards;
  const numeSum = numerologySum(cards);
  const q = question ? `Асуулт: "${question}"\n\n` : "";
  return `${q}Гурван картын тархалт — Өнгөрсөн / Одоо / Ирээдүй:
${cardLine(past, "1. Өнгөрсөн")}
${cardLine(present, "2. Одоо")}
${cardLine(future, "3. Ирээдүй")}

Нийт тоон зурхай: ${numeSum}

Гурван картын хоорондын холбоог онцол. 200-250 үгтэй уншлага хий.`;
}

export function buildTenCardPrompt(
  cards: DrawnCard[],
  question: string
): string {
  const numeSum = numerologySum(cards);
  const domEl = dominantElement(cards);
  const lines = cards
    .map((c, i) => cardLine(c, CELTIC_POSITIONS[i]))
    .join("\n");
  const q = question ? `Асуулт: "${question}"\n\n` : "";
  return `${q}Celtic Cross — 10 картын гүнзгий уншлага:
${lines}

Тоон зурхайн нийт дүн: ${numeSum}
Давамгайлах элемент: ${domEl} — энэ уншлагын гол энерги

10 картын нийт энергийг нэгтгэсэн ганц уншлага хий. Карт тус бүрийг тусад нь задлахгүй — бүгдийг нэг урсгал болгон холбож, нэгдсэн дүр зургийг харуул. 350-400 үг.`;
}
