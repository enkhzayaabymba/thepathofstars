import en from "./translations/en";
import mn from "./translations/mn";

export type Lang = "en" | "mn";
export type Translations = typeof en;

export function getT(lang: Lang): Translations {
  return lang === "mn" ? mn : en;
}
