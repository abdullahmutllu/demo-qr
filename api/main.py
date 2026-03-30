"""Minimal demo API: POST /chat (optional OpenAI), WebSocket /ws/orders fan-out for multi-tab sync."""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="demo-qr API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatBody(BaseModel):
    messages: list[dict[str, Any]]


class Hub:
    def __init__(self) -> None:
        self.clients: list[WebSocket] = []

    async def register(self, ws: WebSocket) -> None:
        self.clients.append(ws)

    def unregister(self, ws: WebSocket) -> None:
        if ws in self.clients:
            self.clients.remove(ws)

    async def broadcast(self, message: str) -> None:
        stale: list[WebSocket] = []
        for client in self.clients:
            try:
                await client.send_text(message)
            except Exception:
                stale.append(client)
        for client in stale:
            self.unregister(client)


hub = Hub()


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/chat")
def chat(body: ChatBody) -> dict[str, str]:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        return {
            "reply": (
                "[demo-api] OPENAI_API_KEY tanımlı değil. "
                "Render/Railway ortam değişkeni ekleyin veya mock sohbeti kullanın."
            )
        }
    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        res = client.chat.completions.create(
            model=model,
            messages=body.messages,
            max_tokens=500,
        )
        choice = res.choices[0].message.content or ""
        return {"reply": choice.strip()}
    except Exception as e:  # noqa: BLE001 — demo API
        return {"reply": f"[demo-api] OpenAI hata: {e!s}"}


@app.websocket("/ws/orders")
async def ws_orders(ws: WebSocket) -> None:
    await ws.accept()
    await hub.register(ws)
    try:
        while True:
            data = await ws.receive_text()
            await hub.broadcast(data)
    except WebSocketDisconnect:
        hub.unregister(ws)
