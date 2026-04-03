import asyncio
import json
from datetime import datetime
from typing import List, AsyncGenerator
from asyncio import Queue


class SSEService:
    def __init__(self):
        self.subscribers: List[Queue] = []

    def subscribe(self) -> Queue:
        queue: Queue = asyncio.Queue()
        self.subscribers.append(queue)
        return queue

    def unsubscribe(self, queue: Queue) -> None:
        if queue in self.subscribers:
            self.subscribers.remove(queue)

    async def broadcast(self, event_type: str, data: dict) -> None:
        payload = {
            "event": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
        }
        message = f"data: {json.dumps(payload)}\n\n"
        dead_queues = []
        for queue in self.subscribers:
            try:
                await queue.put(message)
            except Exception:
                dead_queues.append(queue)
        for q in dead_queues:
            self.unsubscribe(q)

    async def event_stream(self, queue: Queue) -> AsyncGenerator[str, None]:
        yield f"data: {json.dumps({'event': 'connected', 'message': 'ResilienceNet SSE stream active'})}\n\n"
        try:
            while True:
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield message
                except asyncio.TimeoutError:
                    yield ": heartbeat\n\n"
        except asyncio.CancelledError:
            pass


sse_service = SSEService()
