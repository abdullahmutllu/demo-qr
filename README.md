# QR Sipariş AI — Demo

QR tabanlı AI sipariş arayüz demosu (müşteri sohbeti TR/EN, KDS, garson bildirimi, patron paneli; simülasyon + isteğe bağlı FastAPI).

**Canlı:** https://abdullahmutllu.github.io/demo-qr/

---

## GitHub Pages

`main` dalına push sonrası [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) `gh-pages` dalını günceller.

**İlk kurulum:** GitHub → repo **Settings → Pages** → **Build and deployment** kaynağı: **Deploy from a branch** → Branch **`gh-pages`**, folder **`/`** (root).

## Yerelde çalıştırma

```bash
npm ci
npm run dev
```

- Personel: [http://localhost:5173/](http://localhost:5173/)
- Müşteri (örnek QR): [http://localhost:5173/v/bora-beach/m/7](http://localhost:5173/v/bora-beach/m/7)

## 3 dakikalık demo senaryosu

1. **Üç sekme:** (1) Müşteri QR URL’si, (2) Mutfak veya Bar, (3) Patron.
2. Müşteri: dil **EN**, “sea bass and Aperol” → **+** ile sepet → **Submit order**.
3. KDS ve Patron’da sipariş; Garson’da bildirim.
4. “POS ve PostgreSQL burada mock; NDA sonrası gerçek entegrasyon.”

## Opsiyonel API (FastAPI)

`api/` — `POST /chat` (OpenAI), `WebSocket /ws/orders`. Yerel: `uvicorn main:app --reload --port 8000`. Ayrıntılar için klasördeki `Dockerfile` ve `requirements.txt`.

Frontend `.env.local`:

```env
VITE_OPENAI_PROXY_URL=http://127.0.0.1:8000
VITE_WS_URL=http://127.0.0.1:8000
```

## Teknoloji

Vite, React 19, TypeScript, Tailwind CSS 4, React Router 7, Recharts, Lucide.

## Lisans

Özel demo — iş görüşmesi için.
