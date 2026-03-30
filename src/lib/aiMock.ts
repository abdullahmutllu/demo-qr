import type { Lang, MenuItem } from '../types/order';
import { menuItems } from '../data/menu';

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export type AiSuggestion = {
  replyTr: string;
  replyEn: string;
  suggestedItems: MenuItem[];
  upsellItems: MenuItem[];
};

export function mockAiRespond(userMessage: string, lang: Lang): AiSuggestion {
  const q = normalize(userMessage);
  const matched = new Map<string, MenuItem>();

  for (const item of menuItems) {
    for (const kw of item.keywords) {
      if (q.includes(kw) || kw.includes(q)) {
        matched.set(item.id, item);
        break;
      }
    }
  }

  if (matched.size === 0) {
    return {
      replyTr:
        'Elbette yardımcı olurum. Deniz ürünleri, kokteyller veya ana yemeklerden bahsedebilirsiniz. Örneğin “levrek” veya “Aperol” yazabilirsiniz.',
      replyEn:
        "Happy to help. Mention seafood, cocktails, or mains — for example type 'sea bass' or 'Aperol'.",
      suggestedItems: menuItems.slice(0, 3),
      upsellItems: menuItems.filter((m) => m.id === 'm7' || m.id === 'm8').slice(0, 2),
    };
  }

  const suggested = [...matched.values()];
  const upsellIds = new Set<string>();
  for (const s of suggested) {
    for (const u of s.upsellIds ?? []) {
      upsellIds.add(u);
    }
  }
  const upsellItems = [...upsellIds]
    .map((id) => menuItems.find((m) => m.id === id))
    .filter((x): x is MenuItem => Boolean(x));

  const names = suggested.map((m) => (lang === 'tr' ? m.nameTr : m.nameEn)).join(', ');
  return {
    replyTr: `Harika seçim! ${names} için hemen hazırlık başlatabilirim. Yanına önerim aşağıda — ister misiniz?`,
    replyEn: `Great choice! I can fire ${names} right away. I also suggest the add-ons below.`,
    suggestedItems: suggested,
    upsellItems,
  };
}
