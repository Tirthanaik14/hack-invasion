from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.sse_service import sse_service

router = APIRouter(prefix="/events", tags=["Real-Time Events"])


@router.get("/stream")
async def event_stream():
    queue = sse_service.subscribe()

    async def stream_generator():
        try:
            async for message in sse_service.event_stream(queue):
                yield message
        finally:
            sse_service.unsubscribe(queue)

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        },
    )
