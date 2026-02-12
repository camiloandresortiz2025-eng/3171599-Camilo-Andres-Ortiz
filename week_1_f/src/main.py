from fastapi import FastAPI, HTTPException

GREETINGS: dict[str, str] = {
    "es": "¡Hola, {name}!",
    "en": "Hello, {name}!",
    "fr": "Bonjour, {name}!",
    "de": "Hallo, {name}!",
    "it": "Ciao, {name}!",
    "pt": "Olá, {name}!",
}

SUPPORTED_LANGUAGES: list[str] = list(GREETINGS.keys())

app: FastAPI = FastAPI(
    title="Greeting API",
    description="API de saludos multiidioma",
    version="1.0.0",
)


@app.get("/")
async def root() -> dict[str, str | list[str]]:
    return {
        "name": "Greeting API",
        "version": "1.0.0",
        "docs": "/docs",
        "languages": SUPPORTED_LANGUAGES,
    }


@app.get("/greet/{name}")
async def greet(
    name: str,
    language: str = "es",
) -> dict[str, str]:
    template: str = GREETINGS.get(language, GREETINGS["es"])
    greeting: str = template.format(name=name)
    return {
        "greeting": greeting,
        "language": language if language in GREETINGS else "es",
        "name": name,
    }


@app.get("/greet/{name}/formal")
async def greet_formal(
    name: str,
    title: str = "Sr./Sra.",
) -> dict[str, str]:
    greeting: str = f"Estimado/a {title} {name}, es un placer saludarle."
    return {
        "greeting": greeting,
        "title": title,
        "name": name,
    }


def get_day_period(hour: int) -> tuple[str, str]:
    if 5 <= hour < 12:
        return ("Buenos días", "morning")
    elif 12 <= hour < 18:
        return ("Buenas tardes", "afternoon")
    else:
        return ("Buenas noches", "night")


@app.get("/greet/{name}/time-based")
async def greet_time_based(
    name: str,
    hour: int,
) -> dict[str, str | int]:
    if hour < 0 or hour > 23:
        raise HTTPException(
            status_code=400,
            detail="La hora debe estar entre 0 y 23",
        )
    greeting_text, period = get_day_period(hour)
    return {
        "greeting": f"{greeting_text}, {name}!",
        "hour": hour,
        "period": period,
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "greeting-api",
        "version": "1.0.0",
    }
