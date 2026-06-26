from __future__ import annotations
import logging
import httpx
from contextlib import asynccontextmanager
from typing import Any
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
from app.exceptions import VaLoadError
from app.henrik_client import HenrikClient
from app.metrics_engine import compute_all_metrics
settings = get_settings()
logging.basicConfig(level=settings.LOG_LEVEL, format='%(asctime)s | %(name)-20s | %(levelname)-7s | %(message)s')
logger = logging.getLogger('vaload.api')

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = HenrikClient(settings)
    app.state.henrik = client
    logger.info('Henrik client initialised.')
    yield
    await client.close()
    logger.info('Henrik client shut down.')
app = FastAPI(title='Vaload API', description='Stateless Valorant metrics engine — Ghost Architecture.', version='1.0.0', docs_url='/docs', redoc_url=None, lifespan=lifespan)
from pydantic import BaseModel
from datetime import datetime

class Feedback(BaseModel):
    message: str
    name: str | None = None
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['GET', 'POST', 'OPTIONS'], allow_headers=['*'], allow_credentials=False)

@app.exception_handler(VaLoadError)
async def vaload_error_handler(_request: Request, exc: VaLoadError) -> JSONResponse:
    logger.warning('VaLoadError [%s]: %s', exc.status_code, exc.detail)
    return JSONResponse(status_code=exc.status_code, content={'error': exc.detail})

@app.get('/api/health')
async def health_check():
    return {'status': 'alive', 'cache': 'intact'}

@app.get('/api/v1/analyze/{region}/{name}/{tag}', tags=['player', 'metrics'])
async def get_analyze(region: str, name: str, tag: str, request: Request) -> dict[str, Any]:
    henrik: HenrikClient = request.app.state.henrik
    import asyncio
    account_task = henrik.get_account(name, tag)
    mmr_task = henrik.get_mmr(region, name, tag)
    matches_task = henrik.get_matches(region, name, tag, size=10, mode='competitive')
    account_data, mmr_data, matches = await asyncio.gather(account_task, mmr_task, matches_task)
    acct = account_data.get('data', account_data)
    mmr = mmr_data.get('data', mmr_data)
    puuid: str = acct.get('puuid', '')
    if not puuid:
        from app.exceptions import PlayerNotFoundError
        raise PlayerNotFoundError('Could not resolve player PUUID.')
    metrics = compute_all_metrics(matches, puuid)
    return {'profile': {'account': {'puuid': puuid, 'name': acct.get('name', name), 'tag': acct.get('tag', tag), 'region': region, 'account_level': acct.get('account_level'), 'card': acct.get('card', {})}, 'rank': {'current_tier': mmr.get('current_data', {}).get('currenttierpatched'), 'current_rr': mmr.get('current_data', {}).get('ranking_in_tier'), 'elo': mmr.get('current_data', {}).get('elo'), 'highest_tier': mmr.get('highest_rank', {}).get('patched_tier')}}, 'metrics': metrics}

@app.post('/api/v1/feedback', tags=['feedback'])
async def submit_feedback(feedback: Feedback) -> dict[str, str]:
    timestamp = datetime.now().isoformat()
    log_entry = f"[{timestamp}] NAME: {feedback.name or 'N/A'} | MESSAGE: {feedback.message}\n"
    if settings.DISCORD_WEBHOOK_URL:
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    settings.DISCORD_WEBHOOK_URL,
                    json={"content": f"**New Feedback**\n**Name:** {feedback.name or 'N/A'}\n**Message:** {feedback.message}"}
                )
        except Exception as e:
            logger.error(f"Failed to send feedback to Discord: {e}")

    with open('feedback.log', 'a', encoding='utf-8') as f:
        f.write(log_entry)
    logger.info('Received new feedback.')
    return {'status': 'success', 'message': 'Feedback logged successfully.'}