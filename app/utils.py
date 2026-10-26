from datetime import UTC, datetime, timezone
from urllib.parse import ParseResult, urlparse

ALLOWED_HOSTS = ("github.com", "gitlab.com")


def utcnow() -> datetime:
    return datetime.now(UTC)


def serialize_datetime(value: datetime | None) -> str | None:
    if value is None:
        return None

    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)

    return value.astimezone(UTC).isoformat()


def is_allowed_url(url: str) -> bool:
    if not url:
        return False

    parsed: ParseResult = urlparse(url)
    if parsed.scheme in ("http", "https"):
        host: str | None = parsed.hostname

        return host is not None and host.lower() in ALLOWED_HOSTS

    if url.startswith("git@"):
        rest: str = url[len("git@") :]
        host, sep, path = rest.partition(":")

        return bool(sep) and bool(host) and bool(path) and host.lower() in ALLOWED_HOSTS

    return False
