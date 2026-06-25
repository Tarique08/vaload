from __future__ import annotations

class VaLoadError(Exception):
    status_code: int = 500
    detail: str = 'An unexpected error occurred.'

    def __init__(self, detail: str | None=None) -> None:
        self.detail = detail or self.__class__.detail
        super().__init__(self.detail)

class PlayerNotFoundError(VaLoadError):
    status_code = 404
    detail = 'Player not found. Double-check the name, tag, and region.'

class HenrikRateLimitError(VaLoadError):
    status_code = 429
    detail = 'Rate limit reached — please wait a moment and try again.'

class HenrikUnavailableError(VaLoadError):
    status_code = 503
    detail = 'The data source is temporarily unavailable. Try again shortly.'

class InsufficientMatchDataError(VaLoadError):
    status_code = 422
    detail = 'Not enough competitive match data to compute metrics.'