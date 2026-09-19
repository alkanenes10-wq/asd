"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { DEFAULT_LANG, type Lang, type L, pick } from "@/lib/i18n/config";
import { ui, type UIDict } from "@/lib/i18n/dict";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Shared UI dictionary for the active language. */
  ui: UIDict;
  /** Resolve a translatable { tr, en } value to the active language. */
  t: (value: L) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

/**
 * seansapp tek dilli (Türkçe) yayınlanır: dil kalıcı olarak DEFAULT_LANG'e
 * sabitlenmiştir ve localStorage'dan geri yüklenmez. Altyapı yerinde duruyor —
 * ileride EN sürüm gerekirse toggle'ı geri takmak yeterli.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "tr" ? "en" : "tr"),
    [lang, setLang],
  );

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      ui: ui[lang],
      t: (v: L) => pick(v, lang),
    }),
    [lang, setLang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
