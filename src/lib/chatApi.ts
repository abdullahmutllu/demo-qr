type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function fetchOpenAiProxyReply(messages: ChatMessage[]): Promise<string> {
  const base = import.meta.env.VITE_OPENAI_PROXY_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('VITE_OPENAI_PROXY_URL tanımlı değil');
  }
  const res = await fetch(`${base}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { reply?: string; message?: string };
  const reply = data.reply ?? data.message;
  if (typeof reply !== 'string' || !reply.trim()) {
    throw new Error('Beklenmeyen API yanıtı');
  }
  return reply.trim();
}
