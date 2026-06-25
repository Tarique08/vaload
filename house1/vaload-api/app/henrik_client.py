from __future__ import annotations
import time
import logging
from typing import Any
import httpx
from app.config import Settings
from app.exceptions import HenrikRateLimitError, HenrikUnavailableError, InsufficientMatchDataError, PlayerNotFoundError
logger = logging.getLogger('vaload.henrik')
_MIN_MATCHES = 1

class HenrikClient:

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._base = settings.HENRIK_BASE_URL.rstrip('/')
        self._cache: dict[str, tuple[float, Any]] = {}
        self._http = httpx.AsyncClient(base_url=self._base, headers={'Authorization': settings.HENRIK_API_KEY}, timeout=httpx.Timeout(15.0, connect=5.0))

    async def close(self) -> None:
        await self._http.aclose()

    async def get_account(self, name: str, tag: str) -> dict[str, Any]:
        path = f'/valorant/v1/account/{name}/{tag}'
        return await self._fetch(path)

    async def get_mmr(self, region: str, name: str, tag: str) -> dict[str, Any]:
        path = f'/valorant/v2/mmr/{region}/{name}/{tag}'
        return await self._fetch(path)

    async def get_matches(self, region: str, name: str, tag: str, *, size: int=5, mode: str='competitive') -> list[dict[str, Any]]:
        path = f'/valorant/v3/matches/{region}/{name}/{tag}'
        params = {'size': str(size), 'mode': mode}
        data = await self._fetch(path, params=params)
        matches: list[dict[str, Any]] = data.get('data', data) if isinstance(data, dict) else data
        if isinstance(matches, dict):
            matches = matches.get('data', [])
        if len(matches) < _MIN_MATCHES:
            raise InsufficientMatchDataError(f'Found {len(matches)} match(es) but need at least {_MIN_MATCHES}.')
        return matches

    async def _fetch(self, path: str, params: dict[str, str] | None=None) -> Any:
        cache_key = f'{path}?{params}' if params else path
        now = time.time()
        if len(self._cache) > 100:
            self._cache = {k: v for k, v in self._cache.items() if now - v[0] < 120}
        if cache_key in self._cache:
            timestamp, cached_data = self._cache[cache_key]
            if now - timestamp < 60:
                logger.info(f'Henrik cache HIT: {cache_key}')
                return cached_data
        logger.info(f'Henrik cache MISS: {cache_key}')
        try:
            resp = await self._http.get(path, params=params)
        except httpx.TimeoutException as exc:
            raise HenrikUnavailableError('Request to data source timed out.') from exc
        except httpx.HTTPError as exc:
            raise HenrikUnavailableError(str(exc)) from exc
        if resp.status_code == 404:
            raise PlayerNotFoundError()
        if resp.status_code == 429:
            raise HenrikRateLimitError()
        if resp.status_code >= 500:
            raise HenrikUnavailableError(f'Upstream returned {resp.status_code}.')
        if resp.status_code == 403:
            raise HenrikUnavailableError('Access forbidden — the API may be under maintenance.')
        resp.raise_for_status()
        data = resp.json()
        self._cache[cache_key] = (now, data)
        return data