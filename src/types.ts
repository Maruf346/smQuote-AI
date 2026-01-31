export enum AuthorCategory {
  Rabindranath = 'রবীন্দ্রনাথ ঠাকুর',
  KaziNazrul = 'কাজী নজরুল ইসলাম',
  HumayunAhmed = 'হুমায়ূন আহমেদ',
  JibananandaDas = 'জীবনানন্দ দাশ',
  SaratChandra = 'শরৎচন্দ্র চট্টোপাধ্যায়',
  TaslimaNasrin = 'তসলিমা নাসরিন',
  BuddhadebBasu = 'বুদ্ধদেব বসু',
  ModernBangla = 'আধুনিক বাংলা সাহিত্য'
}

export interface QuoteData {
  quote: string;
  author: string;  // Changed from 'tone' to 'author'
  category: string;
  isBengali: boolean;
}

export interface GenerationState {
  loading: boolean;
  error: string | null;
  data: QuoteData | null;
}